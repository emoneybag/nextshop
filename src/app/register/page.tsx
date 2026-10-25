import type { Metadata } from "next";
import { RegisterForm } from "@/components/AuthForms";

export const metadata: Metadata = { title: "Create account" };

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function Page({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  return <RegisterForm callbackUrl={callbackUrl} />;
}
