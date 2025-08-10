
import { z } from "zod";

// User schema
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Login schema
export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration schema
export const RegisterSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters"),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
