"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FaBus,
  FaClock,
  FaChair,
  FaMoneyBillWave,
  FaArrowRight,
  FaFilter,
} from "react-icons/fa";
import { searchTrips } from "@/lib/api/trips";
import { TripListing } from "@/types/tripListing";
import { formatPrice } from "@/lib/utils/format";
import { PrimaryButton } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function TripsPage() {
  const searchParams = useSearchParams();

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const officeId = searchParams.get("office_id") || "";
  const passengers = Number(searchParams.get("passengers")) || 1;

  const [trips, setTrips] = useState<TripListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    searchTrips({
      from_governorate: from,
      to_governorate: to,
      departure_date: date,
      office_id: officeId,
    })
      .then(setTrips)
      .catch(() => {
        setError("تعذر تحميل الرحلات، حاول مرة أخرى.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [from, to, date, officeId]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <ThemeToggle className="fixed left-4 top-4 z-50" compact />

      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {officeId ? "رحلات المكتب" : "الرحلات المتوفرة"}
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            {officeId
              ? "نعرض لكم الرحلات المتاحة لهذا المكتب."
              : from && to && date
                ? `نعرض لكم الرحلات المتاحة من ${from} إلى ${to} بتاريخ ${date}.`
                : "استعرض الرحلات المتاحة من مختلف مكاتب النقل."}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            عدد الركاب: {passengers}
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-border/10 bg-card px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-foreground/5"
        >
          <span>تعديل البحث</span>
          <FaArrowRight className="text-xs" />
        </Link>
      </header>

      {isLoading && (
        <div className="rounded-2xl border border-border/10 bg-card p-10 text-center text-gray-400">
          جارٍ تحميل الرحلات...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-10 text-center text-rose-400">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-between rounded-xl border border-border/10 bg-sidebar p-4">
              <span className="text-xs text-gray-400">
                الترتيب حسب:
              </span>

              <select className="bg-transparent text-sm font-medium text-white outline-none">
                <option value="earliest" className="bg-sidebar">
                  الأقرب انطلاقاً
                </option>

                <option value="cheapest" className="bg-sidebar">
                  الأقل سعراً
                </option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/10 bg-sidebar p-4">
              <span className="text-xs text-gray-400">
                نوع الباص:
              </span>

              <select className="bg-transparent text-sm font-medium text-white outline-none">
                <option value="all" className="bg-sidebar">
                  كل الأنواع
                </option>

                <option value="vip" className="bg-sidebar">
                  VIP فقط
                </option>
              </select>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-xl border border-border/10 bg-card p-4 text-sm font-medium text-accent transition hover:bg-card/70">
              <FaFilter />
              <span>تصفية متقدمة</span>
            </button>
          </section>

          {trips.length === 0 && (
            <div className="rounded-2xl border border-border/10 bg-card p-10 text-center">
              <p className="text-lg font-bold text-gray-300">
                عذرًا، لا توجد رحلات متوفرة
              </p>

              <p className="mt-2 text-sm text-gray-500">
                لا توجد رحلات مطابقة للبحث المحدد.
              </p>
            </div>
          )}

          {trips.length > 0 && (
            <section className="space-y-4">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-2xl border border-border/10 bg-card p-5 transition hover:border-primary/40"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    {/* معلومات المكتب */}
                    <div className="flex items-center gap-4 md:min-w-[180px]">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card-secondary text-xl text-accent">
                        <FaBus />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">
                          {trip.companyName}
                        </h3>

                        <span className="mt-2 inline-block rounded bg-sidebar px-2 py-0.5 text-xs text-gray-300">
                          {trip.busCategory === "VIP"
                            ? "رجال أعمال (VIP)"
                            : trip.busCategory}
                        </span>
                      </div>
                    </div>

                    {/* مسار الرحلة */}
                   <div className="flex w-full items-center justify-center gap-5 rounded-xl border border-border/5 bg-overlay/20 px-4 py-4 md:w-auto md:min-w-[360px]">
  {/* الانطلاق */}
  <div className="min-w-[80px] text-center">
    <p className="text-xs font-medium text-gray-400">
      {trip.fromGovernorate}
    </p>

    <p className="mt-1 text-xl font-black text-white">
      {trip.departureTime}
    </p>

    <p className="mt-1 text-[11px] text-gray-500">
      الانطلاق
    </p>
  </div>

  {/* مدة الرحلة + الخط + التاريخ */}
  <div className="flex min-w-[110px] flex-col items-center">
    <span className="text-[11px] text-accent">
      {trip.durationHours} ساعات
    </span>

    <div className="my-2 flex w-full items-center justify-center gap-1">
      <span className="h-px flex-1 border-t border-dashed border-border/30" />

      <FaClock className="shrink-0 text-xs text-primary" />

      <span className="h-px flex-1 border-t border-dashed border-border/30" />
    </div>

    <span className="text-[11px] text-gray-400">
      {trip.departureDate}
    </span>
  </div>

  {/* الوصول */}
  <div className="min-w-[80px] text-center">
    <p className="text-xs font-medium text-gray-400">
      {trip.toGovernorate}
    </p>

    <p className="mt-1 text-xl font-black text-white">
      {trip.arrivalTime}
    </p>

    <p className="mt-1 text-[11px] text-gray-500">
      الوصول
    </p>
  </div>
</div>

                    {/* السعر والحجز */}
                    <div className="flex w-full items-center justify-between gap-4 border-t border-border/5 pt-4 md:w-auto md:min-w-[190px] md:flex-col md:items-end md:border-t-0 md:pt-0">
                      <div>
                        <div className="flex items-center gap-1 md:justify-end">
                          <FaMoneyBillWave className="text-sm text-emerald-500" />

                          <span className="text-xl font-black text-emerald-400">
                            {formatPrice(trip.price)} ل.س
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400 md:justify-end">
                          <FaChair />

                          {trip.availableSeats > 0 ? (
                            <span>
                              متبقي{" "}
                              <span className="font-bold text-accent">
                                {trip.availableSeats}
                              </span>{" "}
                              مقاعد من {trip.totalSeats}
                            </span>
                          ) : (
                            <span className="font-bold text-rose-400">
                              ممتلئة بالكامل
                            </span>
                          )}
                        </div>
                      </div>

                      {trip.availableSeats > 0 ? (
                        <Link
                          href={`/seats?tripId=${trip.id}`}
                          className="w-auto"
                        >
                          <PrimaryButton className="whitespace-nowrap text-sm">
                            حجز المقاعد
                          </PrimaryButton>
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="cursor-not-allowed rounded-xl bg-foreground/5 px-6 py-2.5 text-center text-sm font-bold text-gray-400"
                        >
                          مغلق
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}