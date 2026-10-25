import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Package } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { countOrdersForUser } from "@/server/orders";
import SignOutButton from "@/components/SignOutButton";

export const metadata: Metadata = { title: "Your profile" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/profile");

  const { id, name = "", email = "" } = session.user;
  const orderCount = await countOrdersForUser(id);
  const initials = (name ?? "").split(/[\s_]+/).map((n) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <main className="wrap max-w-3xl py-12">
      <h1 className="display text-4xl font-bold sm:text-5xl">Your profile</h1>

      <div className="card mt-10 flex flex-wrap items-center gap-6 p-6">
        <span className="display grid size-20 place-items-center rounded-full bg-accent text-2xl font-bold text-accent-ink">{initials}</span>
        <div className="min-w-0 flex-1">
          <p className="display truncate text-2xl font-semibold">{name}</p>
          <p className="truncate text-muted">{email}</p>
        </div>
        <SignOutButton />
      </div>

      <Link href="/orders" className="card mt-4 flex items-center gap-4 p-6 transition hover:border-accent/50">
        <span className="grid size-11 place-items-center rounded-full bg-surface-2"><Package className="size-5" /></span>
        <div>
          <p className="font-semibold">Order history</p>
          <p className="text-sm text-muted">{orderCount} {orderCount === 1 ? "order" : "orders"} placed</p>
        </div>
      </Link>
    </main>
  );
}
