import AiFaqsAdmin from "@/components/admin/ai/AiFaqsAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AiFaqsPage() {
  const db = createAdminClient();
  const { data } = db ? await db.from("ai_faqs").select("*").order("priority", { ascending: false }) : { data: [] };
  return <AiFaqsAdmin initialFaqs={data || []} />;
}
