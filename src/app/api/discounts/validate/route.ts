import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { discountCheckSchema } from "@/lib/validators/discount";
import { DiscountError, resolveDiscount } from "@/server/discounts";
import { OrderError, priceLines } from "@/server/orders";

/** Previews a discount for the cart without creating an order. */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to use a code." }, { status: 401 });
  }

  const parsed = discountCheckSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  try {
    const { subtotalCents } = await priceLines(parsed.data.items);
    const applied = await resolveDiscount(parsed.data.code, subtotalCents);
    return NextResponse.json(applied);
  } catch (error) {
    if (error instanceof DiscountError || error instanceof OrderError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Could not check that code." }, { status: 500 });
  }
}
