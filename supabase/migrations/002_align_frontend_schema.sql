-- Align Supabase with existing Avalon frontend (extends 001 — do not re-create tables)

-- ---------------------------------------------------------------------------
-- Roles (staff access)
-- ---------------------------------------------------------------------------
alter table public.admin_profiles drop constraint if exists admin_profiles_role_check;

alter table public.admin_profiles
  add constraint admin_profiles_role_check check (
    role in (
      'super_admin',
      'admin',
      'product_manager',
      'content_manager',
      'dealer_manager',
      'sales_manager',
      'editor'
    )
  );

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles ap
    where ap.user_id = auth.uid()
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_staff();
$$;

-- ---------------------------------------------------------------------------
-- Products & categories
-- ---------------------------------------------------------------------------
alter table public.products
  add column if not exists is_featured boolean not null default false,
  add column if not exists seo_title text,
  add column if not exists seo_description text;

alter table public.categories
  add column if not exists parent_id uuid references public.categories (id) on delete set null,
  add column if not exists image_url text,
  add column if not exists banner_url text,
  add column if not exists seo_title text,
  add column if not exists seo_description text;

create index if not exists products_featured_idx on public.products (is_featured) where is_featured = true;
create index if not exists products_published_idx on public.products (is_published) where is_published = true;

-- ---------------------------------------------------------------------------
-- Brochures / catalogues / downloads
-- ---------------------------------------------------------------------------
alter table public.brochures
  add column if not exists description text,
  add column if not exists kind text not null default 'brochure'
    check (kind in ('brochure', 'catalogue', 'warranty', 'guide')),
  add column if not exists category_label text,
  add column if not exists collection_label text,
  add column if not exists version text,
  add column if not exists storage_path text,
  add column if not exists download_count int not null default 0;

-- ---------------------------------------------------------------------------
-- Stories (blog-style)
-- ---------------------------------------------------------------------------
alter table public.stories
  add column if not exists slug text unique,
  add column if not exists is_featured boolean not null default false,
  add column if not exists status text not null default 'published'
    check (status in ('draft', 'published')),
  add column if not exists tags text[] default '{}',
  add column if not exists category_label text,
  add column if not exists seo_title text,
  add column if not exists seo_description text;

-- ---------------------------------------------------------------------------
-- Dealers
-- ---------------------------------------------------------------------------
alter table public.dealers
  add column if not exists dealer_code text,
  add column if not exists contact_person text,
  add column if not exists email text,
  add column if not exists whatsapp text,
  add column if not exists district text,
  add column if not exists state text,
  add column if not exists maps_url text,
  add column if not exists dealer_type text;

create unique index if not exists dealers_dealer_code_idx on public.dealers (dealer_code)
where dealer_code is not null;

create index if not exists dealers_geo_idx on public.dealers (lat, lng) where is_active = true;

-- ---------------------------------------------------------------------------
-- Contact enquiries
-- ---------------------------------------------------------------------------
alter table public.contact_submissions
  add column if not exists state text,
  add column if not exists pincode text,
  add column if not exists whatsapp text,
  add column if not exists product_slug text,
  add column if not exists source_page text,
  add column if not exists assigned_to uuid references auth.users (id),
  add column if not exists notification_log jsonb not null default '[]'::jsonb;

create index if not exists contact_submissions_status_idx on public.contact_submissions (status);
create index if not exists contact_submissions_created_idx on public.contact_submissions (created_at desc);

-- ---------------------------------------------------------------------------
-- Dealer applications (match frontend statuses)
-- ---------------------------------------------------------------------------
alter table public.dealer_applications drop constraint if exists dealer_applications_status_check;

update public.dealer_applications set status = 'pending' where status = 'new';
update public.dealer_applications set status = 'under_review' where status = 'reviewing';
update public.dealer_applications set status = 'rejected' where status in ('declined', 'archived');

alter table public.dealer_applications
  add constraint dealer_applications_status_check check (
    status in ('pending', 'under_review', 'approved', 'rejected')
  );

alter table public.dealer_applications
  alter column status set default 'pending';

-- ---------------------------------------------------------------------------
-- Site settings defaults
-- ---------------------------------------------------------------------------
insert into public.site_settings (key, value)
values
  (
    'company',
    '{
      "name": "Avalon Premium Mattress",
      "tagline": "Better Sleep. A Brighter Tomorrow.",
      "phone": "+91 99406 58449",
      "whatsapp": "",
      "email": "theavalonlifestyle@gmail.com",
      "sales_email": "",
      "support_email": "",
      "address": "16/1, Pillayar Koil Street, Velapanchavadi, Chennai - 600077",
      "map_embed_query": "16/1, Pillayar Koil Street, Velapanchavadi, Chennai, Tamil Nadu 600077, India",
      "hours": "Mon – Sat, 9 AM – 6 PM",
      "social": {
        "instagram": "https://instagram.com",
        "facebook": "https://facebook.com",
        "youtube": "https://youtube.com",
        "linkedin": "https://linkedin.com"
      }
    }'::jsonb
  ),
  (
    'email',
    '{
      "main_email": "theavalonlifestyle@gmail.com",
      "sales_email": "",
      "dealer_notification_enabled": true,
      "customer_confirmation_enabled": true,
      "dealer_search_radius_km": 25,
      "dealer_suggestions_count": 3
    }'::jsonb
  )
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Audit log
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

create policy "staff read audit logs"
  on public.audit_logs for select
  using (public.is_staff());

create policy "staff insert audit logs"
  on public.audit_logs for insert
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Public read company/branding settings (no secrets)
-- ---------------------------------------------------------------------------
drop policy if exists "public read company settings" on public.site_settings;

create policy "public read company settings"
  on public.site_settings for select
  using (key in ('company', 'branding'));

-- ---------------------------------------------------------------------------
-- Storage: brochures bucket (run once; adjust if bucket exists)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('brochures', 'brochures', true)
on conflict (id) do nothing;

create policy "public read brochure files"
  on storage.objects for select
  using (bucket_id = 'brochures');

create policy "staff upload brochure files"
  on storage.objects for insert
  with check (bucket_id = 'brochures' and public.is_staff());

create policy "staff update brochure files"
  on storage.objects for update
  using (bucket_id = 'brochures' and public.is_staff());

create policy "staff delete brochure files"
  on storage.objects for delete
  using (bucket_id = 'brochures' and public.is_staff());
