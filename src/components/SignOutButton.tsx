"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="btn-ghost">
      <LogOut className="size-4" /> Sign out
    </button>
  );
}
