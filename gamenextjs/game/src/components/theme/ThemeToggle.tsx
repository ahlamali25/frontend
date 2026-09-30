"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemeToggle({
  className = "",
  compact = false,
  variant = "default",
}: {
  className?: string;
  compact?: boolean;
  variant?: "default" | "sidebar";
}) {
  const { theme, toggleTheme } = useTheme();
  const variantClass =
    variant === "sidebar"
      ? "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-foreground/5 hover:text-foreground"
      : "inline-flex items-center gap-2 rounded-lg border border-border/50 bg-card-secondary px-3 py-2 text-sm text-foreground transition hover:bg-card";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      className={`${variantClass} ${className}`}
    >
      <span className={variant === "sidebar" ? "text-lg" : ""} aria-hidden="true">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
      <span className={compact ? "sr-only sm:not-sr-only" : ""}>
        {theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
      </span>
    </button>
  );
}
