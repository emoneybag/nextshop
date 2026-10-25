import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/server/db";
import { registerSchema } from "@/lib/validators/auth";

const conflict = (field: "email" | "username") =>
  NextResponse.json(
    {
      error:
        field === "email"
          ? "An account with this email already exists."
          : "That username is taken.",
      field,
    },
    { status: 409 },
  );

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0]?.message ?? "Invalid data",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { username, email, password } = result.data;

    const [emailTaken, usernameTaken] = await Promise.all([
      prisma.user.findUnique({ where: { email }, select: { id: true } }),
      prisma.user.findUnique({ where: { username }, select: { id: true } }),
    ]);
    if (emailTaken) return conflict("email");
    if (usernameTaken) return conflict("username");

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { username, email, passwordHash },
      select: { id: true, username: true, email: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    // Unique-constraint race between the check above and the insert.
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return conflict("email");
    }
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
