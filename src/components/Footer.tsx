import Link from "next/link";
import { categories } from "@/data/categories";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="display flex items-center gap-2 text-xl font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-ink">N</span>
            NextShop
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Premium gear for your best setup. This is a portfolio demo store built
            with Next.js, React and Tailwind. No real products are sold.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted">
            {categories.map((c) => (
              <li key={c.name}>
                <Link className="hover:text-ink" href={`/products?category=${encodeURIComponent(c.name)}`}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Account</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" href="/cart">Cart</Link></li>
            <li><Link className="hover:text-ink" href="/orders">Orders</Link></li>
            <li><Link className="hover:text-ink" href="/profile">Profile</Link></li>
            <li><Link className="hover:text-ink" href="/login">Sign in</Link></li>
            <li><Link className="hover:text-ink" href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} NextShop · A portfolio project
      </div>
    </footer>
  );
}
