import { NextResponse } from "next/server";
import { getAdmin } from "@/server/admin";
import { prisma } from "@/server/db";
import { orderStatusSchema } from "@/lib/validators/product";
import { sendEmail } from "@/server/email";
import { orderStatusEmail } from "@/server/emails/templates";

type Ctx = { params: Promise<{ id: string }> };

// Only forward moves are allowed. Cancelling a paid order would need a Stripe refund, which isn't built yet.
const FROM: Record<"SHIPPED" | "DELIVERED", "CONFIRMED" | "SHIPPED"> = { SHIPPED: "CONFIRMED", DELIVERED: "SHIPPED" };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const parsed = orderStatusSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Status must be SHIPPED or DELIVERED" }, { status: 400 });
  const { status } = parsed.data;

  // Conditional update: also guards against two admins clicking at once.
  const res = await prisma.order.updateMany({ where: { id, status: FROM[status] }, data: { status } });
  if (res.count !== 1) {
    return NextResponse.json({ error: `Only ${FROM[status].toLowerCase()} orders can be marked ${status.toLowerCase()}.` }, { status: 409 });
  }

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (order) await sendEmail({ to: order.email, ...orderStatusEmail(order, status) });

  return NextResponse.json({ ok: true, status });
}
