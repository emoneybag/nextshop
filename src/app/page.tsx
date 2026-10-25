import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { categories } from "@/data/categories";
import { getProducts } from "@/server/products";

const perks = [
  { icon: Truck, title: "Free shipping", text: "On every order over $100" },
  { icon: RotateCcw, title: "30-day returns", text: "Changed your mind? No problem" },
  { icon: ShieldCheck, title: "2-year warranty", text: "On everything we sell" },
];

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.badge === "Best seller" || p.badge === "New").slice(0, 4);
  const deals = products.filter((p) => p.compareAt).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="glow relative overflow-hidden border-b border-line">
        <div className="wrap grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="rise">
            <p className="eyebrow">New season · Setup essentials</p>
            <h1 className="display mt-4 text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
              Gear built for your{" "}
              <span className="bg-gradient-to-b from-ink to-muted bg-clip-text text-transparent">best setup.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Mechanical keyboards, featherweight mice, studio-grade audio and
              displays that keep up. Honest specs, fair prices.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                Shop all gear <ArrowRight className="size-4" />
              </Link>
              <Link href="/products?category=Keyboards" className="btn-ghost">
                Explore keyboards
              </Link>
            </div>
            <dl className="mt-12 flex gap-10 text-sm">
              {[
                ["12+", "Curated products"],
                ["4.6★", "Average rating"],
                ["48h", "Dispatch time"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="display text-2xl font-bold">{n}</dt>
                  <dd className="text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise relative mx-auto grid w-full max-w-xl grid-cols-5 grid-rows-5 gap-3 [animation-delay:120ms] aspect-square">
            <div className="card relative col-span-3 row-span-5 overflow-hidden">
              <Image src="/products/keyboard.jpg" alt="Forge mechanical keyboard" fill priority sizes="(min-width:1024px) 22vw, 50vw" className="object-cover" />
            </div>
            <div className="card relative col-span-2 row-span-3 overflow-hidden">
              <Image src="/products/mouse.jpg" alt="Apex gaming mouse" fill priority sizes="(min-width:1024px) 15vw, 35vw" className="object-cover" />
            </div>
            <div className="card relative col-span-2 row-span-2 overflow-hidden">
              <Image src="/products/headset.jpg" alt="Pulse gaming headset" fill sizes="(min-width:1024px) 15vw, 35vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-line bg-surface">
        <div className="wrap grid gap-6 py-8 sm:grid-cols-3">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="grid size-11 place-items-center rounded-full bg-surface-2 text-accent">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="wrap pt-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Browse</p>
            <h2 className="display mt-2 text-3xl font-bold sm:text-4xl">Shop by category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/products?category=${encodeURIComponent(c.name)}`}
              className="group card relative aspect-[3/4] overflow-hidden"
            >
              <ProductImage src={c.image} alt={c.name} sizes="(min-width:768px) 20vw, 50vw" className="transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="display text-lg font-semibold">{c.name}</h3>
                <p className="text-xs text-muted">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="wrap pt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Fan favourites</p>
            <h2 className="display mt-2 text-3xl font-bold sm:text-4xl">Best sellers &amp; new arrivals</h2>
          </div>
          <Link href="/products" className="hidden items-center gap-1 text-sm text-muted hover:text-accent sm:flex">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Deals banner */}
      <section className="wrap pt-20">
        <div className="glow card p-6 sm:p-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Limited time</p>
              <h2 className="display mt-2 text-3xl font-bold sm:text-4xl">Upgrade for less</h2>
              <p className="mt-2 max-w-md text-muted">
                Hand-picked discounts on gear our customers love. While stock lasts.
              </p>
            </div>
            <Link href="/products" className="btn-primary">
              See all deals <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
