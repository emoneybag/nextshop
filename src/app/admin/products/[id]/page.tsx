import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/server/admin";
import { getAdminProduct } from "@/server/admin-data";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Edit product" };

type Props = { params: Promise<{ id: string }> };

export default async function EditProduct({ params }: Props) {
  const { id } = await params;
  await requireAdminPage(`/admin/products/${id}`);
  const p = await getAdminProduct(Number(id));
  if (!p) notFound();

  const specs = Array.isArray(p.specs) ? (p.specs as { label: string; value: string }[]) : [];
  return (
    <>
      <h1 className="display mb-6 text-3xl font-bold sm:text-4xl">Edit product</h1>
      <ProductForm
        initial={{
          id: p.id, name: p.name, tagline: p.tagline, description: p.description,
          price: String(p.priceCents / 100), compareAt: p.compareAtCents ? String(p.compareAtCents / 100) : "",
          category: p.category, image: p.image, badge: p.badge ?? "",
          features: p.features.join("\n"), specs: specs.map((s) => `${s.label}: ${s.value}`).join("\n"), active: p.active,
        }}
      />
    </>
  );
}
