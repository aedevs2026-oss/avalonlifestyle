import AiCompanyAdmin from "@/components/admin/ai/AiCompanyAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AiCompanyPage() {
  const db = createAdminClient();
  const { data } = db
    ? await db.from("ai_company_knowledge").select("*").order("sort_order")
    : { data: [] };
  return <AiCompanyAdmin initialSections={data || []} />;
}
