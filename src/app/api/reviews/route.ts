import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { reviewSchema } from "@/lib/validators/review";
import { deleteReview, saveReview } from "@/server/reviews";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Please sign in to write a review." }, { status: 401 });

  const parsed = reviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid review" }, { status: 400 });

  try {
    const result = await saveReview(session.user.id, parsed.data);
    if (!result) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(result, { status: result.updated ? 200 : 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2003") {
      return NextResponse.json({ error: "Your session is no longer valid. Please sign in again." }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Could not save your review." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const productId = Number(new URL(req.url).searchParams.get("productId"));
  if (!Number.isInteger(productId) || productId < 1) return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  const removed = await deleteReview(session.user.id, productId);
  return removed ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Review not found" }, { status: 404 });
}
