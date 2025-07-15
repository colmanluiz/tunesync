"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithToken, isAuthenticated, isLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Wait for auth context to initialize
    if (isLoading) return;

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    const token = searchParams.get("token");

    if (!token) {
      toast.error("No authentication token received");
      router.replace("/login");
      return;
    }

    // Process the token and get user data
    const processAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        // Login with the token and user data
        await loginWithToken(token, userData.user);

        // Use replace instead of push to prevent back button from triggering the loop
        router.replace("/dashboard");
        toast.success("Login successful!");
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed");
        router.replace("/login");
      } finally {
        setIsProcessing(false);
      }
    };

    processAuth();
  }, [searchParams, router, loginWithToken, isAuthenticated, isLoading]);

  // Show loading state
  if (isLoading || isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold mb-2">Completing login...</h1>
          <p className="text-gray-600">
            Please wait while we set up your account.
          </p>
        </div>
      </div>
    );
  }

  // This should never render as we always redirect
  return null;
}
