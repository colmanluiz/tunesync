"use client";

import { useAuth } from "@/contexts/auth-context";

export function AuthStatus() {
  const { user, profile, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div className="text-sm text-gray-600">Not logged in</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="text-sm">
        <div className="font-medium">{profile?.display_name}</div>
        <div className="text-gray-500">{user?.email}</div>
      </div>
      <button
        onClick={logout}
        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
