import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),

  email: z
    .email(),

  password: z
    .string()
    .min(8)
    .max(100),
});

export type RegisterInput =
  z.infer<typeof registerSchema>;