import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/admin/auth";

export async function writeAuditLog({ action, entityType, entityId, meta = {} }) {
  const admin = createAdminClient();
  if (!admin) return;

  const user = await getSessionUser();
  await admin.from("audit_logs").insert({
    actor_id: user?.id ?? null,
    action,
    entity_type: entityType,
    entity_id: entityId ? String(entityId) : null,
    meta,
  });
}
