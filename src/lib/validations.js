import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(40, "First name cannot exceed 40 characters"),
  lastName: z
    .string()
    .trim()
    .max(40, "Last name cannot exceed 40 characters")
    .optional()
    .nullable(),
  email: z
    .string()
    .email("Invalid email address format")
    .max(255, "Email cannot exceed 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password cannot exceed 255 characters"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(1, "Password is required"),
});
