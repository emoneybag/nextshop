"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

type Props = { productId: number; productName: string; variant?: "icon" | "labelled"; className?: string };

export default function WishlistButton({ productId, productName, variant = "icon", className = "" }: Props) {
  const { has, toggle, ready } = useWishlist();
  const saved = has(productId);
  const label = saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`;

  if (variant === "labelled") {
    return (
      <button type="button" onClick={() => toggle(productId)} disabled={!ready} aria-pressed={saved} aria-label={label} className={`btn-ghost ${className}`}>
        <Heart className={`size-4 ${saved ? "fill-current" : ""}`} /> {saved ? "Saved" : "Save"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      disabled={!ready}
      aria-pressed={saved}
      aria-label={label}
      className={`grid size-9 place-items-center rounded-full border border-line bg-bg/70 backdrop-blur transition hover:border-accent ${className}`}
    >
      <Heart className={`size-4 ${saved ? "fill-current text-danger" : ""}`} />
    </button>
  );
}
