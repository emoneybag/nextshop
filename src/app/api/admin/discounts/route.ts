import { NextResponse } from "next/server";
import { getAdmin } from "@/server/admin";
import { prisma } from "@/server/db";
import { discountCreateSchema } from "@/lib/validators/discount";

export async function POST(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = discountCreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid code" }, { status: 400 });
  }
  const d = parsed.data;

  try {
    const created = await prisma.discountCode.create({
      data: {
        code: d.code,
        type: d.type,
        value: d.type === "FIXED" ? Math.round(d.value * 100) : d.value,
        minSubtotalCents: Math.round(d.minSubtotal * 100),
        maxRedemptions: d.maxRedemptions ?? null,
        expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
      },
      select: { id: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That code already exists." }, { status: 409 });
    }
    throw error;
  }
}
