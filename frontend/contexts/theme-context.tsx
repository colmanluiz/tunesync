"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Step 1: Define what our context will contain
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Step 2: Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Step 3: Create a provider component that will wrap our app
export function ThemeProvider({ children }: { children: ReactNode }) {
  // This is where we manage the state
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Function to toggle between themes
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // The value that will be shared with all child components
  const value: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Step 4: Create a custom hook to use the context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
