import { z } from "zod";

export const discountCheckSchema = z.object({
  code: z.string().trim().min(1, "Enter a code").max(40),
  items: z
    .array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(10) }))
    .min(1)
    .max(50),
});

export const discountCreateSchema = z
  .object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9_-]{3,30}$/, "3–30 letters, numbers, - or _"),
    type: z.enum(["PERCENT", "FIXED"]),
    /** Percent (1–100) or dollars, converted to cents by the server. */
    value: z.number().positive(),
    minSubtotal: z.number().min(0).default(0),
    maxRedemptions: z.number().int().positive().nullable().optional(),
    expiresAt: z.string().datetime().nullable().optional(),
  })
  .refine((d) => d.type !== "PERCENT" || (d.value >= 1 && d.value <= 100 && Number.isInteger(d.value)), {
    message: "Percent must be a whole number from 1 to 100",
    path: ["value"],
  });
