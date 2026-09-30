"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PrimaryButton } from "@/components/ui/Button";
import { governorates } from "@/lib/constants/governorates";


export default function Home() {
  const [from, setFrom] = useState("دمشق");
  const [to, setTo] = useState("حلب");
  const [date, setDate] = useState("2026-05-25");
  const [passengers, setPassengers] = useState(1);

  function handleSearch() {
    const params = new URLSearchParams({
      from,
      to,
      date,
      passengers: String(passengers),
    });

    window.location.href = `/trips?${params.toString()}`;
  }

  return (
    <main className="min-h-screen">
      <Navbar variant="transparent" />

      <section className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bus.png')" }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-hero-fade via-hero-fade/60 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-end justify-center px-6 text-hero-foreground">
          <div className="mb-8">
            <h1 className="mb-2 text-7xl font-black leading-tight text-right md:text-8xl">
              <span className="block">سافر</span>
              <span className="block bg-gradient-to-l from-accent to-accent-highlight bg-clip-text text-transparent">
                براحتك
              </span>
            </h1>
          </div>

          <p className="max-w-2xl text-right text-lg leading-8 text-hero-muted">
            احجز تذكرتك بين جميع المحافظات
            <br />
            بسهولة وأمان من منزلك
          </p>
        </div>
      </section>

      <section className="relative z-20 -mt-20 mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-primary/40 bg-card/95 p-8 shadow-2xl backdrop-blur-md">
          <div className="grid gap-6 md:grid-cols-4">
            {/* من المحافظة */}
            <div className="flex flex-col">
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f3ad6"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="10" r="1" fill="#4f3ad6" />
                  <path d="M12 1v9m0 0a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
                </svg>
                من المحافظة
              </label>

              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-lg border border-primary/20 bg-card-secondary px-4 py-3 text-foreground placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {governorates.map((g) => (
                  <option
                    key={g}
                    value={g}
                    className="bg-card-secondary"
                  >
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* إلى المحافظة */}
            <div className="flex flex-col">
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f3ad6"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="10" r="1" fill="#4f3ad6" />
                  <path d="M12 1v9m0 0a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
                </svg>
                إلى المحافظة
              </label>

              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-lg border border-primary/20 bg-card-secondary px-4 py-3 text-foreground placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {governorates.map((g) => (
                  <option
                    key={g}
                    value={g}
                    className="bg-card-secondary"
                  >
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* تاريخ الرحلة */}
            <div className="flex flex-col">
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f3ad6"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                تاريخ الرحلة
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg border border-primary/20 bg-card-secondary px-4 py-3 text-foreground placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* عدد الركاب */}
            <div className="flex flex-col">
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f3ad6"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                </svg>
                عدد الركاب
              </label>

              <input
                type="number"
                min="1"
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="rounded-lg border border-primary/20 bg-card-secondary px-4 py-3 text-foreground placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* زر البحث */}
          <PrimaryButton
            onClick={handleSearch}
            className="mt-8 flex w-full items-center justify-center gap-3"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            البحث عن رحلات
          </PrimaryButton>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="group flex flex-col items-center rounded-2xl border border-primary/20 bg-gradient-to-b from-card/50 to-card-deep/50 p-8 text-center backdrop-blur transition hover:border-primary/60 hover:bg-card/80">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/15 text-accent transition group-hover:bg-primary/30 group-hover:shadow-lg group-hover:shadow-[#4f3ad6]/20">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 12a9 9 0 1 1 18 0A9 9 0 0 1 3 12z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>

            <h3 className="mb-2 text-lg font-bold">حجز سريع وآمن</h3>

            <p className="text-sm leading-6 text-gray-400">
              احجز تذكرتك بسهولة من منزلك في دقائق معدودة
            </p>
          </div>

          <div className="group flex flex-col items-center rounded-2xl border border-primary/20 bg-gradient-to-b from-card/50 to-card-deep/50 p-8 text-center backdrop-blur transition hover:border-primary/60 hover:bg-card/80">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/15 text-accent transition group-hover:bg-primary/30 group-hover:shadow-lg group-hover:shadow-[#4f3ad6]/20">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
                <circle cx="7" cy="15" r="1" />
              </svg>
            </div>

            <h3 className="mb-2 text-lg font-bold">دفع إلكتروني آمن</h3>

            <p className="text-sm leading-6 text-gray-400">
              خيارات دفع متنوعة وآمنة لراحتك
            </p>
          </div>

          <div className="group flex flex-col items-center rounded-2xl border border-primary/20 bg-gradient-to-b from-card/50 to-card-deep/50 p-8 text-center backdrop-blur transition hover:border-primary/60 hover:bg-card/80">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/15 text-accent transition group-hover:bg-primary/30 group-hover:shadow-lg group-hover:shadow-[#4f3ad6]/20">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 4h16v14H4z" />
                <path d="M4 10h16M8 14h8" />
              </svg>
            </div>

            <h3 className="mb-2 text-lg font-bold">تذكرة إلكترونية</h3>

            <p className="text-sm leading-6 text-gray-400">
              تذكرتك جاهزة بعد إتمام الحجز مباشرة
            </p>
          </div>

          <div className="group flex flex-col items-center rounded-2xl border border-primary/20 bg-gradient-to-b from-card/50 to-card-deep/50 p-8 text-center backdrop-blur transition hover:border-primary/60 hover:bg-card/80">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/15 text-accent transition group-hover:bg-primary/30 group-hover:shadow-lg group-hover:shadow-[#4f3ad6]/20">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 1L3 5v7c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                <path d="M9 13l2 2 4-4" />
              </svg>
            </div>

            <h3 className="mb-2 text-lg font-bold">رحلة آمنة موثوقة</h3>

            <p className="text-sm leading-6 text-gray-400">
              اختر من أفضل شركات النقل المجربة
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}