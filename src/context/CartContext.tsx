"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";
import { loadFromStorage, saveToStorage } from "@/lib/storage";

const STORAGE_KEY = "nextshop:cart:v3";
const MAX_QTY = 10;

/**
 * What the cart remembers about a product (a display snapshot). Prices shown
 * here are informational: the server always re-prices from the database when
 * an order is placed.
 */
export type CartProduct = Pick<Product, "id" | "name" | "price" | "image" | "category">;
export type CartItem = { product: CartProduct; quantity: number };

type CartContextType = {
  /** Cart lines resolved against the live catalogue. */
  cart: CartItem[];
  /** Total number of units in the cart. */
  count: number;
  subtotal: number;
  /** False until localStorage has been read (avoids an "empty cart" flash). */
  hydrated: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  decreaseQuantity: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

/** Guards against hand-edited or outdated localStorage data. */
function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((l): CartItem[] => {
    const p = l?.product;
    const ok =
      p && Number.isInteger(p.id) && typeof p.name === "string" &&
      typeof p.price === "number" && typeof p.image === "string" &&
      Number.isInteger(l.quantity) && l.quantity > 0;
    return ok ? [{ product: p, quantity: Math.min(l.quantity, MAX_QTY) }] : [];
  });
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setLines] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage has to happen after mount to match server HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(sanitize(loadFromStorage<unknown>(STORAGE_KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(STORAGE_KEY, cart);
  }, [cart, hydrated]);

  const count = cart.reduce((n, i) => n + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const clamp = (n: number) => Math.min(MAX_QTY, Math.max(0, Math.floor(n)));

  function addToCart(product: Product, quantity = 1) {
    const snapshot: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };
    setLines((current) => {
      const existing = current.find((l) => l.product.id === product.id);
      if (existing) {
        return current.map((l) =>
          l.product.id === product.id
            ? { product: snapshot, quantity: clamp(l.quantity + quantity) }
            : l,
        );
      }
      return [...current, { product: snapshot, quantity: clamp(quantity) }];
    });
  }

  function setQuantity(id: number, quantity: number) {
    setLines((current) =>
      current
        .map((l) => (l.product.id === id ? { ...l, quantity: clamp(quantity) } : l))
        .filter((l) => l.quantity > 0),
    );
  }

  function decreaseQuantity(id: number) {
    setLines((current) =>
      current
        .map((l) => (l.product.id === id ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0),
    );
  }

  const removeFromCart = (id: number) =>
    setLines((current) => current.filter((l) => l.product.id !== id));

  const clearCart = () => setLines([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        subtotal,
        hydrated,
        addToCart,
        decreaseQuantity,
        setQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

export { MAX_QTY };
