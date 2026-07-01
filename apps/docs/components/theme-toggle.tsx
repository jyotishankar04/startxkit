"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="relative inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-foreground shadow-sm transition-colors hover:bg-muted"
      aria-label={`Switch to ${nextTheme} theme`}
    >
      <span className="relative inline-flex size-[1.1rem] items-center justify-center">
        <Sun className="absolute size-[1.1rem] scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute size-[1.1rem] scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      </span>
      <span className="hidden text-xs font-medium sm:inline">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
