/**
 * Quick admin backend smoke test (service role). Run: node scripts/admin-smoke.mjs
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createServiceRoleClient } from "../lib/supabase/nodeClient.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

try {
  const raw = readFileSync(join(root, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.error("Missing .env.local");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const db = createServiceRoleClient(url, key);
const tables = [
  "admin_profiles",
  "site_settings",
  "categories",
  "products",
  "stories",
  "brochures",
  "dealers",
  "contact_submissions",
  "dealer_applications",
];

console.log("Avalon admin smoke test\n");

let failed = 0;
for (const table of tables) {
  const { error, count } = await db.from(table).select("*", { count: "exact", head: true });
  if (error) {
    console.log(`✗ ${table}: ${error.message}`);
    failed += 1;
  } else {
    console.log(`✓ ${table}: ${count ?? 0} rows`);
  }
}

for (const bucket of ["catalog-media", "brochures"]) {
  const { error } = await db.storage.from(bucket).list("", { limit: 1 });
  if (error) {
    console.log(`✗ storage/${bucket}: ${error.message}`);
    failed += 1;
  } else {
    console.log(`✓ storage/${bucket}: reachable`);
  }
}

const { count: pendingApps } = await db
  .from("dealer_applications")
  .select("*", { count: "exact", head: true })
  .eq("status", "pending");
const { count: newContacts } = await db
  .from("contact_submissions")
  .select("*", { count: "exact", head: true })
  .eq("status", "new");
const { count: adminUsers } = await db.from("admin_profiles").select("*", { count: "exact", head: true });

console.log(`\nAdmin users: ${adminUsers ?? 0} | New contacts: ${newContacts ?? 0} | Pending dealer apps: ${pendingApps ?? 0}`);

if (failed) {
  console.error(`\n${failed} check(s) failed — run migrations 001–003 in Supabase.`);
  process.exit(1);
}
console.log("\nAll admin data sources OK.");
