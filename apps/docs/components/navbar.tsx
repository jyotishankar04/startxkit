"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Terminal, Github } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { label: "Docs", href: "/docs" },
  { label: "Getting Started", href: "/docs/getting-started" },
  { label: "Frameworks", href: "/docs/frameworks/express" },
  { label: "Architectures", href: "/docs/architectures/layered" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header>
      <nav
        aria-label="Main navigation"
        className="fixed top-0 z-50 w-full px-2 pt-2"
      >
        <div
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between gap-6 border bg-background/70 px-4 backdrop-blur-xl transition-all duration-200 lg:px-6",
            isScrolled
              ? "max-w-5xl rounded-2xl shadow-xl"
              : "rounded-[1.4rem] shadow-md",
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 py-3">
            <div className="flex size-9 items-center justify-center rounded-xl border bg-muted/50 text-primary">
              <Terminal className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              StartXKit
            </span>
          </Link>

          <div className="hidden items-center lg:flex">
            <ul className="flex items-center gap-1 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={
                      pathname === item.href ? "page" : undefined
                    }
                    className={cn(
                      "rounded-lg px-3 py-2 transition-colors",
                      pathname === item.href
                        ? "bg-muted/60 text-foreground"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 py-3">
            <ThemeToggle />
            <a
              href="https://github.com/jyotishankar04/startxkit"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
              aria-label="GitHub"
            >
              <Github className="size-[1.2rem]" />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="relative z-20 rounded-lg p-2 lg:hidden"
            >
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mt-2 rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur-xl lg:hidden">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={
                      pathname === item.href ? "page" : undefined
                    }
                    className={cn(
                      "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://github.com/jyotishankar04/startxkit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
