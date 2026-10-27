"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/orders", label: "Orders" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { count, hydrated, openCart } = useCart();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  // On the cart/checkout pages the drawer would just duplicate the page.
  const cartIsPage = pathname === "/cart" || pathname === "/checkout";
  const cartLabel = `Cart${hydrated && count ? `, ${count} items` : ""}`;
  const cartClass = "relative grid size-10 place-items-center rounded-full transition hover:bg-surface-2";
  const cartInner = (
    <>
      <ShoppingBag className="size-5" />
      {hydrated && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold leading-5 text-accent-ink">
          {count}
        </span>
      )}
    </>
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-xl">
      <div className="bg-accent py-1.5 text-center text-xs font-medium text-accent-ink">
        Free shipping on orders over $100 · Demo store, no real payments
      </div>

      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" className="display flex items-center gap-2 text-xl font-bold" onClick={() => setOpen(false)}>
          <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-ink">N</span>
          NextShop
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isActive(l.href)
                  ? "bg-surface-2 text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={user ? "/profile" : "/login"}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted transition hover:text-ink"
            aria-label={user ? "Your profile" : "Sign in or create account"}
          >
            <UserIcon className="size-5" />
            <span className="hidden sm:inline">{user ? user.name.split(" ")[0] : "Sign in"}</span>
          </Link>

          <ThemeToggle />

          {cartIsPage ? (
            <Link href="/cart" className={cartClass} aria-label={cartLabel}>{cartInner}</Link>
          ) : (
            <button type="button" onClick={openCart} className={cartClass} aria-label={cartLabel} aria-haspopup="dialog">
              {cartInner}
            </button>
          )}

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full hover:bg-surface-2 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="wrap flex flex-col gap-1 border-t border-line pb-4 pt-2 md:hidden" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-4 py-3 text-sm ${isActive(l.href) ? "bg-surface-2" : "text-muted"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
