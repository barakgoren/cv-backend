import { z } from "zod";

const userValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a string"
  }).min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 6 characters long")
});

export const userLoginValidationSchema = z.object({
  username: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a string"
  }).min(3, "Username must be at least 3 characters long"),
  password: z.string().min(3, "Password must be at least 6 characters long")
});

export default userValidationSchema;