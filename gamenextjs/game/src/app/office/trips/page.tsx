"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils/format";
import { StatCard } from "@/components/ui/StatCard";

type Trip = {
  id: number;
  from_governorate: string;
  to_governorate: string;
  departure_date: string;
  departure_time: string;
  arrival_time?: string;
  seat_price: string | number;
  vip_seat_price?: string | number;
  available_seats: number;
  status: string;
  bookings_count?: number;

  bus?: {
    id: number;
    name?: string;
    plate_number?: string;
    type?: string;
    capacity?: number;
  };

  driver?: {
    id: number;
    name: string;
  };

  assistantDriver?: {
    id: number;
    name: string;
  };
};

type TripsResponse = {
  trips: Trip[];
  stats: {
    total: number;
    confirmed: number;
    revenue: number;
  };
};

const statusLabels: Record<string, string> = {
  published: "مؤكد",
  cancelled: "ملغى",
  draft: "مسودة",
};

const governorates = [
  "دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
];

function formatDate(date: string) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("ar-SY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getStatusLabel(status: string) {
  return statusLabels[status] ?? status;
}

function getStatusClass(status: string) {
  if (status === "published") {
    return "bg-emerald-500/15 text-emerald-400";
  }

  if (status === "cancelled") {
    return "bg-red-500/15 text-red-400";
  }

  return "bg-yellow-500/15 text-yellow-400";
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    revenue: 0,
  });

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [fromGovernorate, setFromGovernorate] = useState("");
  const [toGovernorate, setToGovernorate] = useState("");

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTrips() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (fromDate) {
        params.set("from_date", fromDate);
      }

      if (toDate) {
        params.set("to_date", toDate);
      }

      if (fromGovernorate) {
        params.set("from_governorate", fromGovernorate);
      }

      if (toGovernorate) {
        params.set("to_governorate", toGovernorate);
      }

      if (status) {
        params.set("status", status);
      }

      const query = params.toString();

      const response = await apiFetch<TripsResponse>(
        `/trips${query ? `?${query}` : ""}`,
        {
          auth: true,
        }
      );

      setTrips(response.trips ?? []);

      setStats({
        total: response.stats?.total ?? 0,
        confirmed: response.stats?.confirmed ?? 0,
        revenue: response.stats?.revenue ?? 0,
      });
    } catch (err) {
      console.error(err);

      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("انتهت جلسة تسجيل الدخول، يرجى تسجيل الدخول مرة أخرى.");
        } else {
          setError(err.message);
        }
      } else {
        setError("حدث خطأ أثناء تحميل الرحلات.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrips();
  }, [fromDate, toDate, fromGovernorate, toGovernorate, status]);

  return (
    <div className="mx-auto max-w-[1500px]" dir="rtl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm text-accent">مكتب النقل</p>

          <h1 className="text-4xl font-black">الرحلات</h1>

          <p className="mt-2 text-sm text-gray-400">
            إدارة ومتابعة جميع الرحلات الخاصة بالمكتب
          </p>
        </div>

        <Link
          href="/office/trips/new"
          className="rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-[#4f3ad6]/20 transition hover:bg-primary-hover"
        >
          + إضافة رحلة جديدة
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-primary/20 bg-card p-5">
        <div className="grid gap-4 md:grid-cols-5">
          {/* From date */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              من تاريخ
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          {/* To date */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              إلى تاريخ
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          {/* From governorate */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              من
            </label>

            <select
              value={fromGovernorate}
              onChange={(e) => setFromGovernorate(e.target.value)}
              className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">كل المحافظات</option>

              {governorates.map((governorate) => (
                <option key={governorate} value={governorate}>
                  {governorate}
                </option>
              ))}
            </select>
          </div>

          {/* To governorate */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              إلى
            </label>

            <select
              value={toGovernorate}
              onChange={(e) => setToGovernorate(e.target.value)}
              className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">كل المحافظات</option>

              {governorates.map((governorate) => (
                <option key={governorate} value={governorate}>
                  {governorate}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              الحالة
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">جميع الحالات</option>
              <option value="published">مؤكد</option>
              <option value="cancelled">ملغى</option>
              <option value="draft">مسودة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <StatCard
          title="إجمالي الرحلات"
          value={stats.total.toLocaleString("ar-SY")}
        />

        <StatCard
          title="الرحلات المؤكدة"
          value={stats.confirmed.toLocaleString("ar-SY")}
          variant="green"
        />

        <StatCard
          title="الإيرادات"
          value={formatPrice(stats.revenue)}
          suffix="ل.س"
          variant="purple"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-primary/20 bg-card p-10 text-center text-gray-400">
          جاري تحميل الرحلات...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && trips.length === 0 && (
        <div className="rounded-2xl border border-primary/20 bg-card p-10 text-center">
          <p className="text-lg font-bold">لا توجد رحلات</p>

          <p className="mt-2 text-sm text-gray-400">
            لا توجد رحلات مطابقة للفلاتر المحددة.
          </p>
        </div>
      )}

      {/* Trips table */}
      {!loading && !error && trips.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-right">
              <thead className="border-b border-border/10 bg-surface-deeper">
                <tr className="text-sm text-gray-400">
                  <th className="px-6 py-5">رقم الرحلة</th>
                  <th className="px-6 py-5">السائق</th>
                  <th className="px-6 py-5">الرحلة</th>
                  <th className="px-6 py-5">التاريخ</th>
                  <th className="px-6 py-5">المقاعد المتاحة</th>
                  <th className="px-6 py-5">السعر</th>
                  <th className="px-6 py-5">الحالة</th>
                  <th className="px-6 py-5">الإجراء</th>
                </tr>
              </thead>

              <tbody>
                {trips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-b border-border/5 transition hover:bg-foreground/[0.02]"
                  >
                    {/* ID */}
                    <td className="px-6 py-5 font-medium text-accent">
                      #{trip.id}
                    </td>

                    {/* Driver */}
                    <td className="px-6 py-5">
                      {trip.driver?.name ?? "غير محدد"}
                    </td>

                    {/* Route */}
                    <td className="px-6 py-5">
                      <div className="font-medium">
                        {trip.from_governorate} ← {trip.to_governorate}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {trip.departure_time}
                        {trip.arrival_time
                          ? ` - ${trip.arrival_time}`
                          : ""}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-5 text-gray-300">
                      {formatDate(trip.departure_date)}
                    </td>

                    {/* Seats */}
                    <td className="px-6 py-5">
                      {trip.available_seats}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5 font-bold">
                      {formatPrice(Number(trip.seat_price))} ل.س
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold ${getStatusClass(
                          trip.status
                        )}`}
                      >
                        {getStatusLabel(trip.status)}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">
                      <Link
                        href={`/office/trips/${trip.id}`}
                        className="inline-block rounded-lg bg-surface-selected px-3 py-2 text-accent transition hover:bg-primary/20"
                      >
                        عرض
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}