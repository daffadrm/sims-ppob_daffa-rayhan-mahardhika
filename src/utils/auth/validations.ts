import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const registerSchema = z
  .object({
    first_name: z.string().min(2, "Nama Depan minimal 2 karakter"),
    last_name: z.string().min(2, "Nama Belakang minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z
      .string()
      .min(8, "Konfirmasi password minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password harus sama",
    path: ["confirmPassword"],
  });
