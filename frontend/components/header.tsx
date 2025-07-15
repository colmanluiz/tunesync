"use client";

import { Navigation } from "./navigation";
import { Button } from "./ui/button";
import { Logo } from "./Logo";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import DropdownMenuWithIcon from "./customized/dropdown-menu/dropdown-menu-02";
import { ArrowRight } from "lucide-react";

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="top-0 z-50 bg-(--background-light)">
      <div className="w-full mx-auto px-6">
        <div className="grid grid-cols-3 items-center h-20">
          <div className="flex items-center space-x-2 justify-start">
            <Logo />
          </div>
          <div className="flex justify-center">
            <Navigation />
          </div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-6 justify-end">
              <Link href="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <DropdownMenuWithIcon />
            </div>
          ) : (
            <div className="flex items-center space-x-2 justify-end">
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
