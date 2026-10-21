import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/server/db";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          issues: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { username, email, password } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
        },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}