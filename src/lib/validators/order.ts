import { z } from "zod";

const text = (label: string, max = 120) =>
  z.string().trim().min(1, `${label} is required`).max(max);

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number("Invalid product").int("Invalid product").positive("Invalid product"),
        quantity: z
          .number("Invalid quantity")
          .int("Invalid quantity")
          .min(1, "Quantity must be at least 1")
          .max(10, "You can order up to 10 of each item"),
      }),
    )
    .min(1, "Your cart is empty")
    .max(50),
  email: z.string().trim().pipe(z.email("Enter a valid email")),
  discountCode: z.string().trim().max(40).optional(),
  shipping: z.object({
    fullName: text("Full name"),
    address: text("Address", 200),
    city: text("City"),
    region: z.string().trim().max(120),
    postalCode: text("Postal code", 20),
    country: text("Country"),
  }),
});

export type OrderInput = z.infer<typeof orderSchema>;
