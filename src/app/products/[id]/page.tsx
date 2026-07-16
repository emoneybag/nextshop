import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { products } from "@/data/products";

type Props = {
  params: Promise<{
    id: string;
  }>;
};


export default async function ProductDetailPage({
  params,
}: Props) {

  const { id } = await params;

  const product = products.find(
    (p) => p.id === Number(id)
  );


  if (!product) {
    return <h1>Product not found</h1>;
  }


  return (
    <main className="p-10">

      <div className="max-w-4xl mx-auto">

        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={500}
          className="rounded"
        />

        <h1 className="text-4xl font-bold mt-6">
          {product.name}
        </h1>

        <p className="mt-4 text-gray-600">
          {product.description}
        </p>

        <p className="mt-4">
          Category: {product.category}
        </p>

        <p className="mt-4 text-2xl font-bold">
          ${product.price}
        </p>

        <AddToCartButton product={product} />

        <h2 className="text-2xl font-bold mt-10">
          Related Products
        </h2>

        <div className="mt-4">
          {products
            .filter(p => p.id !== product.id)
            .slice(0, 2)
            .map(p => (
              <div key={p.id}>
                {p.name}
              </div>
            ))}
        </div>

      </div>

    </main>
  );

}