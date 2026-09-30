"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserBookings, UserBooking } from "@/lib/api/bookings";
import { formatPrice } from "@/lib/utils/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PassengerTripStatus } from "@/types/passengerTrip";
import { ApiError } from "@/lib/api/client";

const tabs: (PassengerTripStatus | "الكل")[] = [
  "الكل",
  "قادمة",
  "منتهية", 
  "ملغاة",
];

function getTripStatus(booking: UserBooking): PassengerTripStatus {
  if (booking.status === "cancelled") {
    return "ملغاة";
  }

  const departureDateTime = new Date(
    `${booking.trip.departure_date}T${booking.trip.departure_time}`
  );

  if (departureDateTime.getTime() < Date.now()) {
    return "منتهية";
  }

  return "قادمة";
}

function formatDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  return new Intl.DateTimeFormat("ar-SY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export default function PassengerTripsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("الكل");

  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError(null);

        const data = await getUserBookings();
        setBookings(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("تعذر تحميل رحلاتك، حاول مرة أخرى.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  const trips = bookings.map((booking) => ({
    booking,
    status: getTripStatus(booking),
  }));

  const filteredTrips =
    activeTab === "الكل"
      ? trips
      : trips.filter((trip) => trip.status === activeTab);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">رحلاتي</h1>

        <div className="flex gap-1 rounded-xl bg-card p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-border/10 bg-card p-10 text-center text-gray-400">
          جارٍ تحميل رحلاتك...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-card p-10 text-center text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {filteredTrips.map(({ booking, status }) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-border/10 bg-card p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <StatusBadge status={status} />

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-card-secondary text-lg">
                    🚌
                  </div>

                  <div>
                    <h3 className="font-bold">
                      {booking.trip.office.name}
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-500">
                      باص {booking.trip.bus.name || booking.trip.bus.type}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-sm text-gray-500">
                  {booking.booking_code}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-border/5 pt-4">
                <div>
                  <p className="text-lg font-bold">
                    {booking.trip.departure_time}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {booking.trip.from_governorate}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    {formatDate(booking.trip.departure_date)}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {booking.seats_count}{" "}
                    {booking.seats_count === 1 ? "مقعد" : "مقاعد"}
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-lg font-bold">
                    {booking.trip.arrival_time}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {booking.trip.to_governorate}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/5 pt-4">
                <span className="text-lg font-black text-accent">
                  {formatPrice(Number(booking.total_amount))} ل.س
                </span>

               <button
  onClick={() => {
    if (status === "قادمة") {
      router.push(`/account/trips/${booking.id}`);
    }
  }}
  className="rounded-lg bg-primary/15 px-4 py-2 text-sm font-bold text-accent transition hover:bg-primary/25"
>
  {status === "قادمة" ? "عرض التذكرة" : "التقييم"}
</button>
              </div>
            </div>
          ))}

          {filteredTrips.length === 0 && (
            <div className="rounded-2xl border border-border/10 bg-card p-10 text-center text-gray-400">
              لا توجد رحلات بهذه الحالة
            </div>
          )}
        </div>
      )}
    </div>
  );
}