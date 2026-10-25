import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { prisma } from "@/server/db";
import { loginSchema } from "@/lib/validators/auth";

// Compared against when the email is unknown so response time doesn't reveal
// whether an account exists.
const DUMMY_HASH =
  "$2b$12$a8mqw/..P9AZKqvDeyMFCelS1/LRFfGEn0csgiBQ5e3e9qV0Hn5iy";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        const valid = await bcrypt.compare(
          parsed.data.password,
          user?.passwordHash ?? DUMMY_HASH,
        );
        if (!user || !valid) return null;

        return { id: user.id, name: user.username, email: user.email };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id;
      return session;
    },
  },
};
