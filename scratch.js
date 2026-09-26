import { z } from "zod";
const createClassSchema = z.object({
  className: z
    .string()
    .trim()
    .min(1, "Class name is required")
    .max(50, "Class name must be at most 50 characters"),
  description: z
    .string()
    .trim()
    .max(255, "Description must be at most 255 characters")
    .optional(),
});

console.log(createClassSchema.safeParse({ className: "Test", description: "" }));
