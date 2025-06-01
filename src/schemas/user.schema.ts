import { z } from "zod";

const userValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 6 characters long")
});

export const userLoginValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 6 characters long")
});

export default userValidationSchema;