import { NextResponse } from "next/server";
import { getAdmin } from "@/server/admin";
import { prisma } from "@/server/db";
import { productSchema } from "@/lib/validators/product";

const toCents = (n: number) => Math.round(n * 100);

export async function POST(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = productSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product" }, { status: 400 });
  }
  const p = parsed.data;

  const product = await prisma.product.create({
    data: {
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      priceCents: toCents(p.price),
      compareAtCents: p.compareAt ? toCents(p.compareAt) : null,
      category: p.category,
      image: p.image,
      badge: p.badge ?? null,
      features: p.features,
      specs: p.specs,
      active: p.active,
      rating: 0,
      reviews: 0,
    },
    select: { id: true },
  });
  return NextResponse.json(product, { status: 201 });
}
