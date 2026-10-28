import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.number().int().positive(),
  rating: z.number("Choose a rating").int().min(1, "Choose a rating").max(5, "Choose a rating"),
  title: z.string().trim().min(2, "Add a short title").max(80, "Title is too long"),
  body: z.string().trim().min(10, "Review must be at least 10 characters").max(1000, "Review is too long (1000 max)"),
});
