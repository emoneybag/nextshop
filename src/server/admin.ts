import "server-only";

import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/db";

/**
 * The signed-in admin, or null. The role is read from the database on every
 * call, so demoting an admin takes effect immediately instead of waiting for
 * their session token to expire.
 */
export async function getAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, username: true, role: true },
  });
  return user?.role === "ADMIN" ? user : null;
}

/** For admin pages: send guests to sign in, and hide the area from non-admins. */
export async function requireAdminPage(returnTo = "/admin") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/login?callbackUrl=${returnTo}`);
  const admin = await getAdmin();
  if (!admin) notFound();
  return admin;
}
