"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Rocket, Zap, History, Calendar, CreditCard, Settings, Users, LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/generator", icon: Zap, label: "Générateur" },
  { href: "/dashboard/history", icon: History, label: "Historique" },
  { href: "/dashboard/calendar", icon: Calendar, label: "Calendrier" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Facturation" },
  { href: "/dashboard/settings", icon: Settings, label: "Paramètres" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-screen">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
          <Rocket className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-sm">Content Rocket AI</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <item.icon className={cn("h-4 w-4", active ? "text-violet-600" : "")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-100 dark:border-zinc-800 p-4">
        <div className="flex items-center gap-3">
          <UserButton />
          <div className="text-xs text-zinc-500">Mon compte</div>
        </div>
      </div>
    </aside>
  );
}
