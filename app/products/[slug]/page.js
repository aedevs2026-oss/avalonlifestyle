import { notFound } from "next/navigation";
import { getProductBySlugForSite, getProductsForSite } from "@/lib/cms/products";
import { products as staticProducts } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return staticProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlugForSite(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product._seoTitle || product.name,
    description: product._seoDescription || product.description,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const [product, catalog] = await Promise.all([
    getProductBySlugForSite(slug),
    getProductsForSite(),
  ]);
  if (!product) notFound();
  return (
    <ProductDetailClient
      key={slug}
      slug={slug}
      initialProduct={product}
      catalogProducts={catalog}
    />
  );
}
