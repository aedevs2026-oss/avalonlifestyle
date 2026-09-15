# Frontend → Admin Panel Mapping (Avalon Lifestyle)

This document maps the **existing customer-facing site** (source of truth) to Supabase and `/admin`.  
No duplicate tables: extend `001_admin_schema.sql` via `002_align_frontend_schema.sql`.

## Existing frontend inventory

| Area | Route / component | Data today | Admin module | Supabase |
|------|-------------------|------------|--------------|----------|
| Home | `app/page.js`, `components/home/*` | Mixed static + `lib/products` for featured slider | Products (featured), Stories (optional) | `products.is_featured`, `stories` |
| Mattresses | `app/mattresses/MattressesClient.js` | `products`, `mattressCategories` | Products, Categories | `products`, `categories` |
| Product detail | `app/products/[slug]/*` | Full product object in `lib/products.js` | Products | `products` + `payload` JSON |
| Product catalog | `app/product-catalog/*` | Same products | Products | `products` |
| Compare | `MattressesClient` + `CompareSlider` | Product specs from list | Products | `payload` |
| Furniture | `app/furniture/*` | `furnitureCategories` static | Categories (future) | optional |
| Find dealer | `app/find-a-dealer/*`, `DealerMap` | `dealers` in `lib/products.js` | Dealers | `dealers` |
| Near store | `NearStoreWelcome`, `lib/geo.js` | Same dealers + GPS | Dealer config in Settings | `dealers`, settings |
| Contact | `app/contact/ContactClient.js` | `siteConfig`, form fields | Contact inbox, Settings | `contact_submissions`, `site_settings` |
| Become dealer | `BecomeDealerClient.js` | Form fields | Dealer applications | `dealer_applications` |
| Resources | `app/resources/page.js` | Hardcoded `downloads`, `guides`, `videos` | Brochures & catalogues | `brochures` (+ storage) |
| Home insights | `HomeInsights.js` | Hardcoded articles | Stories (when published) | `stories` |
| Avalon story | `HomeStory.js` | Hardcoded copy | Stories / site copy (optional) | `stories` or settings |
| Brand / SEO | `app/layout.js`, per-page `metadata` | Static | SEO on products/stories/brochures | column fields in DB |
| Wishlist | `lib/wishlist.js` | localStorage | — | not required |

## Product shape (frontend — do not invent fields)

Defined in `lib/products.js` per mattress:

- `slug`, `name`, `type` (category label)
- `badge`, `badgeColor`
- `image`, `layersImage`
- `thickness`, `warranty`, `usage`, `fabric?`
- `specs`, `shortSpecs`, `tagline`, `description`
- `highlights[]`, `layers[]`
- `rating`, `reviews`
- `sizes[]` → `{ id, name, dimensions, price }`
- `price` (base)

Admin stores: columns `slug`, `name`, `product_type`, `category_id`, `is_published`, `is_featured`, `sort_order`, SEO + **`payload` JSON** matching the above.

## Category shape (frontend)

`mattressCategories` string list (filter chips). Admin `categories` table maps `name` ↔ filter `type` on products.

No separate subcategories/brands/collections on site today — **not built in admin** until frontend uses them.

## Contact form fields (exact)

- `name`, `email`, `phone`, `city`
- `subject` (select: general, product, warranty, dealer)
- `message`

Extended in API (optional): `state`, `pincode`, `source_page`, GPS via `clientLocation`.

## Become a dealer fields (exact)

- `name`, `business`, `email`, `phone`, `city`, `businessType`, `message`

## Dealer locator fields (exact)

- `id`, `name`, `address`, `city`, `pincode`, `lat`, `lng`, `phone`, `hoursWeek`, `hoursSun`

Extended in admin/DB: `email`, `whatsapp`, `dealer_code`, `contact_person`, `district`, `state`, `dealer_type`, `maps_url`.

## Brochures / catalogues (Resources page)

Frontend card: `{ title, size, image }`.  
Admin `brochures` + `kind`: `brochure` | `catalogue` | `warranty` | `guide`.

## What stays hardcoded (until you add UI)

- Furniture product SKUs (no product list on furniture page)
- Resource **videos** and **guides** sections (paths in `lib/assets.js`)
- FAQ copy in `lib/site.js` (unless moved to CMS later)
- Marketing page heroes (About, Why Avalon, etc.)

## Dynamic connection strategy

1. `lib/cms/*` loads published rows from Supabase.
2. If DB empty or unavailable → **fallback to existing `lib/products.js` / `lib/site.js`** (zero visual change).
3. Customer UI components unchanged; only data sources switch.

## Security

- Public: read published content + active dealers via RLS / public API.
- Writes: service role in API routes + admin server actions after Auth + `admin_profiles`.
- Service role never in browser.
