"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BusIcon } from "@/components/icons/BusIcon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  variant?: "solid" | "transparent";
}

export function Navbar({ variant = "solid" }: NavbarProps) {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    logout,
    user,
  } = useAuth();

  const navClass =
    variant === "transparent"
      ? "relative z-20 border-b border-border/5 bg-background/80 backdrop-blur"
      : "border-b border-border/5";

  async function handleAuthButtonClick() {
    if (isAuthenticated) {
      await logout();
      router.push("/");
    } else {
      router.push("/login");
    }
  }

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "المكاتب", href: "/offices" },
    user?.role === "office_admin"
      ? { label: "لوحة التحكم", href: "/office/dashboard" }
      : { label: "رحلاتي", href: "/account/trips" },
  ];

  return (
    <nav className={navClass}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <BusIcon width={32} height={32} />
          <span className="text-2xl font-bold text-primary">
            رحلتي
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <ThemeToggle compact />

        <button
          onClick={handleAuthButtonClick}
          disabled={isLoading}
          className={
            isAuthenticated
              ? "rounded-lg border border-border/15 bg-foreground/5 px-6 py-2.5 text-sm font-bold text-gray-200 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-60"
              : "rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#4f3ad6]/40 transition hover:bg-primary-hover hover:shadow-xl hover:shadow-[#4f3ad6]/60 disabled:opacity-60"
          }
        >
          {isAuthenticated ? "تسجيل الخروج" : "تسجيل الدخول"}
        </button>
      </div>
    </nav>
  );
}