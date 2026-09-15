import { getProductsForSite } from "@/lib/cms/products";
import ProductCatalogClient from "./ProductCatalogClient";

export const metadata = {
  title: "Product Catalogue",
  description:
    "Discover comfort for a brighter tomorrow. Browse Avalon premium mattresses with filters, search, and expert support.",
};

export default async function ProductCatalogPage() {
  const products = await getProductsForSite();
  return <ProductCatalogClient products={products} />;
}
