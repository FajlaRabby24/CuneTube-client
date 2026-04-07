import { z } from "zod";

export const loginZodSchema = z.object({
  email: z.email("Email must be a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long"),
});

export const registerZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),

  email: z.email("Email must be a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long"),
  image: z.string().url("Image must be a valid URL").nullable().optional(),
});

export const verifyEmailSchema = z.object({
  email: z.email("Email must be a valid email address"),
  otp: z.string().length(6, "OTP must be 6 characters long"),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Current password must be at least 8 characters long"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long"),
});
