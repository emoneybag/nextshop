"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { categories } from "@/data/categories";

export type ProductFormValues = {
  id?: number;
  name: string; tagline: string; description: string;
  price: string; compareAt: string; category: string; image: string; badge: string;
  features: string; specs: string; active: boolean;
};

export const emptyProduct: ProductFormValues = {
  name: "", tagline: "", description: "", price: "", compareAt: "", category: categories[0].name,
  image: "", badge: "", features: "", specs: "", active: true,
};

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

export default function ProductForm({ initial }: { initial: ProductFormValues }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const editing = initial.id !== undefined;
  const set = <K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) => setV((p) => ({ ...p, [k]: val }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const specs = lines(v.specs).map((l) => {
      const i = l.indexOf(":");
      return i < 1 ? { label: l, value: "" } : { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() };
    });
    const body = {
      name: v.name, tagline: v.tagline, description: v.description,
      price: v.price === "" ? undefined : Number(v.price),
      compareAt: v.compareAt === "" ? null : Number(v.compareAt),
      category: v.category, image: v.image, badge: v.badge || null,
      features: lines(v.features), specs, active: v.active,
    };

    const res = await fetch(editing ? `/api/admin/products/${initial.id}` : "/api/admin/products", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? "Could not save the product");
      setSaving(false);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  const input = (id: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} className="field" {...props} />
    </div>
  );

  return (
    <form onSubmit={submit} className="card space-y-5 p-6" noValidate>
      {input("name", "Name", { value: v.name, onChange: (e) => set("name", e.target.value), required: true })}
      {input("tagline", "Tagline", { value: v.tagline, onChange: (e) => set("tagline", e.target.value) })}
      <div>
        <label htmlFor="description" className="label">Description</label>
        <textarea id="description" rows={4} className="field" value={v.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {input("price", "Price (USD)", { type: "number", step: "0.01", min: "0", value: v.price, onChange: (e) => set("price", e.target.value) })}
        {input("compareAt", "Compare-at price (optional, for sales)", { type: "number", step: "0.01", min: "0", value: v.compareAt, onChange: (e) => set("compareAt", e.target.value) })}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="label">Category</label>
          <select id="category" className="field" value={v.category} onChange={(e) => set("category", e.target.value)}>
            {categories.map((c) => <option key={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="badge" className="label">Badge</label>
          <select id="badge" className="field" value={v.badge} onChange={(e) => set("badge", e.target.value)}>
            <option value="">None</option><option>New</option><option>Sale</option><option>Best seller</option>
          </select>
        </div>
      </div>
      {input("image", "Image URL (https://… or /products/file.jpg)", { value: v.image, onChange: (e) => set("image", e.target.value) })}
      <div>
        <label htmlFor="features" className="label">Features (one per line)</label>
        <textarea id="features" rows={4} className="field" value={v.features} onChange={(e) => set("features", e.target.value)} />
      </div>
      <div>
        <label htmlFor="specs" className="label">Specs (one per line, “Label: Value”)</label>
        <textarea id="specs" rows={4} className="field" placeholder="Weight: 58 g" value={v.specs} onChange={(e) => set("specs", e.target.value)} />
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" checked={v.active} onChange={(e) => set("active", e.target.checked)} className="size-4 accent-[var(--accent)]" />
        Visible in the store
      </label>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <div className="flex gap-3">
        <button className="btn-primary" disabled={saving}>{saving && <Loader2 className="size-4 animate-spin" />}{editing ? "Save changes" : "Create product"}</button>
        <button type="button" className="btn-ghost" onClick={() => router.push("/admin/products")}>Cancel</button>
      </div>
    </form>
  );
}
