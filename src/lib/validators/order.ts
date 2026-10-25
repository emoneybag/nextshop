import { z } from "zod";

const text = (label: string, max = 120) =>
  z.string().trim().min(1, `${label} is required`).max(max);

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, "Your cart is empty")
    .max(50),
  email: z.string().trim().pipe(z.email("Enter a valid email")),
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
