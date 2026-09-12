import { products } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  return <ProductDetailClient key={slug} slug={slug} />;
}
