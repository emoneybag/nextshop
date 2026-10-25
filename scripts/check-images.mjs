// Verifies every remote product image still resolves.  Usage: npm run check:images
import { readFileSync } from "node:fs";

const src = ["products", "categories"]
  .map((f) => readFileSync(new URL(`../src/data/${f}.ts`, import.meta.url), "utf8"))
  .join("\n");
const ids = [...new Set([...src.matchAll(/unsplash\("([^"]+)"\)/g)].map((m) => m[1]))];

let bad = 0;
for (const id of ids) {
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=200&q=40`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    console.log(res.ok ? "✅" : "❌", res.status, id);
    if (!res.ok) bad++;
  } catch (e) {
    console.log("❌ ERR", id, e.message);
    bad++;
  }
}
console.log(bad ? `\n${bad} broken image(s) — swap the ID in src/data/products.ts` : "\nAll images OK");
process.exit(bad ? 1 : 0);
