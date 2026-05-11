"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-5xl">
      <nav className="glass-matte rounded-full px-6 py-3 flex items-center justify-between cinematic-shadow">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-olive-800 rounded-full flex items-center justify-center text-white font-heading italic text-lg transition-transform group-hover:scale-110">
            S
          </div>
          <span className="font-heading text-xl italic tracking-tight text-olive-900 dark:text-olive-100">
            SpendLens
          </span>
        </Link>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            {[
              { name: "Audit", href: "/audit" },
              { name: "Pricing", href: "/#pricing" },
              { name: "About", href: "/#about" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-olive-700 dark:hover:text-olive-300",
                  pathname === link.href 
                    ? "text-olive-900 dark:text-olive-100" 
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <Link
            href="/audit"
            className="bg-olive-800 hover:bg-olive-900 text-white text-xs font-semibold px-5 py-2 rounded-full transition-all hover:px-7 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
