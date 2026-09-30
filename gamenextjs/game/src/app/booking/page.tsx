"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowRight, FaBus, FaMobileAlt } from "react-icons/fa";

import { getTrip, TripDetails } from "@/lib/api/trips";
import {
  createBooking,
  createPayment,
} from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { BookingSummary } from "@/types/booking";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tripIdParam = searchParams.get("tripId");
  const seatsParam = searchParams.get("seats");

  const tripId = Number(tripIdParam);

  const selectedSeats = seatsParam
    ? seatsParam
        .split(",")
        .map((seat) => seat.trim())
        .filter(Boolean)
    : [];

  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [senderAccount, setSenderAccount] = useState("");

  useEffect(() => {
    if (!tripId || Number.isNaN(tripId)) {
      setError("الرحلة المحددة غير صحيحة.");
      setLoading(false);
      return;
    }

    async function loadTrip() {
      try {
        setLoading(true);
        setError(null);

        const data = await getTrip(tripId);
        setTrip(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("تعذر تحميل بيانات الرحلة.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [tripId]);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--special-page)" }}
      >
        <ThemeToggle className="fixed left-4 top-4 z-50" compact />
        <div className="text-white text-lg">
          جارٍ تحميل بيانات الحجز...
        </div>
      </main>
    );
  }

  if (error && !trip) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "var(--special-page)" }}
      >
        <ThemeToggle className="fixed left-4 top-4 z-50" compact />
        <div
          className="w-full max-w-xl rounded-2xl border px-6 py-5 text-center"
          style={{
            backgroundColor: "var(--special-field)",
            borderColor: "var(--special-border)",
            color: "var(--special-danger)",
          }}
        >
          {error}
        </div>
      </main>
    );
  }

  if (!trip) {
    return null;
  }

  const ticketPrice = Number(trip.seat_price ?? 0);
  const totalPrice = selectedSeats.length * ticketPrice;

  const booking: BookingSummary = {
    from: trip.from_governorate,
    to: trip.to_governorate,
    date: trip.departure_date,
    time: trip.departure_time,
    office: trip.office.name,
    seats: selectedSeats,
    passenger: "المستخدم الحالي",
    ticketPrice: totalPrice,
  };

  async function handleBooking() {
  if (!trip || selectedSeats.length === 0) return;

  if (!senderAccount.trim()) {
    setError("يرجى إدخال حساب Sham Cash الخاص بك.");
    return;
  }

  setError(null);
  setIsSubmitting(true);

  try {
    const bookingResponse = await createBooking({
      trip_id: trip.id,
      seat_numbers: selectedSeats,
    });

    const bookingId = bookingResponse.booking.id;

    await createPayment(bookingId, {
      sender_account: senderAccount.trim(),
    });

    router.push("account/trips");
  } catch (err) {
    if (err instanceof ApiError) {
      setError(err.message);
    } else {
      setError("تعذر إتمام الحجز والدفع، حاول مرة أخرى.");
    }
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <main
      dir="rtl"
      className="min-h-screen px-4 py-8 md:px-8"
      style={{
        backgroundColor: "var(--special-page)",
        backgroundImage: "var(--special-glow)",
      }}
    >
      <ThemeToggle className="fixed left-4 top-4 z-50" compact />
      <div className="mx-auto w-full max-w-[1180px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm transition hover:opacity-80"
          style={{ color: "var(--special-accent)" }}
        >
          <FaArrowRight />
          العودة
        </button>

        <div
          className="overflow-hidden rounded-[28px] border"
          style={{
            borderColor: "var(--special-border-accent)",
            backgroundColor: "var(--special-panel)",
            boxShadow: "var(--special-panel-shadow)",
          }}
        >
          <div className="p-6 md:p-10">
            <div className="mb-8 flex items-center gap-3">
              <FaBus
                className="text-3xl"
                style={{ color: "var(--special-accent-strong)" }}
              />

              <h1 className="text-2xl font-bold text-white md:text-3xl">
                تأكيد الحجز
              </h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* تفاصيل الرحلة */}
              <section
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: "var(--special-section)",
                  borderColor: "var(--special-border-soft)",
                }}
              >
                <h2 className="mb-5 text-xl font-bold text-white">
                  تفاصيل الرحلة
                </h2>

                <div className="space-y-4">
                  <InfoRow
                    label="من"
                    value={booking.from}
                  />

                  <InfoRow
                    label="إلى"
                    value={booking.to}
                  />

                  <InfoRow
                    label="التاريخ"
                    value={booking.date}
                  />

                  <InfoRow
                    label="وقت الانطلاق"
                    value={booking.time}
                  />

                  <InfoRow
                    label="المكتب"
                    value={booking.office}
                  />

                  <InfoRow
                    label="المقاعد"
                    value={
                      booking.seats.length > 0
                        ? booking.seats.join("، ")
                        : "لم يتم اختيار مقاعد"
                    }
                  />

                  <InfoRow
                    label="المسافر"
                    value={booking.passenger}
                  />
                </div>
              </section>

              {/* الدفع */}
              <section
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: "var(--special-section)",
                  borderColor: "var(--special-border-soft)",
                }}
              >
                <h2 className="mb-5 text-xl font-bold text-white">
                  الدفع
                </h2>

                <div
                  className="mb-5 rounded-2xl border p-5"
                  style={{
                    backgroundColor: "var(--special-payment)",
                    borderColor: "var(--special-border-soft)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <FaMobileAlt
                      className="text-2xl"
                      style={{ color: "var(--special-accent)" }}
                    />

                    <div>
                      <div className="font-bold text-white">
                        Sham Cash
                      </div>

                      <div
                        className="mt-1 text-sm"
                        style={{ color: "var(--special-text)" }}
                      >
                        قم بتحويل قيمة الحجز إلى حساب المكتب
                      </div>
                    </div>
                  </div>

                  {/* حساب المكتب */}
                  <div className="mt-5">
                    <div
                      className="mb-2 text-sm"
                      style={{ color: "var(--special-text)" }}
                    >
                      حساب المكتب
                    </div>

                    <div
                      className="rounded-xl border px-4 py-4 text-lg font-bold"
                      style={{
                        backgroundColor: "var(--special-field)",
                        borderColor: "var(--special-border)",
                        color: "var(--foreground)",
                      }}
                    >
                      {trip.office.phone}
                    </div>
                  </div>

                  {/* حساب المستخدم */}
                  <div className="mt-5">
                    <div
                      className="mb-2 text-sm"
                      style={{ color: "var(--special-text)" }}
                    >
                      حساب Sham Cash الخاص بك
                    </div>

                    <input
                      type="text"
                      value={senderAccount}
                      onChange={(e) =>
                        setSenderAccount(e.target.value)
                      }
                      placeholder="أدخل رقم حسابك في Sham Cash"
                      className="w-full rounded-xl border px-4 py-4 text-right outline-none transition focus:ring-1"
                      style={{
                        backgroundColor: "var(--special-field)",
                        borderColor: "var(--special-border)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>
                </div>

                {/* ملخص المبلغ */}
                <div
                  className="mb-5 rounded-2xl border p-5"
                  style={{
                    backgroundColor: "var(--special-summary)",
                    borderColor: "var(--special-border-faint)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--special-text)" }}>
                      عدد المقاعد
                    </span>

                    <span className="font-bold text-white">
                      {selectedSeats.length}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span style={{ color: "var(--special-text)" }}>
                      سعر التذكرة
                    </span>

                    <span className="font-bold text-white">
                      {ticketPrice.toLocaleString("ar-SY")} ل.س
                    </span>
                  </div>

                  <div
                    className="my-4 h-px"
                    style={{
                      backgroundColor: "var(--special-rule-soft)",
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      المبلغ الإجمالي
                    </span>

                    <span
                      className="text-xl font-bold"
                      style={{ color: "var(--special-accent)" }}
                    >
                      {totalPrice.toLocaleString("ar-SY")} ل.س
                    </span>
                  </div>
                </div>

                {/* رسالة الخطأ */}
                {error && (
                  <div
                    className="mb-4 rounded-xl border px-4 py-3 text-sm"
                    style={{
                      color: "var(--special-danger)",
                      backgroundColor: "var(--special-error-bg)",
                      borderColor: "var(--special-error-border)",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* زر التأكيد */}
                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={
                    isSubmitting ||
                    selectedSeats.length === 0
                  }
                  className="theme-on-primary w-full rounded-xl py-4 text-lg font-bold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background: "var(--special-accent-gradient)",
                    boxShadow: "var(--special-accent-shadow)",
                  }}
                >
                  {isSubmitting
                    ? "جارٍ إنشاء الحجز..."
                    : "تأكيد الدفع والحجز"}
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className="text-sm"
        style={{ color: "var(--special-text)" }}
      >
        {label}
      </span>

      <span className="text-right font-bold text-white">
        {value}
      </span>
    </div>
  );
}