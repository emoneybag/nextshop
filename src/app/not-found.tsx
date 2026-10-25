import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap grid place-items-center gap-4 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display text-5xl font-bold">Page not found</h1>
      <p className="max-w-md text-muted">The page you&apos;re looking for doesn&apos;t exist or the product has been removed.</p>
      <Link href="/products" className="btn-primary mt-2">Back to the shop</Link>
    </main>
  );
}
