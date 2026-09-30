"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/api/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const menuItems = [
{ label: "الرئيسية", href: "/office/dashboard", icon: "⌂" },
{ label: "الرحلات", href: "/office/trips", icon: "▣" },
{ label: "الحجوزات", href: "/office/bookings", icon: "▤" },
{ label: "المركبات", href: "/office/buses", icon: "▱" },
{ label: "السائقين", href: "/office/drivers", icon: "♙" },
];

export default function OfficeSidebar() {
const pathname = usePathname();
const router = useRouter();

const [isLoggingOut, setIsLoggingOut] = useState(false);

async function handleLogout() {
if (isLoggingOut) return;


setIsLoggingOut(true);

try {
  await logout();
} catch (error) {
  console.error("Logout error:", error);
} finally {
  router.replace("/login");
  router.refresh();
}


}

return ( <aside className="w-64 shrink-0 border-l border-border/10 bg-sidebar p-4"> <div className="mb-8 border-b border-border/10 pb-6"> <div className="flex items-center gap-3"> <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-2xl text-primary">
🚌 </div>


      <div>
        <h2 className="font-bold text-white">مكتب النقل</h2>
        <p className="text-xs text-gray-500">رحلتي</p>
      </div>
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
            active
              ? "bg-primary/20 text-accent"
              : "text-gray-400 hover:bg-foreground/5 hover:text-foreground"
          }`}
        >
          <span className="w-6 text-center text-lg">
            {item.icon}
          </span>

          <span>{item.label}</span>
        </Link>
      );
    })}
  </nav>

  <div className="mt-8">
    <ThemeToggle variant="sidebar" />
  </div>

  <div className="mt-8 border-t border-border/10 pt-5">
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="text-lg">
        {isLoggingOut ? "..." : "↪"}
      </span>

      <span>
        {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
      </span>
    </button>
  </div>
</aside>


);
}
