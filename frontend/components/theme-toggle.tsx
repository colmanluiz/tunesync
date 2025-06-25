"use client";

import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle() {
  // This is how we use the context - we get theme and toggleTheme from useTheme()
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`px-4 py-2 rounded-lg transition-colors ${
        theme === "light"
          ? "bg-gray-800 text-white hover:bg-gray-700"
          : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
      }`}
    >
      Current theme: {theme}
    </button>
  );
}
