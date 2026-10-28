import type { DefaultSession } from "next-auth";

type Role = "USER" | "ADMIN";

declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    /** `role` is only a UI hint; server code re-checks the database. */
    user: { id: string; role: Role } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}
