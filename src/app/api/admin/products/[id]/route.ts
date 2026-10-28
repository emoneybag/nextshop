import { NextResponse } from "next/server";
import { getAdmin } from "@/server/admin";
import { prisma } from "@/server/db";
import { productSchema } from "@/lib/validators/product";

type Ctx = { params: Promise<{ id: string }> };
const cents = (n: number) => Math.round(n * 100);

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);

  // Quick toggle used by the product list.
  if (body && Object.keys(body).length === 1 && typeof body.active === "boolean") {
    const res = await prisma.product.updateMany({ where: { id }, data: { active: body.active } });
    return res.count ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product" }, { status: 400 });
  }
  const p = parsed.data;

  const res = await prisma.product.updateMany({
    where: { id },
    data: {
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      priceCents: cents(p.price),
      compareAtCents: p.compareAt ? cents(p.compareAt) : null,
      category: p.category,
      image: p.image,
      badge: p.badge ?? null,
      features: p.features,
      specs: p.specs,
      active: p.active,
    },
  });
  return res.count ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
