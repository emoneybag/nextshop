import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { orderSchema } from "@/lib/validators/order";
import { createOrder, OrderError } from "@/server/orders";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to place an order." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const order = await createOrder(session.user.id, parsed.data);
    return NextResponse.json(
      { id: order.id, reference: order.reference, total: order.totalCents / 100 },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof OrderError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    // A deleted account still holding a valid JWT hits the user foreign key.
    if (typeof error === "object" && error && "code" in error && error.code === "P2003") {
      return NextResponse.json({ error: "Your session is no longer valid. Please sign in again." }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Could not place your order. Please try again." }, { status: 500 });
  }
}
