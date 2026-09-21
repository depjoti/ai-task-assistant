"use client";

import { FileText, ListChecks, MessageSquare, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/agent-tasks", label: "Tasks", icon: ListChecks },
  { href: "/search", label: "Search", icon: Search },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="bg-background/90 sticky top-0 z-10 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-2.5">
        <div className="text-foreground flex shrink-0 items-center gap-1.5 pr-2 text-sm font-semibold">
          <Sparkles className="text-primary size-4" />
          <span className="hidden sm:inline">AI Task Assistant</span>
        </div>

        <nav className="flex flex-1 items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
