"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowRight,
  FaBus,
  FaCalendarAlt,
  FaChair,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
  FaTicketAlt,
} from "react-icons/fa";

import { getBooking } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils/format";

interface TicketBooking {
  id: number;
  booking_code: string;
  seats_count: number;
  total_amount: number;
  status: string;

  trip: {
    id: number;
    from_governorate: string;
    to_governorate: string;
    departure_date: string;
    departure_time: string;
    arrival_time: string;

    office: {
      id: number;
      name: string;
    };

    bus: {
      id: number;
      name: string;
      type: string;
    };
  };

  seats?: {
    id: number;
    seat_number: string;
    status: string;
  }[];

  payment?: {
    id: number;
    payment_method: string;
    amount: number;
    transaction_reference: string;
    status: string;
    paid_at: string;
  } | null;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ar-SY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getStatusLabel(status: string) {
  switch (status) {
    case "confirmed":
      return "مؤكدة";
    case "pending":
      return "قيد الانتظار";
    case "cancelled":
      return "ملغاة";
    default:
      return status;
  }
}

function getPaymentStatusLabel(status?: string) {
  switch (status) {
    case "completed":
      return "تم الدفع";
    case "pending":
      return "قيد الانتظار";
    case "failed":
      return "فشل الدفع";
    default:
      return status || "غير متوفر";
  }
}

export default function BookingTicketPage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = Number(params.bookingId);

