import type { Metadata } from "next";
import { requireAdminPage } from "@/server/admin";
import ProductForm, { emptyProduct } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New product" };

export default async function NewProduct() {
  await requireAdminPage("/admin/products/new");
  return (
    <>
      <h1 className="display mb-6 text-3xl font-bold sm:text-4xl">New product</h1>
      <ProductForm initial={emptyProduct} />
    </>
  );
}
