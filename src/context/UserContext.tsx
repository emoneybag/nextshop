"use client";

import type { ReactNode } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import type { User } from "@/types/user";

/** Wraps NextAuth's SessionProvider; the rest of the app only uses `useUser()`. */
export function UserProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function useUser() {
  const { data, status } = useSession();

  const user: User | null = data?.user
    ? { id: data.user.id, name: data.user.name ?? "", email: data.user.email ?? "" }
    : null;

  return {
    user,
    /** False while the session is still being fetched. */
    hydrated: status !== "loading",
    logout: () => signOut({ callbackUrl: "/" }),
  };
}
