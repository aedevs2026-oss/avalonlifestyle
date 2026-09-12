/**
 * Download furniture page images into public/assets/furniture/.
 * Run: node scripts/download-furniture-images.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "assets", "furniture");

/** filename -> Unsplash URL */
const SOURCES = {
  "hero.jpg":
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85",
  "featured-sofas.jpg":
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
  "featured-couches.jpg":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  "featured-chairs.jpg":
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=85",
  "featured-tables.jpg":
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85",
  "lifestyle-bedroom.jpg":
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=85",
  "lifestyle-living.jpg":
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85",
  "lifestyle-dining.jpg":
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=85",
  "room-living.jpg":
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
  "craftsmanship.jpg":
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85",
  "cta.jpg":
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85",
  "avatar-anitha.jpg":
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=85",
  "avatar-karthik.jpg":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=85",
  "avatar-divya.jpg":
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=85",
};

await mkdir(outDir, { recursive: true });

for (const [name, url] of Object.entries(SOURCES)) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${name}: HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const file = path.join(outDir, name);
  await writeFile(file, buf);
  console.log(`Wrote ${name} (${buf.length} bytes)`);
}

console.log(`Done — ${Object.keys(SOURCES).length} files in public/assets/furniture/`);
