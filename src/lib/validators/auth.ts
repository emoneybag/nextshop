import { z } from "zod";

const email = z
  .string()
  .trim()
  .pipe(z.email("Enter a valid email address"))
  .transform((v) => v.toLowerCase());

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers and underscores only"),
  email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
