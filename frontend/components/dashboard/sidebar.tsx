"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "../Logo";
import {
  MdSpaceDashboard,
  MdMusicNote,
  MdRefresh,
  MdSettings,
  MdLogout,
} from "react-icons/md";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: MdSpaceDashboard },
  { name: "Services", href: "/services", icon: MdMusicNote },
  { name: "Sync History", href: "/dashboard/history", icon: MdRefresh },
  { name: "Settings", href: "/dashboard/settings", icon: MdSettings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-(--honeysuckle-100) text-(--honeysuckle-950)"
                  : "text-(--silver-500) hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "size-5",
                  isActive ? "text-(--honeysuckle-950)" : "text-(--silver-300)"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-muted" />
          <div className="flex-1 truncate">
            <div className="text-sm font-medium">John Doe</div>
            <div className="truncate text-xs text-muted-foreground">
              john@example.com
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <MdLogout className="size-5 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
}
