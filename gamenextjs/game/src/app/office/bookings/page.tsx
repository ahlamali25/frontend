"use client";

import { useEffect, useState } from "react";

import { apiFetch, ApiError } from "@/lib/api/client";

type Booking = {
  id: number;
  booking_code: string;
  user_id: number;
  trip_id: number;
  seats_count: number;
  total_amount: string | number;
  status: string;
  created_at?: string;

  user?: {
    id: number;
    name: string;
    phone?: string;
  };

  trip?: {
    id: number;
    from_governorate: string;
    to_governorate: string;
    departure_date: string;
    departure_time: string;
  };

  payment?: {
    id: number;
    amount?: string | number;
    status?: string;
  } | null;
};

type PaginatedBookings = {
  data: Booking[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type BookingStats = {
  total: number;
  confirmed: number;
  revenue: number;
};

type OfficeBookingsResponse = {
  bookings: PaginatedBookings;
  stats: BookingStats;
};

function formatDate(date: string) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("ar-SY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${date}T00:00:00`));
}

function formatAmount(amount: string | number) {
  return new Intl.NumberFormat("ar-SY").format(
    Number(amount) || 0
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case "confirmed":
      return "مؤكد";

    case "pending":
      return "قيد الانتظار";

    case "cancelled":
      return "ملغي";

    case "completed":
      return "مكتمل";

    default:
      return status || "غير محدد";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "confirmed":
    case "completed":
      return "bg-green-500/10 text-green-400";

    case "pending":
      return "bg-yellow-500/10 text-yellow-400";

    case "cancelled":
      return "bg-red-500/10 text-red-400";

    default:
      return "bg-foreground/5 text-gray-400";
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [tripId, setTripId] = useState("");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [bookingStats, setBookingStats] = useState<BookingStats>({
    total: 0,
    confirmed: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBookings(page = 1) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
      });

      if (dateFrom) {
        params.set("date_from", dateFrom);
      }

      if (dateTo) {
        params.set("date_to", dateTo);
      }

      if (tripId) {
        params.set("trip_id", tripId);
      }

      if (status) {
        params.set("status", status);
      }

      const response = await apiFetch<OfficeBookingsResponse>(
        `/office/bookings?${params.toString()}`,
        {
          auth: true,
        }
      );

      setBookings(response.bookings?.data ?? []);

      setCurrentPage(response.bookings?.current_page ?? 1);

      setLastPage(response.bookings?.last_page ?? 1);

      setBookingStats({
        total: response.stats?.total ?? 0,
        confirmed: response.stats?.confirmed ?? 0,
        revenue: response.stats?.revenue ?? 0,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("تعذر تحميل الحجوزات.");
      }

      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings(1);
  }, [dateFrom, dateTo, tripId, status]);

  const trips = Array.from(
    new Map(
      bookings
        .filter((booking) => booking.trip)
        .map((booking) => [booking.trip!.id, booking.trip])
    ).values()
  );

  function handlePageChange(page: number) {
    if (page < 1 || page > lastPage || page === currentPage) {
      return;
    }

    loadBookings(page);
  }

  function handleFilterChange(
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) {
    setter(value);
  }

  const pageNumbers = Array.from(
    { length: Math.min(lastPage, 5) },
    (_, index) => index + 1
  );

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm text-accent">
            لوحة مكتب النقل
          </p>

          <h1 className="text-3xl font-bold">
            إدارة الحجوزات
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            متابعة الحجوزات والركاب وحالة كل حجز
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-bold text-accent-soft transition hover:bg-primary/20"
        >
          تصدير
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-border/10 bg-card p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-xs text-gray-500">
              من تاريخ
            </label>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) =>
                handleFilterChange(
                  setDateFrom,
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-500">
              إلى تاريخ
            </label>

            <input
              type="date"
              value={dateTo}
              onChange={(e) =>
                handleFilterChange(
                  setDateTo,
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-500">
              الرحلة
            </label>

            <select
              value={tripId}
              onChange={(e) =>
                handleFilterChange(
                  setTripId,
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="" className="bg-surface-page">
                جميع الرحلات
              </option>

              {trips.map((trip) => (
                <option
                  key={trip!.id}
                  value={trip!.id}
                  className="bg-surface-page"
                >
                  {trip!.from_governorate} →{" "}
                  {trip!.to_governorate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-500">
              الحالة
            </label>

            <select
              value={status}
              onChange={(e) =>
                handleFilterChange(
                  setStatus,
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="" className="bg-surface-page">
                جميع الحالات
              </option>

              <option
                value="confirmed"
                className="bg-surface-page"
              >
                مؤكد
              </option>

              <option
                value="pending"
                className="bg-surface-page"
              >
                قيد الانتظار
              </option>

              <option
                value="cancelled"
                className="bg-surface-page"
              >
                ملغي
              </option>

              <option
                value="completed"
                className="bg-surface-page"
              >
                مكتمل
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/10 bg-card p-5">
          <p className="text-sm text-gray-500">
            إجمالي الحجوزات
          </p>

          <p className="mt-2 text-2xl font-bold">
            {loading ? "..." : bookingStats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-border/10 bg-card p-5">
          <p className="text-sm text-gray-500">
            الحجوزات المؤكدة
          </p>

          <p className="mt-2 text-2xl font-bold text-green-400">
            {loading ? "..." : bookingStats.confirmed}
          </p>
        </div>

        <div className="rounded-2xl border border-border/10 bg-card p-5">
          <p className="text-sm text-gray-500">
            الإيرادات
          </p>

          <p className="mt-2 text-2xl font-bold text-accent">
            {loading
              ? "..."
              : formatAmount(bookingStats.revenue)}

            <span className="mr-1 text-sm">
              ل.س
            </span>
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="font-bold text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadBookings(currentPage)}
            className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Table */}
      {!error && (
        <div className="overflow-hidden rounded-2xl border border-border/10 bg-card">
          {loading ? (
            <div className="p-10 text-center text-gray-400">
              جاري تحميل الحجوزات...
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              لا توجد حجوزات مطابقة للفلاتر المحددة.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="border-b border-border/10 bg-surface-deeper">
                    <tr className="text-sm text-gray-400">
                      <th className="px-5 py-5 font-medium">
                        رقم الحجز
                      </th>

                      <th className="px-5 py-5 font-medium">
                        الراكب
                      </th>

                      <th className="px-5 py-5 font-medium">
                        الرحلة
                      </th>

                      <th className="px-5 py-5 font-medium">
                        التاريخ
                      </th>

                      <th className="px-5 py-5 font-medium">
                        المقاعد
                      </th>

                      <th className="px-5 py-5 font-medium">
                        المبلغ
                      </th>

                      <th className="px-5 py-5 font-medium">
                        الحالة
                      </th>

                      <th className="px-5 py-5 font-medium">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-border/5 transition hover:bg-foreground/[0.02]"
                      >
                        <td className="px-5 py-5 font-mono text-sm text-accent">
                          {booking.booking_code}
                        </td>

                        <td className="px-5 py-5 text-sm font-medium">
                          {booking.user?.name ||
                            "غير معروف"}
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-300">
                          {booking.trip
                            ? `${booking.trip.from_governorate} → ${booking.trip.to_governorate}`
                            : "غير معروفة"}
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-400">
                          {booking.trip?.departure_date
                            ? formatDate(
                                booking.trip.departure_date
                              )
                            : "-"}
                        </td>

                        <td className="px-5 py-5 text-sm">
                          {booking.seats_count} مقعد
                        </td>

                        <td className="px-5 py-5 text-sm font-bold">
                          {formatAmount(
                            booking.total_amount
                          )}{" "}
                          ل.س
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${getStatusClass(
                              booking.status
                            )}`}
                          >
                            {getStatusLabel(
                              booking.status
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              title="عرض التفاصيل"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-accent transition hover:bg-primary/20"
                            >
                              👁
                            </button>

                            <button
                              type="button"
                              title="المزيد"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/5 text-gray-400 transition hover:bg-foreground/10 hover:text-foreground"
                            >
                              ⋮
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-border/10 p-5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      handlePageChange(
                        currentPage - 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/10 text-gray-500 transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ‹
                  </button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        handlePageChange(page)
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border/10 transition ${
                        page === currentPage
                          ? "bg-primary text-white"
                          : "text-gray-400 hover:bg-foreground/5"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {lastPage > 5 && (
                    <>
                      <span className="px-2 text-gray-600">
                        ...
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handlePageChange(lastPage)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/10 text-gray-400 hover:bg-foreground/5"
                      >
                        {lastPage}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    disabled={
                      currentPage === lastPage
                    }
                    onClick={() =>
                      handlePageChange(
                        currentPage + 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/10 text-gray-500 transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

