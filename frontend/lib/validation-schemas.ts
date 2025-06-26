import * as z from "zod/v4";

export const loginFormSchema = z.object({
  email: z.email({ message: "Email must be valid." }),
  password: z.string()
});