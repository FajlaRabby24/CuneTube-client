import { z } from "zod";

export const loginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export const registerZodSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirm_password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  // image: z.url().nullable(),
});
