import AiProductsSync from "@/components/admin/ai/AiProductsSync";
import { fetchAdminTable } from "@/lib/admin/queries";

export default async function AiProductsPage() {
  const products = await fetchAdminTable("products", "name", true);
  return <AiProductsSync products={products} />;
}
