
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/lib/api/auth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState("المسافر");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser();
        setUserName(user.name || "المسافر");
      } catch {
        // الاسم الافتراضي في حال تعذر تحميل بيانات المستخدم
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await logout();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-surface-page text-foreground"
    >
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        {/* Floating User Card */}
        <div className="mb-8 flex justify-end gap-3">
          <ThemeToggle compact />
          <div className="flex items-center gap-4 rounded-2xl border border-border/[0.08] bg-card/80 px-4 py-2.5 backdrop-blur-md transition hover:border-border/[0.12]">
            {/* User Name */}
            <span className="text-sm font-semibold text-gray-200">
              {userName}
            </span>

            {/* Divider */}
            <span className="h-5 w-px bg-border/10" />

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="group flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M16 17l5-5-5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M21 12H9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {loggingOut ? "جارٍ الخروج..." : "تسجيل الخروج"}
            </button>
          </div>
        </div>

        {/* Account Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
