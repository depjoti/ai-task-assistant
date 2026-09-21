"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Chat" },
  { href: "/documents", label: "Documents" },
  { href: "/agent-tasks", label: "Tasks" },
  { href: "/search", label: "Search" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b px-4 py-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            pathname === link.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
