import { z } from "zod";
import { categories } from "@/data/categories";

const names = categories.map((c) => c.name) as [string, ...string[]];

const imageUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v.startsWith("https://") || v.startsWith("/"), "Use an https:// URL or a /path from /public");

export const productSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(120),
    tagline: z.string().trim().min(1, "Tagline is required").max(160),
    description: z.string().trim().min(10, "Description is too short").max(2000),
    /** Dollars; converted to cents by the server. */
    price: z.number("Enter a price").positive("Price must be above 0").max(100_000),
    compareAt: z.number().positive().max(100_000).nullable().optional(),
    category: z.enum(names),
    image: imageUrl,
    badge: z.enum(["New", "Sale", "Best seller"]).nullable().optional(),
    features: z.array(z.string().trim().min(1).max(120)).max(12),
    specs: z.array(z.object({ label: z.string().trim().min(1).max(60), value: z.string().trim().min(1).max(120) })).max(12),
    active: z.boolean().default(true),
  })
  .refine((p) => p.compareAt == null || p.compareAt > p.price, {
    message: "Compare-at price must be higher than the price",
    path: ["compareAt"],
  });

export type ProductInput = z.infer<typeof productSchema>;

export const orderStatusSchema = z.object({ status: z.enum(["SHIPPED", "DELIVERED"]) });
