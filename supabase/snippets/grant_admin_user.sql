-- After creating a user in Supabase → Authentication → Users,
-- paste their UUID below and run in SQL Editor.

insert into public.admin_profiles (user_id, email, full_name, role)
values (
  'PASTE-AUTH-USER-UUID-HERE',
  'your-admin@email.com',
  'Avalon Admin',
  'super_admin'
)
on conflict (user_id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role;
