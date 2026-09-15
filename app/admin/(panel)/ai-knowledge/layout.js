import AiKnowledgeNav from "@/components/admin/ai/AiKnowledgeNav";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import "@/app/admin/ai-knowledge.css";

export default function AiKnowledgeLayout({ children }) {
  return (
    <div className="ai-knowledge-root">
      <AdminPageHeader
        title="AI Knowledge"
        subtitle="Manage Ask Avalon data sources, vectors, and chatbot accuracy."
      />
      <AiKnowledgeNav />
      <div className="ai-knowledge-content">{children}</div>
    </div>
  );
}
