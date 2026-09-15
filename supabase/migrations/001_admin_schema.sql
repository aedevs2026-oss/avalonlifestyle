-- Avalon Lifestyle admin schema (run in Supabase SQL editor)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admin access (link Supabase Auth users to admin roles)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and ap.role in ('admin', 'editor')
  );
$$;

-- ---------------------------------------------------------------------------
-- Site configuration (notification email, contact defaults — not secrets)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (key, value)
values
  ('contact', '{"main_email":"theavalonlifestyle@gmail.com","dealer_suggestions_count":3,"default_radius_km":50}'::jsonb),
  ('branding', '{"site_name":"Avalon Premium Mattress"}'::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  product_type text,
  payload jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  body text,
  image_url text,
  video_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brochures (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text not null,
  file_size_label text,
  cover_image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Dealers & enquiries
-- ---------------------------------------------------------------------------
create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  legacy_id int,
  name text not null,
  address text not null,
  city text not null,
  pincode text,
  phone text,
  lat double precision,
  lng double precision,
  hours_week text,
  hours_sun text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists dealers_legacy_id_idx on public.dealers (legacy_id)
where legacy_id is not null;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  city text,
  subject text,
  message text not null,
  user_lat double precision,
  user_lng double precision,
  nearest_dealers jsonb,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  admin_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.dealer_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text not null,
  email text not null,
  phone text not null,
  city text,
  business_type text,
  message text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'declined', 'archived')),
  admin_notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.stories enable row level security;
alter table public.brochures enable row level security;
alter table public.dealers enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.dealer_applications enable row level security;

-- Admin profiles: admins read own row; only service role creates admins
create policy "admins read own profile"
  on public.admin_profiles for select
  using (auth.uid() = user_id or public.is_admin());

-- Public read for published catalogue
create policy "public read active categories"
  on public.categories for select
  using (is_active = true);

create policy "public read published products"
  on public.products for select
  using (is_published = true);

create policy "public read published stories"
  on public.stories for select
  using (is_published = true);

create policy "public read published brochures"
  on public.brochures for select
  using (is_published = true);

create policy "public read active dealers"
  on public.dealers for select
  using (is_active = true);

-- Admin manage all content
create policy "admins manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins manage stories"
  on public.stories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins manage brochures"
  on public.brochures for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins manage dealers"
  on public.dealers for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins manage site_settings"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins read contact submissions"
  on public.contact_submissions for select
  using (public.is_admin());

create policy "admins update contact submissions"
  on public.contact_submissions for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins read dealer applications"
  on public.dealer_applications for select
  using (public.is_admin());

create policy "admins update dealer applications"
  on public.dealer_applications for update
  using (public.is_admin())
  with check (public.is_admin());

-- After creating a user in Supabase Auth, grant admin:
-- insert into public.admin_profiles (user_id, email, full_name, role)
-- values ('<auth-user-uuid>', 'you@company.com', 'Admin', 'admin');
