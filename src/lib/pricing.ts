export const FREE_SHIPPING_THRESHOLD = 100;
export const FLAT_SHIPPING = 7.99;
export const TAX_RATE = 0.08;

export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
};

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Free shipping is judged on the pre-discount subtotal (friendlier to
 * shoppers); tax is charged on the discounted amount.
 */
export function calculateTotals(subtotal: number, discount = 0): Totals {
  const off = Math.min(Math.max(discount, 0), subtotal);
  const taxable = subtotal - off;
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = round(taxable * TAX_RATE);
  return {
    subtotal: round(subtotal),
    discount: round(off),
    shipping,
    tax,
    total: round(taxable + shipping + tax),
  };
}
