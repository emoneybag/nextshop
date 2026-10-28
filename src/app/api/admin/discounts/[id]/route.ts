import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdmin } from "@/server/admin";
import { prisma } from "@/server/db";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = z.object({ active: z.boolean() }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const res = await prisma.discountCode.updateMany({ where: { id: (await params).id }, data: { active: parsed.data.active } });
  return res.count ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
