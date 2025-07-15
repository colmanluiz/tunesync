"use client";

import { loginFormSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/contexts/auth-context";
import { AuthFormContainer } from "./auth-form-container";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      if (error.code === "token_expired") {
        toast.error("Your session has expired. Please log in again.");
      } else if (error.code === "network_error") {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/login`;
  };

  return (
    <AuthFormContainer
      title="Welcome back"
      description="Login to your account"
      onGoogleClick={handleGoogleLogin}
      footerContent={
        <>
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </>
      }
      className={className}
      {...props}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="******"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            variant="primary"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 text-(--honeysuckle-300) hover:text-(--honeysuckle-400)"
            >
              Register
            </Link>
          </div>
        </form>
      </Form>
    </AuthFormContainer>
  );
}
