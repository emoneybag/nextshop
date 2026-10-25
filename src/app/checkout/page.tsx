"use client";

import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { TotalsTable } from "@/components/OrderSummary";
import { formatPrice } from "@/lib/format";
import { calculateTotals } from "@/lib/pricing";

type Form = {
  fullName: string; email: string; address: string; city: string;
  region: string; postalCode: string; country: string; card: string;
};

const required: (keyof Form)[] = ["fullName", "email", "address", "city", "postalCode", "country"];

const Skeleton = () => (
  <main className="wrap py-12"><div className="h-64 animate-pulse rounded-2xl bg-surface" /></main>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, hydrated, clearCart } = useCart();
  const { user, hydrated: userReady } = useUser();

  const [form, setForm] = useState<Form>({
    fullName: "", email: "", address: "", city: "",
    region: "", postalCode: "", country: "United States", card: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Prefill from the signed-in account while the fields are untouched.
  const values: Form = {
    ...form,
    fullName: form.fullName || user?.name || "",
    email: form.email || user?.email || "",
  };

  const totals = calculateTotals(subtotal);
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...values, [k]: e.target.value });
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  function validate() {
    const next: typeof errors = {};
    for (const k of required) if (!values[k].trim()) next[k] = "Required";
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate() || cart.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Only ids and quantities are sent. The server looks up real prices.
          items: cart.map(({ product, quantity }) => ({ productId: product.id, quantity })),
          email: values.email,
          shipping: {
            fullName: values.fullName, address: values.address, city: values.city,
            region: values.region, postalCode: values.postalCode, country: values.country,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        router.push("/login?callbackUrl=/checkout");
        return;
      }
      if (!res.ok) {
        setServerError(data.error ?? "Could not place your order.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/success?order=${data.id}`);
    } catch {
      setServerError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (!hydrated || !userReady) return <Skeleton />;

  if (!user) {
    return (
      <main className="wrap grid place-items-center gap-4 py-28 text-center">
        <h1 className="display text-3xl font-bold">Sign in to check out</h1>
        <p className="max-w-md text-muted">
          Your cart is saved. Sign in or create an account to place your order and track it afterwards.
        </p>
        <div className="flex gap-3">
          <Link href="/login?callbackUrl=/checkout" className="btn-primary">Sign in</Link>
          <Link href="/register?callbackUrl=/checkout" className="btn-ghost">Create account</Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="wrap grid place-items-center gap-4 py-28 text-center">
        <h1 className="display text-3xl font-bold">Nothing to check out</h1>
        <p className="text-muted">Your cart is empty.</p>
        <Link href="/products" className="btn-primary">Browse products</Link>
      </main>
    );
  }

  // Called as a function (not rendered as <Field />) so inputs keep focus while typing.
  const field = ({ k, label, type = "text", ph, span }: { k: keyof Form; label: string; type?: string; ph?: string; span?: boolean }) => (
    <div className={span ? "sm:col-span-2" : ""}>
      <label htmlFor={k} className="label">{label}</label>
      <input id={k} type={type} value={values[k]} onChange={set(k)} placeholder={ph} className="field"
        aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined} />
      {errors[k] && <p id={`${k}-err`} className="mt-1 text-xs text-danger">{errors[k]}</p>}
    </div>
  );

  return (
    <main className="wrap py-12">
      <h1 className="display text-4xl font-bold sm:text-5xl">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section className="card p-6">
            <h2 className="display mb-5 text-xl font-semibold">Contact &amp; shipping</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {field({ k: "fullName", label: "Full name", span: true })}
              {field({ k: "email", label: "Email", type: "email", span: true })}
              {field({ k: "address", label: "Address", span: true })}
              {field({ k: "city", label: "City" })}
              {field({ k: "region", label: "State / Region" })}
              {field({ k: "postalCode", label: "Postal code" })}
              {field({ k: "country", label: "Country" })}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="display mb-1 text-xl font-semibold">Payment</h2>
            <p className="mb-5 text-sm text-muted">This is a demo. No payment is taken, and the card number is never sent or stored.</p>
            {field({ k: "card", label: "Card number (optional)", ph: "4242 4242 4242 4242" })}
          </section>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-32">
          <h2 className="display mb-5 text-xl font-semibold">Order summary</h2>
          <ul className="mb-6 space-y-4">
            {cart.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                  <ProductImage src={product.image} alt="" sizes="56px" />
                  <span className="absolute right-0 top-0 grid size-5 place-items-center rounded-bl-lg bg-accent text-[11px] font-bold text-accent-ink">{quantity}</span>
                </div>
                <p className="flex-1 truncate text-sm">{product.name}</p>
                <p className="text-sm">{formatPrice(product.price * quantity)}</p>
              </li>
            ))}
          </ul>
          <TotalsTable totals={totals} />
          {serverError && <p role="alert" className="mt-4 text-sm text-danger">{serverError}</p>}
          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {submitting ? "Placing order…" : `Place order · ${formatPrice(totals.total)}`}
          </button>
        </aside>
      </form>
    </main>
  );
}
