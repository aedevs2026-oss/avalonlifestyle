import { createAdminClient } from "@/lib/supabase/admin";

export async function fetchAdminTable(table, orderBy = "created_at", ascending = false) {
  const db = createAdminClient();
  if (!db) return [];
  const { data, error } = await db.from(table).select("*").order(orderBy, { ascending });
  if (error) {
    console.error(`[admin] ${table}`, error);
    return [];
  }
  return data ?? [];
}

export async function fetchDashboardCounts() {
  const db = createAdminClient();
  if (!db) {
    return null;
  }

  const tables = [
    "products",
    "categories",
    "stories",
    "brochures",
    "dealers",
    "contact_submissions",
    "dealer_applications",
  ];

  const counts = {};
  for (const table of tables) {
    const { count, error } = await db
      .from(table)
      .select("*", { count: "exact", head: true });
    counts[table] = error ? 0 : count ?? 0;
  }

  const { count: newContacts } = await db
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const { count: newDealerApps } = await db
    .from("dealer_applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  counts.new_contacts = newContacts ?? 0;
  counts.new_dealer_applications = newDealerApps ?? 0;

  return counts;
}

export async function fetchAdminAlertCount() {
  const db = createAdminClient();
  if (!db) return 0;

  const [contacts, dealers] = await Promise.all([
    db
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    db
      .from("dealer_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return (contacts.count ?? 0) + (dealers.count ?? 0);
}

export async function fetchDashboardRecent(limit = 6) {
  const db = createAdminClient();
  if (!db) return { contacts: [], dealerApps: [] };

  const [contactsRes, dealerRes] = await Promise.all([
    db
      .from("contact_submissions")
      .select("id, name, subject, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    db
      .from("dealer_applications")
      .select("id, name, business_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  return {
    contacts: contactsRes.data ?? [],
    dealerApps: dealerRes.data ?? [],
  };
}
