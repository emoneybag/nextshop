export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type OrderItem = {
  id: string;
  productId: number | null;
  name: string;
  image: string;
  /** Unit price in dollars at the time of purchase. */
  price: number;
  quantity: number;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id: string;
  /** Short, human-friendly reference, e.g. NS-4F9K2Q */
  reference: string;
  status: OrderStatus;
  /** ISO date string. */
  createdAt: string;
  email: string;
  subtotal: number;
  discount: number;
  discountCode: string | null;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
};
