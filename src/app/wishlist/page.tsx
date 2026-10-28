import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Heart } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getWishlistProducts } from "@/server/wishlist";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = { title: "Your wishlist" };

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/wishlist");
  const products = await getWishlistProducts(session.user.id);

  return (
    <main className="wrap py-12">
      <h1 className="display text-4xl font-bold sm:text-5xl">Your wishlist</h1>
      {products.length === 0 ? (
        <div className="card mt-10 grid place-items-center gap-4 px-6 py-24 text-center">
          <Heart className="size-10 text-muted" />
          <p className="display text-2xl font-semibold">Nothing saved yet</p>
          <p className="text-muted">Tap the heart on any product to save it here.</p>
          <Link href="/products" className="btn-primary mt-2">Browse products</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  );
}
