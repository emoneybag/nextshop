import { formatPrice } from "@/lib/format";

export type EmailOrder = {
  id: string;
  reference: string;
  email: string;
  subtotalCents: number;
  discountCents: number;
  discountCode: string | null;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  shipName: string;
  shipAddress: string;
  shipCity: string;
  shipRegion: string;
  shipPostalCode: string;
  shipCountry: string;
  items: { name: string; priceCents: number; quantity: number }[];
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const money = (cents: number) => formatPrice(cents / 100);
const baseUrl = () => (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");

function layout(title: string, intro: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#111113">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;padding:32px;max-width:560px">
<tr><td><div style="font-size:20px;font-weight:700">NextShop</div>
<h1 style="font-size:24px;margin:24px 0 8px">${esc(title)}</h1>
<p style="color:#66666d;line-height:1.5;margin:0 0 24px">${intro}</p>${body}
<p style="color:#66666d;font-size:12px;margin-top:32px">This is a demo store. No real products are sold or shipped.</p>
</td></tr></table></td></tr></table></body></html>`;
}

function itemsTable(o: EmailOrder) {
  const rows = o.items
    .map(
      (i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #e2e2e2">${esc(i.name)} <span style="color:#66666d">× ${i.quantity}</span></td>
<td align="right" style="padding:8px 0;border-bottom:1px solid #e2e2e2">${money(i.priceCents * i.quantity)}</td></tr>`,
    )
    .join("");
  const line = (label: string, cents: number, bold = false) =>
    `<tr><td style="padding:4px 0;${bold ? "font-weight:700" : "color:#66666d"}">${label}</td><td align="right" style="padding:4px 0;${bold ? "font-weight:700" : ""}">${cents < 0 ? "−" : ""}${money(Math.abs(cents))}</td></tr>`;
  return `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">${rows}
${line("Subtotal", o.subtotalCents)}${o.discountCents > 0 ? line(`Discount${o.discountCode ? ` (${esc(o.discountCode)})` : ""}`, -o.discountCents) : ""}
${line("Shipping", o.shippingCents)}${line("Tax", o.taxCents)}${line("Total", o.totalCents, true)}</table>`;
}

function address(o: EmailOrder) {
  return [o.shipName, o.shipAddress, [o.shipCity, o.shipRegion, o.shipPostalCode].filter(Boolean).join(", "), o.shipCountry]
    .map(esc)
    .join("<br>");
}

function textSummary(o: EmailOrder) {
  const lines = o.items.map((i) => `- ${i.name} x${i.quantity}: ${money(i.priceCents * i.quantity)}`);
  if (o.discountCents > 0) lines.push(`Discount${o.discountCode ? ` (${o.discountCode})` : ""}: -${money(o.discountCents)}`);
  lines.push(`Shipping: ${money(o.shippingCents)}`, `Tax: ${money(o.taxCents)}`, `Total: ${money(o.totalCents)}`);
  return lines.join("\n");
}

export function orderConfirmationEmail(o: EmailOrder) {
  const url = `${baseUrl()}/orders`;
  return {
    subject: `Order ${o.reference} confirmed`,
    html: layout(
      "Thanks for your order!",
      `We've received your payment for order <strong>${esc(o.reference)}</strong>.`,
      `${itemsTable(o)}<h3 style="font-size:14px;margin:24px 0 4px">Shipping to</h3>
<p style="margin:0;font-size:14px;line-height:1.5">${address(o)}</p>
<p style="margin-top:24px"><a href="${url}" style="background:#111113;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600">View your order</a></p>`,
    ),
    text: `Thanks for your order!\nOrder ${o.reference} is confirmed.\n\n${textSummary(o)}\n\nView it: ${url}`,
  };
}

export function orderStatusEmail(o: EmailOrder, status: "SHIPPED" | "DELIVERED") {
  const shipped = status === "SHIPPED";
  const url = `${baseUrl()}/orders`;
  return {
    subject: shipped ? `Order ${o.reference} has shipped` : `Order ${o.reference} was delivered`,
    html: layout(
      shipped ? "Your order is on its way" : "Your order was delivered",
      shipped
        ? `Order <strong>${esc(o.reference)}</strong> has left our warehouse.`
        : `Order <strong>${esc(o.reference)}</strong> has been delivered. We hope you love it!`,
      `<h3 style="font-size:14px;margin:0 0 4px">${shipped ? "Shipping to" : "Delivered to"}</h3>
<p style="margin:0 0 24px;font-size:14px;line-height:1.5">${address(o)}</p>${itemsTable(o)}
<p style="margin-top:24px"><a href="${url}" style="background:#111113;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600">View your orders</a></p>`,
    ),
    text: `${shipped ? "Your order is on its way" : "Your order was delivered"}\nOrder ${o.reference}\n\n${textSummary(o)}\n\nView it: ${url}`,
  };
}
