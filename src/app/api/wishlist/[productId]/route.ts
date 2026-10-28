import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addToWishlist, removeFromWishlist } from "@/server/wishlist";

type Ctx = { params: Promise<{ productId: string }> };

async function context({ params }: Ctx) {
  const session = await getServerSession(authOptions);
  const productId = Number((await params).productId);
  return { userId: session?.user?.id, productId, valid: Number.isInteger(productId) && productId > 0 && productId < 2_147_483_647 };
}

export async function PUT(_req: Request, ctx: Ctx) {
  const { userId, productId, valid } = await context(ctx);
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!valid || !(await addToWishlist(userId, productId))) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ wishlisted: true });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { userId, productId, valid } = await context(ctx);
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (valid) await removeFromWishlist(userId, productId);
  return NextResponse.json({ wishlisted: false });
}
