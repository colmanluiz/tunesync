"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div className="text-sm text-(--silver-600)">Not logged in</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="text-sm">
        <div className="font-medium">{user?.name || "User"}</div>
        <div className="text-(--silver-500)">{user?.email}</div>
      </div>
      <Button onClick={logout} variant="destructive" size="sm">
        Logout
      </Button>
    </div>
  );
}
