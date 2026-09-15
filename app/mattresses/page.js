import { getCategoryImageMap } from "@/lib/cms/categories";
import { getMattressCategoriesForSite, getProductsForSite } from "@/lib/cms/products";
import MattressesClient from "./MattressesClient";

export const metadata = {
  title: "Mattresses",
  description:
    "Sleep beyond ordinary. Explore Avalon premium mattresses — pocket spring, memory foam, latex, and more.",
};

export default async function MattressesPage() {
  const [products, categories, categoryImages] = await Promise.all([
    getProductsForSite(),
    getMattressCategoriesForSite(),
    getCategoryImageMap(),
  ]);
  return (
    <MattressesClient
      products={products}
      mattressCategories={categories}
      categoryImages={categoryImages}
    />
  );
}
