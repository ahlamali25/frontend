"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const menuItems = [
  { label: "الملف الشخصي", href: "/account/profile", icon: "◍" },
  { label: "رحلاتي", href: "/account/trips", icon: "▤" },
  { label: "المفضلة", href: "/account/favorites", icon: "♥" },
  { label: "طرق الدفع", href: "/account/payment-methods", icon: "▭" },
  { label: "الإعدادات", href: "/account/settings", icon: "⚙" },
];

export default function PassengerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-l border-border/10 bg-sidebar p-4">
      <div className="mb-6 flex items-center gap-3 border-b border-border/10 pb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-accent">
          أ
        </div>
        <div>
          <h2 className="font-bold text-white">أحمد محمد</h2>
          <p className="text-xs text-gray-500">صديق بك</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active ? "bg-primary/20 text-accent" : "text-gray-400 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <span className="w-6 text-center text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-border/10 pt-5">
        <ThemeToggle className="mb-3 w-full justify-start rounded-xl px-4 py-3" />
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-400">
          <span className="text-lg">↪</span>
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}