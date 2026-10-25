import type { Metadata } from "next";
import ProductExplorer from "@/components/ProductExplorer";
import { categories } from "@/data/categories";
import { getProducts } from "@/server/products";

export const metadata: Metadata = {
  title: "Shop all gear",
  description: "Keyboards, mice, audio, displays and desk accessories.",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const [{ category }, products] = await Promise.all([searchParams, getProducts()]);
  const valid = categories.some((c) => c.name === category);

  return (
    <main className="wrap py-12">
      <header className="mb-10">
        <p className="eyebrow">The collection</p>
        <h1 className="display mt-2 text-4xl font-bold sm:text-5xl">Shop all gear</h1>
      </header>
      {/* key remounts the explorer when the footer/home category links change the URL */}
      <ProductExplorer key={category} products={products} initialCategory={valid ? category! : "All"} />
    </main>
  );
}
