/**
 * Furniture page photography — local files under `public/`.
 * Couches card uses brand asset `public/assets/Home/crouches.png`.
 */

import { assets } from "@/lib/assets";

const base = "/assets/furniture";

export const furnitureImages = {
  hero: `${base}/hero.jpg`,

  featured: {
    sofas: `${base}/featured-sofas.jpg`,
    couches: assets.home.couches,
    chairs: `${base}/featured-chairs.jpg`,
    tables: `${base}/featured-tables.jpg`,
  },

  lifestyle: [
    { image: `${base}/lifestyle-bedroom.jpg`, label: "Bedroom" },
    { image: `${base}/lifestyle-living.jpg`, label: "Living room" },
    { image: `${base}/lifestyle-dining.jpg`, label: "Dining" },
  ],

  rooms: {
    livingRoom: `${base}/room-living.jpg`,
    bedroom: `${base}/lifestyle-bedroom.jpg`,
    diningRoom: `${base}/featured-tables.jpg`,
  },

  craftsmanship: `${base}/craftsmanship.jpg`,
  cta: `${base}/cta.jpg`,

  avatars: {
    anitha: `${base}/avatar-anitha.jpg`,
    karthik: `${base}/avatar-karthik.jpg`,
    divya: `${base}/avatar-divya.jpg`,
  },
};
