import * as z from "zod/v4";

export const loginFormSchema = z.object({
  email: z.email({ message: "Email must be valid." }),
  password: z.string()
});

export const registerFormSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.email({ message: "Email must be valid." }),
  password: z.string(),
  confirmPassword: z.string()
})