import AiJobsAdmin from "@/components/admin/ai/AiJobsAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AiJobsPage() {
  const db = createAdminClient();
  const { data } = db
    ? await db.from("ai_processing_jobs").select("*").order("created_at", { ascending: false }).limit(100)
    : { data: [] };
  return <AiJobsAdmin jobs={data || []} />;
}
