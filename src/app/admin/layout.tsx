import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/server/admin";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin · NextShop" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return (
    <div className="wrap grid grid-cols-1 gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="min-w-0 lg:sticky lg:top-32 lg:h-fit">
        <p className="eyebrow mb-4">Admin</p>
        <AdminNav />
        <Link href="/" className="mt-6 block text-sm text-muted hover:text-ink">← Back to store</Link>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
