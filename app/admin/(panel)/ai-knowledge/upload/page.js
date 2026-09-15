import AiUploadPanel from "@/components/admin/ai/AiUploadPanel";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AiUploadPage() {
  const db = createAdminClient();
  const { data } = db
    ? await db.from("ai_knowledge_documents").select("*").order("created_at", { ascending: false })
    : { data: [] };
  return <AiUploadPanel initialDocuments={data || []} />;
}
