/**
 * Link a Supabase Auth user to admin_profiles (after you create the user in Supabase Dashboard).
 *
 * Usage:
 *   node scripts/grant-admin.mjs your@email.com "Your Name"
 *
 * Requires .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
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
    console.error("Could not read .env.local");
    process.exit(1);
  }
}

loadEnvLocal();

const email = process.argv[2];
const fullName = process.argv[3] || "Avalon Admin";
const role = process.argv[4] || "super_admin";

if (!email) {
  console.error("Usage: node scripts/grant-admin.mjs <auth-user-email> [full name] [role]");
  console.error("Example: node scripts/grant-admin.mjs admin@avalon.com \"Site Admin\" super_admin");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: listData, error: listError } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});

if (listError) {
  console.error("Auth list failed:", listError.message);
  process.exit(1);
}

const user = listData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
if (!user) {
  console.error(`No Auth user found for ${email}. Create the user first in Supabase → Authentication → Users.`);
  process.exit(1);
}

const { error } = await supabase.from("admin_profiles").upsert(
  {
    user_id: user.id,
    email: user.email,
    full_name: fullName,
    role,
  },
  { onConflict: "user_id" },
);

if (error) {
  console.error("admin_profiles upsert failed:", error.message);
  if (error.message.includes("admin_profiles_role_check")) {
    console.error("Run migration 002_align_frontend_schema.sql for expanded roles, or use role: admin");
  }
  process.exit(1);
}

console.log("Admin access granted.");
console.log(`  User ID: ${user.id}`);
console.log(`  Email:   ${user.email}`);
console.log(`  Role:    ${role}`);
console.log("Sign in at /admin/login");