  const [booking, setBooking] = useState<TicketBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId || Number.isNaN(bookingId)) {
      setError("رقم الحجز غير صحيح");
      setLoading(false);
      return;
    }

    async function loadBooking() {
      try {
        setLoading(true);
        setError("");

        const data = await getBooking(bookingId);

        setBooking(data as TicketBooking);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("حدث خطأ أثناء تحميل التذكرة");
        }
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-border/10 bg-card p-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-accent" />
          <p className="text-gray-400">جارٍ تحميل التذكرة...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-red-500/20 bg-card p-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <FaTicketAlt />
          </div>

          <h1 className="text-xl font-bold">تعذر تحميل التذكرة</h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "لم يتم العثور على بيانات الحجز"}
          </p>

          <button
            onClick={() => router.push("/account/trips")}
            className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            العودة إلى رحلاتي
          </button>
        </div>
      </div>
    );
  }

  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="mx-auto max-w-4xl pb-10">
      {/* Back */}
      <button
        onClick={() => router.push("/account/trips")}
        className="mb-5 flex items-center gap-2 text-sm text-gray-400 transition hover:text-foreground"
      >
        <FaArrowRight className="text-xs" />
        العودة إلى رحلاتي
      </button>

      {/* Page title */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-accent">
          <FaTicketAlt />
        </div>

        <div>
          <h1 className="text-2xl font-bold">تذكرة السفر</h1>
          <p className="mt-1 text-sm text-gray-500">
            تفاصيل رحلتك والحجز
          </p>
        </div>
      </div>

      {/* Ticket */}
      <div className="overflow-hidden rounded-3xl border border-border/10 bg-card shadow-2xl shadow-black/20">
        {/* Ticket Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-deep px-6 py-7 sm:px-8">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-foreground/5" />
          <div className="absolute -left-20 bottom-[-100px] h-56 w-56 rounded-full bg-overlay/10" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-foreground/70">
                <FaBus />
                <span>{booking.trip.office.name}</span>
              </div>

              <h2 className="text-xl font-black text-white">
                تذكرة سفر
              </h2>

              <p className="mt-1 text-sm text-foreground/60">
                حجز رقم #{booking.booking_code}
              </p>
            </div>

            <div
              className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
                isConfirmed
                  ? "bg-emerald-400/15 text-emerald-200"
                  : "bg-foreground/10 text-foreground/80"
              }`}
            >
              <FaCheckCircle className="text-xs" />
              {getStatusLabel(booking.status)}
            </div>
          </div>
        </div>

        {/* Main route section */}
        <div className="px-6 py-7 sm:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* From */}
            <div>
              <p className="text-3xl font-black tracking-tight text-foreground">
                {booking.trip.departure_time}
              </p>

              <p className="mt-2 text-sm font-bold text-gray-300">
                {booking.trip.from_governorate}
              </p>

              <p className="mt-1 text-xs text-gray-500">محطة الانطلاق</p>
            </div>

            {/* Route line */}
            <div className="flex min-w-[80px] flex-col items-center">
              <div className="flex w-full items-center">
                <div className="h-2.5 w-2.5 rounded-full border-2 border-accent bg-card" />

                <div className="relative mx-2 h-px flex-1 border-t border-dashed border-route-line">
                  <FaBus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card px-1 text-sm text-accent" />
                </div>

                <div className="h-2.5 w-2.5 rounded-full bg-accent" />
              </div>

              <span className="mt-3 text-[10px] text-gray-600">
                رحلة مباشرة
              </span>
            </div>

            {/* To */}
            <div className="text-left">
              <p className="text-3xl font-black tracking-tight text-white">
                {booking.trip.arrival_time}
              </p>

              <p className="mt-2 text-sm font-bold text-gray-300">
                {booking.trip.to_governorate}
              </p>

              <p className="mt-1 text-xs text-gray-500">محطة الوصول</p>
            </div>
          </div>

          {/* Date */}
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-border/5 bg-card-secondary px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-accent">
              <FaCalendarAlt />
            </div>

            <div>
              <p className="text-xs text-gray-500">تاريخ الرحلة</p>
              <p className="mt-1 text-sm font-bold text-foreground">
                {formatDate(booking.trip.departure_date)}
              </p>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="relative my-8 border-t border-dashed border-border/10">
            <span className="absolute -right-9 -top-3 h-6 w-6 rounded-full bg-card-secondary" />
            <span className="absolute -left-9 -top-3 h-6 w-6 rounded-full bg-card-secondary" />
          </div>

          {/* Details grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Bus */}
            <div className="rounded-2xl border border-border/5 bg-card-secondary p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-accent">
                  <FaBus />
                </div>

                <div>
                  <p className="text-xs text-gray-500">الباص</p>
                  <p className="mt-1 font-bold text-foreground">
                    {booking.trip.bus.name || booking.trip.bus.type}
                  </p>
                </div>
              </div>
            </div>

            {/* Seats */}
            <div className="rounded-2xl border border-border/5 bg-card-secondary p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-accent">
                  <FaChair />
                </div>

                <div>
                  <p className="text-xs text-gray-500">المقاعد</p>

                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {booking.seats && booking.seats.length > 0 ? (
                      booking.seats.map((seat) => (
                        <span
                          key={seat.id}
                          className="rounded-md bg-primary/20 px-2 py-1 text-xs font-bold text-accent-muted"
                        >
                          {seat.seat_number}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm font-bold text-foreground">
                        {booking.seats_count} مقعد
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Departure */}
            <div className="rounded-2xl border border-border/5 bg-card-secondary p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-accent">
                  <FaClock />
                </div>

                <div>
                  <p className="text-xs text-gray-500">موعد الانطلاق</p>
                  <p className="mt-1 font-bold text-foreground">
                    {booking.trip.departure_time}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking */}
            <div className="rounded-2xl border border-border/5 bg-card-secondary p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-accent">
                  <FaTicketAlt />
                </div>

                <div>
                  <p className="text-xs text-gray-500">عدد المقاعد</p>
                  <p className="mt-1 font-bold text-foreground">
                    {booking.seats_count}{" "}
                    {booking.seats_count === 1 ? "مقعد" : "مقاعد"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking code */}
          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
            <p className="text-xs text-gray-500">رقم الحجز</p>

            <p className="mt-2 font-mono text-2xl font-black tracking-[0.18em] text-accent-muted">
              {booking.booking_code}
            </p>

            <p className="mt-2 text-[11px] text-gray-600">
              احتفظ بهذا الرقم للرجوع إلى حجزك
            </p>
          </div>
        </div>

        {/* Payment */}
        <div className="border-t border-border/5 bg-surface-deep px-6 py-6 sm:px-8">
          <div className="mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-accent" />
            <h3 className="font-bold">تفاصيل الدفع</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">طريقة الدفع</span>
              <span className="font-medium text-foreground">
                شام كاش
              </span>
            </div>

            {booking.payment?.transaction_reference && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">رقم العملية</span>

                <span className="font-mono text-xs text-gray-300">
                  {booking.payment.transaction_reference}
                </span>
              </div>
            )}

            {booking.payment?.status && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">حالة الدفع</span>

                <span className="font-medium text-emerald-400">
                  {getPaymentStatusLabel(booking.payment.status)}
                </span>
              </div>
            )}

            <div className="my-4 border-t border-border/5" />

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500">إجمالي الحجز</p>
                <p className="mt-1 text-sm text-gray-400">
                  {booking.seats_count} مقاعد
                </p>
              </div>

              <div className="text-left">
                <p className="text-2xl font-black text-accent">
                  {formatPrice(Number(booking.total_amount))}
                </p>

                <p className="mt-1 text-xs text-gray-500">ل.س</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-5 rounded-2xl border border-border/5 bg-card px-5 py-4 text-center">
        <p className="text-xs leading-6 text-gray-500">
          يرجى الحضور إلى محطة الانطلاق قبل موعد الرحلة بوقت كافٍ،
          وإبراز رقم الحجز عند الحاجة.
        </p>
      </div>
    </div>
  );
}