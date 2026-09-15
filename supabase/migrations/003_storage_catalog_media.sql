-- Product & category images (catalog media) — public read, staff upload

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog-media',
  'catalog-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Brochures bucket: allow PDFs + images (extends 002)
update storage.buckets
set
  file_size_limit = 52428800,
  allowed_mime_types = array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
where id = 'brochures';

drop policy if exists "public read catalog media" on storage.objects;
drop policy if exists "staff upload catalog media" on storage.objects;
drop policy if exists "staff update catalog media" on storage.objects;
drop policy if exists "staff delete catalog media" on storage.objects;

create policy "public read catalog media"
  on storage.objects for select
  using (bucket_id = 'catalog-media');

create policy "staff upload catalog media"
  on storage.objects for insert
  with check (bucket_id = 'catalog-media' and public.is_staff());

create policy "staff update catalog media"
  on storage.objects for update
  using (bucket_id = 'catalog-media' and public.is_staff());

create policy "staff delete catalog media"
  on storage.objects for delete
  using (bucket_id = 'catalog-media' and public.is_staff());
