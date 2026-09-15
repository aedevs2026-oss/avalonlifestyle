# Avalon Admin Panel & Supabase Setup

## 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run (in order):
   - `supabase/migrations/001_admin_schema.sql`
   - `supabase/migrations/002_align_frontend_schema.sql`
   - `supabase/migrations/003_storage_catalog_media.sql` (image/PDF uploads)

See **`docs/FRONTEND_ADMIN_MAPPING.md`** for frontend ↔ admin mapping.

## 2. Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Where to find it |
|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API (anon public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API (**server only**, never expose to browser) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Your mail provider (Gmail App Password, etc.) — **password only in `.env.local`** |
| `SMTP_FROM`, `SMTP_FROM_NAME` | Optional; can also set in Admin → Settings |
| `RESEND_API_KEY` | Optional — if provider is set to Resend in admin |
| `MAIN_CONTACT_EMAIL` | Fallback notification address |

### SMTP (Gmail example)

In **Admin → Settings → SMTP**:

- Provider: **SMTP**
- Host: `smtp.gmail.com`, Port: `587`, SSL off
- Username: your Gmail address
- From name / from email: Avalon / `theavalonlifestyle@gmail.com`

In **`.env.local`** only:

```
SMTP_PASSWORD=your-16-char-google-app-password
```

Use **Send SMTP test** on the settings page to verify.

## 3. Create an admin user (strong credentials)

1. In Supabase **Authentication → Users**, create a user with a **strong unique password** (password manager recommended).
2. Copy the user UUID.
3. In SQL Editor:

```sql
insert into public.admin_profiles (user_id, email, full_name, role)
values (
  'YOUR-USER-UUID-HERE',
  'admin@yourcompany.com',
  'Avalon Admin',
  'admin'
);
```

Only users listed in `admin_profiles` can access `/admin` (enforced in middleware and RLS).

## 4. Seed entire frontend into Supabase (recommended)

From the project root (with `.env.local` configured):

```bash
npm run seed
```

This syncs **everything currently on the website** into the admin database:

- Company, email, branding, and FAQ settings (`lib/site.js`)
- All mattress **categories** and **products** (full payload from `lib/products.js`)
- Featured flags matching the home/mattresses collection order
- All **dealers** from Find a Dealer
- **Brochures & catalogues** from the Resources page
- **Stories** from Home insights, resource guides, and resource videos

Re-run `npm run seed` any time you change static frontend data and want admin to match.

## 5. Admin URL

- Sign in: `/admin/login`
- Console: `/admin`

## 6. Contact flow

When a customer submits **Contact**:

1. Submission is stored in `contact_submissions`.
2. Up to N nearest dealers (by km, using GPS if allowed) are saved and included in the email.
3. Email goes to **Main notification email** (Settings in admin, or `MAIN_CONTACT_EMAIL`).

## 7. Security notes

- Never commit `.env.local` or the service role key.
- Use Supabase **Auth** only for admins; public forms use API routes + service role inserts.
- Rotate keys if leaked; restrict Supabase **Database** network if needed.
- Enable **Leaked password protection** and MFA for admin emails in Supabase Auth settings (recommended).
