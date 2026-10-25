import type { Metadata } from "next";
import { LoginForm } from "@/components/AuthForms";

export const metadata: Metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function Page({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  return <LoginForm callbackUrl={callbackUrl} />;
}
