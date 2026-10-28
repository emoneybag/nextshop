"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function DiscountForm() {
  const router = useRouter();
  const [f, setF] = useState({ code: "", type: "PERCENT", value: "", minSubtotal: "", maxRedemptions: "", expires: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: f.code, type: f.type, value: Number(f.value),
        minSubtotal: f.minSubtotal ? Number(f.minSubtotal) : 0,
        maxRedemptions: f.maxRedemptions ? Number(f.maxRedemptions) : null,
        expiresAt: f.expires ? new Date(`${f.expires}T23:59:59`).toISOString() : null,
      }),
    });
    setBusy(false);
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error ?? "Could not create the code");
    setF({ code: "", type: "PERCENT", value: "", minSubtotal: "", maxRedemptions: "", expires: "" });
    router.refresh();
  }

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <form onSubmit={submit} className="card grid gap-4 p-5 sm:grid-cols-3" noValidate>
      <div><label htmlFor="d-code" className="label">Code</label><input id="d-code" className="field uppercase" value={f.code} onChange={set("code")} placeholder="SUMMER15" /></div>
      <div>
        <label htmlFor="d-type" className="label">Type</label>
        <select id="d-type" className="field" value={f.type} onChange={set("type")}><option value="PERCENT">Percent off</option><option value="FIXED">Fixed amount off</option></select>
      </div>
      <div><label htmlFor="d-value" className="label">{f.type === "PERCENT" ? "Percent (1–100)" : "Amount (USD)"}</label><input id="d-value" type="number" min="0" step="any" className="field" value={f.value} onChange={set("value")} /></div>
      <div><label htmlFor="d-min" className="label">Minimum spend (USD)</label><input id="d-min" type="number" min="0" className="field" value={f.minSubtotal} onChange={set("minSubtotal")} placeholder="0" /></div>
      <div><label htmlFor="d-max" className="label">Max uses (optional)</label><input id="d-max" type="number" min="1" className="field" value={f.maxRedemptions} onChange={set("maxRedemptions")} /></div>
      <div><label htmlFor="d-exp" className="label">Expires (optional)</label><input id="d-exp" type="date" className="field" value={f.expires} onChange={set("expires")} /></div>
      {error && <p role="alert" className="text-sm text-danger sm:col-span-3">{error}</p>}
      <div className="sm:col-span-3"><button className="btn-primary" disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />}Create code</button></div>
    </form>
  );
}
