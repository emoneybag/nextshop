"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

type WishlistContextType = {
  has: (productId: number) => boolean;
  toggle: (productId: number) => Promise<void>;
  count: number;
  /** False until the session is known, so a click can't be mistaken for a signed-out one. */
  ready: boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, hydrated } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [ids, setIds] = useState<Set<number>>(new Set());
  const userId = user?.id;

  // Load the saved list whenever the signed-in user changes.
  useEffect(() => {
    if (!hydrated) return;
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIds(new Set());
      return;
    }
    let cancelled = false;
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : { ids: [] }))
      .then((d: { ids: number[] }) => !cancelled && setIds(new Set(d.ids)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId, hydrated]);

  const toggle = useCallback(
    async (productId: number) => {
      if (!hydrated) return;
      if (!userId) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }
      const adding = !ids.has(productId);
      // Optimistic update, rolled back if the request fails.
      setIds((prev) => {
        const next = new Set(prev);
        if (adding) next.add(productId);
        else next.delete(productId);
        return next;
      });
      try {
        const res = await fetch(`/api/wishlist/${productId}`, { method: adding ? "PUT" : "DELETE" });
        if (!res.ok) throw new Error();
        router.refresh();
      } catch {
        setIds((prev) => {
          const next = new Set(prev);
          if (adding) next.delete(productId);
          else next.add(productId);
          return next;
        });
      }
    },
    [ids, userId, hydrated, router, pathname],
  );

  const value = useMemo(
    () => ({ has: (id: number) => ids.has(id), toggle, count: ids.size, ready: hydrated }),
    [ids, toggle, hydrated],
  );
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
