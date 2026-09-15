/**
 * Single source for “what the live site shows today” — used by scripts/seed-supabase.mjs.
 * Re-exports and normalizes data from existing frontend modules (no new product copy).
 */
import { assets } from "../assets.js";
import {
  dealers,
  products,
  mattressCategories,
  mattressCollectionOrder,
} from "../products.js";
import { siteConfig, socialLinks, faqItems } from "../site.js";

export { dealers, products, mattressCategories, mattressCollectionOrder };

/** Mattresses page category filter thumbnails — paths under `public/` only (no Storage upload on seed). */
export const categoryThumbnailByName = {
  "Pocket Spring": assets.products.king,
  "Memory Foam": assets.products.celeste,
  Latex: assets.products.brittany,
  "Gel Memory Foam": assets.products.prada,
  "Bonnell Spring": assets.products.elita,
  "Ortho Support": assets.products.magna,
};

export const companySettings = {
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  phone: siteConfig.phone,
  whatsapp: siteConfig.phone,
  email: siteConfig.email,
  sales_email: siteConfig.email,
  support_email: siteConfig.email,
  address: siteConfig.address,
  map_embed_query: siteConfig.mapEmbedQuery,
  hours: "Mon – Sat, 9 AM – 6 PM",
  social: {
    instagram: socialLinks.find((s) => s.icon === "instagram")?.href ?? "",
    facebook: socialLinks.find((s) => s.icon === "facebook")?.href ?? "",
    youtube: socialLinks.find((s) => s.icon === "youtube")?.href ?? "",
    linkedin: socialLinks.find((s) => s.icon === "linkedin")?.href ?? "",
  },
};

export const emailSettings = {
  provider: "smtp",
  main_email: siteConfig.email,
  sales_email: siteConfig.email,
  dealer_notification_enabled: true,
  customer_confirmation_enabled: true,
  dealer_search_radius_km: 25,
  dealer_suggestions_count: 3,
  smtp_host: "smtp.gmail.com",
  smtp_port: 587,
  smtp_secure: false,
  smtp_user: siteConfig.email,
  from_name: "Avalon Premium Mattress",
  from_email: siteConfig.email,
};

export const brandingSettings = {
  site_name: siteConfig.name,
  copyright: siteConfig.copyright,
};

/** Resources page — Featured downloads */
export const brochureDownloads = [
  {
    title: "Product Catalogue 2024",
    file_size_label: "12.5 MB",
    cover_image_url: assets.products.prince,
    kind: "catalogue",
    category_label: "Catalogue",
    version: "2024",
    description: "Full Avalon mattress and furniture catalogue.",
  },
  {
    title: "Mattress Collection Brochure",
    file_size_label: "8.2 MB",
    cover_image_url: assets.products.king,
    kind: "brochure",
    category_label: "Mattresses",
    version: "2024",
    description: "Mattress collection overview and specifications.",
  },
  {
    title: "Furniture Collection Brochure",
    file_size_label: "6.4 MB",
    cover_image_url: assets.home.sofa,
    kind: "brochure",
    category_label: "Furniture",
    version: "2024",
    description: "Furniture range brochure.",
  },
  {
    title: "Materials & Technology Guide",
    file_size_label: "4.2 MB",
    cover_image_url: assets.mattresses.detail,
    kind: "guide",
    category_label: "Guides",
    version: "2024",
    description: "Materials and sleep technology guide.",
  },
  {
    title: "Warranty Information",
    file_size_label: "2.1 MB",
    cover_image_url: assets.home.manufacturing,
    kind: "warranty",
    category_label: "Warranty",
    version: "2024",
    description: "Warranty terms and coverage.",
  },
];

/** Home insights + resources guides → stories */
export const storyEntries = [
  {
    slug: "science-of-better-sleep",
    title: "The Science of Better Sleep",
    excerpt: "Learn how quality sleep improves your health and productivity.",
    image_url: assets.home.moreThanMattress,
    category_label: "Insights",
    is_featured: true,
    sort_order: 0,
  },
  {
    slug: "choose-the-right-mattress",
    title: "How to Choose the Right Mattress",
    excerpt: "A simple guide to finding your perfect comfort.",
    image_url: assets.tryBeforeYouBuy.bedroom,
    category_label: "Buying Guide",
    is_featured: true,
    sort_order: 1,
  },
  {
    slug: "comfortable-living-spaces",
    title: "Creating Comfortable Living Spaces",
    excerpt: "Design ideas for a more relaxing and beautiful home.",
    image_url: assets.home.sofa,
    category_label: "Living",
    is_featured: false,
    sort_order: 2,
  },
  {
    slug: "10-tips-better-sleep",
    title: "10 Tips for Better Sleep",
    excerpt: "Simple habits that can help you sleep better every night.",
    image_url: assets.home.moreThanMattress,
    category_label: "SLEEP GUIDE",
    is_featured: false,
    sort_order: 3,
  },
  {
    slug: "healthier-home-guide",
    title: "Creating a Healthier Home",
    excerpt: "Furniture ideas for a more comfortable and beautiful living space.",
    image_url: assets.home.findShowroom,
    category_label: "LIVING GUIDE",
    is_featured: false,
    sort_order: 4,
  },
];

export const faqSettings = { items: faqItems };

export const resourceVideos = [
  {
    title: "The Avalon Difference",
    excerpt: "Quality. Comfort. Trust.",
    video_url: assets.resources.avalonDifference,
    image_url: assets.products.prince,
    sort_order: 10,
  },
  {
    title: "Inside Our Manufacturing",
    excerpt: "Crafted with Care",
    video_url: assets.resources.manufacturing,
    image_url: assets.home.manufacturing,
    sort_order: 11,
  },
  {
    title: "A Healthier Tomorrow",
    excerpt: "Because Better Sleep Matters",
    video_url: assets.resources.feelBetter,
    image_url: assets.home.moreThanMattress,
    sort_order: 12,
  },
];
