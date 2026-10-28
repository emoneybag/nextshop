"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ReceiptText, TicketPercent } from "lucide-react";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/discounts", label: "Discount codes", icon: TicketPercent },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm transition ${active ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"}`}
          >
            <Icon className="size-4" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
