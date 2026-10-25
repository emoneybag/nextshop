export const FREE_SHIPPING_THRESHOLD = 100;
export const FLAT_SHIPPING = 7.99;
export const TAX_RATE = 0.08;

export type Totals = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

const round = (n: number) => Math.round(n * 100) / 100;

export function calculateTotals(subtotal: number): Totals {
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = round(subtotal * TAX_RATE);
  return {
    subtotal: round(subtotal),
    shipping,
    tax,
    total: round(subtotal + shipping + tax),
  };
}
