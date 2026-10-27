import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

type Props = { searchParams: Promise<{ canceled?: string }> };

export default async function CheckoutPage({ searchParams }: Props) {
  const { canceled } = await searchParams;
  return <CheckoutForm canceled={canceled === "1"} />;
}
