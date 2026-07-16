import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Products
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </main>
  );
}