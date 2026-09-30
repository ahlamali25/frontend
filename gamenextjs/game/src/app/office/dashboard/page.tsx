"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils/format";
import { StatCard } from "@/components/ui/StatCard";
import { RouteDonutChart } from "@/components/office/RouteDonutChart";
import { PrimaryButton } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api/client";

interface Office {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
}

interface RecentTrip {
  id: number;
  from_governorate: string;
  to_governorate: string;
  departure_time: string;
  departure_date: string;
  seat_price: number;
  status: string;
}

interface RouteDistribution {
  from_governorate: string;
  to_governorate: string;
  count: number;
}

interface DashboardData {
  office: Office;
  total_revenue: number;
  bookings_count: number;
  reserved_seats: number;
  trips_count: number;
  recent_trips: RecentTrip[];
  route_distribution: RouteDistribution[];
}

export default function OfficeOverviewPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await apiFetch<DashboardData>("/office/dashboard", {
          auth: true,
        });

        setDashboard(data);
      } catch (err) {
        console.error(err);
        setError("تعذر تحميل بيانات لوحة التحكم.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1500px]">
        <div className="flex min-h-[400px] items-center justify-center text-gray-400">
          جاري تحميل لوحة التحكم...
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="mx-auto max-w-[1500px]">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-red-400">
            {error ?? "تعذر تحميل بيانات لوحة التحكم."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Welcome banner */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-border/10">
        <div className="absolute inset-0 bg-gradient-to-l from-surface-page/95 via-surface-page/60 to-surface-page/20" />

        <div className="relative z-10 p-8">
          <p className="mb-2 text-sm text-accent">
            🚌 مرحباً بك في لوحة التحكم
          </p>

          <h1 className="text-2xl font-bold">
            {dashboard.office.name}
          </h1>

          <p className="mt-2 max-w-md text-sm text-gray-400">
            هنا يمكنك متابعة رحلاتك وحجوزاتك ومركباتك وسائقيك بسهولة.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-5 md:grid-cols-4">
        <StatCard
          title="إجمالي الإيرادات"
          value={dashboard.total_revenue.toLocaleString("en-US")}
          suffix="ل.س"
          variant="purple"
        />

        <StatCard
          title="المقاعد المحجوزة"
          value={dashboard.reserved_seats.toLocaleString("en-US")}
        />

        <StatCard
          title="عدد الحجوزات"
          value={dashboard.bookings_count.toLocaleString("en-US")}
          variant="green"
        />

        <StatCard
          title="إجمالي الرحلات"
          value={dashboard.trips_count.toLocaleString("en-US")}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RouteDonutChart
          routes={dashboard.route_distribution}
        />

        {/* Latest trips table */}
        <div className="rounded-2xl border border-border/10 bg-card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">أحدث الرحلات</h2>

            <Link
              href="/office/trips"
              className="text-sm text-accent hover:underline"
            >
              عرض الكل
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="text-gray-500">
                  <th className="pb-3 font-medium">رقم الرحلة</th>
                  <th className="pb-3 font-medium">من</th>
                  <th className="pb-3 font-medium">إلى</th>
                  <th className="pb-3 font-medium">التاريخ</th>
                  <th className="pb-3 font-medium">الوقت</th>
                  <th className="pb-3 font-medium">السعر</th>
                  <th className="pb-3 font-medium">الحالة</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recent_trips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-t border-border/5"
                  >
                    <td className="py-3 font-medium text-accent">
                      {trip.id}
                    </td>

                    <td className="py-3">
                      {trip.from_governorate}
                    </td>

                    <td className="py-3">
                      {trip.to_governorate}
                    </td>

                    <td className="py-3 text-gray-400">
                      {trip.departure_date}
                    </td>

                    <td className="py-3 text-gray-400">
                      {trip.departure_time}
                    </td>

                    <td className="py-3 font-bold">
                      {formatPrice(trip.seat_price)} ل.س
                    </td>

                    <td className="py-3">
                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-bold ${
                          trip.status === "confirmed"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {trip.status === "confirmed"
                          ? "مؤكد"
                          : trip.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {dashboard.recent_trips.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-gray-500"
                    >
                      لا توجد رحلات حتى الآن
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA banner */}
      <div className="mt-6 flex items-center justify-between rounded-2xl border border-primary/30 bg-gradient-to-l from-card-muted to-cta-deep p-8">
        <div>
          <h3 className="text-lg font-bold">
            رحلتك تبدأ من هنا
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            إدارة رحلاتك بأسلوب احترافي وسهل
          </p>
        </div>

        <Link href="/office/trips/new">
          <PrimaryButton>+ إضافة رحلة جديدة</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}