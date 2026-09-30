"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaBus } from "react-icons/fa";
import {
  getTrip,
  getTripSeats,
  TripDetails,
  TripSeat,
} from "@/lib/api/trips";
import { formatPrice } from "@/lib/utils/format";
import { PrimaryButton } from "@/components/ui/Button";

type SeatStatus = "available" | "booked" | "selected";

interface SeatView {
  id: number;
  seatNumber: string;
  status: SeatStatus;
}

export default function SeatMapView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tripId = Number(searchParams.get("tripId"));

  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [seats, setSeats] = useState<SeatView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) {
      setError("رقم الرحلة غير صالح.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    Promise.all([
      getTrip(tripId),
      getTripSeats(tripId),
    ])
      .then(([tripData, seatsData]) => {
        setTrip(tripData);

        const mappedSeats: SeatView[] = seatsData.map(
          (seat: TripSeat) => ({
            id: seat.id,
            seatNumber: seat.seat_number,
            status:
              seat.status === "booked"
                ? "booked"
                : "available",
          })
        );

        setSeats(mappedSeats);
      })
      .catch(() => {
        setError("تعذر تحميل بيانات الرحلة والمقاعد.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [tripId]);

  const selectedSeats = useMemo(
    () =>
      seats.filter(
        (seat) => seat.status === "selected"
      ),
    [seats]
  );

  const totalPrice =
    selectedSeats.length *
    Number(trip?.seat_price ?? 0);

  function toggleSeat(id: number) {
    setSeats((prev) =>
      prev.map((seat) => {
        if (
          seat.id !== id ||
          seat.status === "booked"
        ) {
          return seat;
        }

        return {
          ...seat,
          status:
            seat.status === "selected"
              ? "available"
              : "selected",
        };
      })
    );
  }

  function seatButtonClass(status: SeatStatus) {
    if (status === "booked") {
      return "bg-red-500/80 text-white cursor-not-allowed";
    }

    if (status === "selected") {
      return "bg-primary text-white";
    }

    return "bg-seat text-gray-300 hover:bg-seat-hover";
  }

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-400">
        جارٍ تحميل بيانات الرحلة والمقاعد...
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="p-10 text-center text-red-400">
        {error ?? "تعذر تحميل الرحلة."}
      </div>
    );
  }

  const tripNumber = `TRP-${String(trip.id).padStart(5, "0")}`;

  /*
   * ترتيب المقاعد رقميًا.
   *
   * لأن Laravel قد يرجع:
   *
   * 10A
   * 11A
   * 12A
   * ...
   * 1A
   * 2A
   *
   * لذلك نرتبها حسب رقم المقعد.
   */
  const sortedSeats = [...seats].sort((a, b) => {
    const numberA = parseInt(a.seatNumber, 10);
    const numberB = parseInt(b.seatNumber, 10);

    return numberA - numberB;
  });

  /*
   * الباص 2 + 2
   *
   * كل صف يحتوي على 4 مقاعد:
   *
   * [ 1 ] [ 2 ]    [ 3 ] [ 4 ]
   *
   * [ 5 ] [ 6 ]    [ 7 ] [ 8 ]
   *
   * وهكذا...
   */
  const seatRows: SeatView[][] = [];

  for (let i = 0; i < sortedSeats.length; i += 4) {
    seatRows.push(sortedSeats.slice(i, i + 4));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* =========================
          العنوان
      ========================= */}
      <h1 className="mb-2 text-center text-2xl font-bold">
        اختيار المقاعد
      </h1>

      <p className="mb-8 text-center text-lg text-gray-300">
        {trip.office.name} — من{" "}
        {trip.from_governorate} إلى{" "}
        {trip.to_governorate}
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* =========================
            ملخص الرحلة
        ========================= */}
        <div className="order-2 rounded-2xl border border-border/10 bg-card p-7 lg:order-1">
          <h2 className="mb-5 text-lg font-bold text-accent">
            ملخص الرحلة
          </h2>

          <div className="space-y-3 border-b border-border/10 pb-5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">
                أسلوب النقل
              </span>

              <span className="font-bold">
                {trip.bus.type}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                الساعة
              </span>

              <span className="font-bold">
                {trip.departure_time}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                رقم الرحلة
              </span>

              <span className="font-bold">
                {tripNumber}
              </span>
            </div>
          </div>

          <h2 className="mb-4 mt-6 text-lg font-bold text-accent">
            تفاصيل الدفع
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">
                سعر التذكرة
              </span>

              <span className="font-bold">
                {formatPrice(
                  Number(trip.seat_price)
                )}{" "}
                ل.س
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                عدد المقاعد
              </span>

              <span className="font-bold">
                {selectedSeats.length}
              </span>
            </div>

            <div className="flex justify-between border-t border-border/10 pt-3">
              <span className="text-gray-400">
                المجموع الكلي
              </span>

              <span className="text-lg font-black text-accent">
                {formatPrice(totalPrice)} ل.س
              </span>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-bold text-accent">
                المقاعد المختارة
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() =>
                      toggleSeat(seat.id)
                    }
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-primary-hover"
                  >
                    {seat.seatNumber} ✕
                  </button>
                ))}
              </div>
            </div>
          )}

       <PrimaryButton
  className="mt-7 w-full"
  disabled={selectedSeats.length === 0}
  onClick={() => {
    const seatNumbers = selectedSeats
      .map((seat) => seat.seatNumber)
      .join(",");

    router.push(
      `/booking?tripId=${trip.id}&seats=${encodeURIComponent(
        seatNumbers
      )}`
    );
  }}
>
  متابعة الحجز
</PrimaryButton>
        </div>

        {/* =========================
            خريطة المقاعد
        ========================= */}
        <div className="order-1 rounded-2xl border border-border/10 bg-card p-7 lg:order-2">
          <div className="mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <FaBus />

              {trip.office.name} — {trip.bus.type} —{" "}
              {trip.bus.capacity} مقعد
            </span>

            <span className="text-lg font-bold text-accent">
              {trip.to_governorate} ←{" "}
              {trip.from_governorate}
            </span>
          </div>

          {/* دليل الألوان */}
          <div className="mb-6 flex items-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-seat" />
              متاح
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-red-500/80" />
              محجوز
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-primary" />
              مختار
            </div>
          </div>

          {/* =========================
              المقاعد 2 + 2
          ========================= */}
          <div className="space-y-3">
            {seatRows.map((row, rowIndex) => {
              const rightSeats = row.slice(0, 2);
              const leftSeats = row.slice(2, 4);

              return (
                <div
                  key={rowIndex}
                  className="flex items-center justify-center gap-8"
                >
                  {/* المقعدان في الجهة الأولى */}
                  <div className="grid grid-cols-2 gap-3">
                    {rightSeats.map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() =>
                          toggleSeat(seat.id)
                        }
                        disabled={
                          seat.status === "booked"
                        }
                        className={`h-12 w-16 rounded-lg text-sm font-bold transition ${seatButtonClass(
                          seat.status
                        )}`}
                      >
                        {seat.seatNumber}
                      </button>
                    ))}
                  </div>

                  {/* المقعدان في الجهة الثانية */}
                  <div className="grid grid-cols-2 gap-3">
                    {leftSeats.map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() =>
                          toggleSeat(seat.id)
                        }
                        disabled={
                          seat.status === "booked"
                        }
                        className={`h-12 w-16 rounded-lg text-sm font-bold transition ${seatButtonClass(
                          seat.status
                        )}`}
                      >
                        {seat.seatNumber}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}