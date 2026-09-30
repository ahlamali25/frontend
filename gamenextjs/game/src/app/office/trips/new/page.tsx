"use client";

import { useEffect, useState } from "react";
import { governorates } from "@/lib/constants/governorates";
import { PrimaryButton } from "@/components/ui/Button";
import { getOfficeBuses, OfficeBus } from "@/lib/api/buses";
import { getOfficeDrivers, OfficeDriver } from "@/lib/api/drivers";
import { createTrip } from "@/lib/api/trips";

export default function OfficeDashboard() {
  const [from, setFrom] = useState("دمشق");
  const [to, setTo] = useState("حلب");

  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("08:30");
  const [arrivalTime, setArrivalTime] = useState("12:30");

  const [buses, setBuses] = useState<OfficeBus[]>([]);
  const [drivers, setDrivers] = useState<OfficeDriver[]>([]);

  const [busId, setBusId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [assistantDriverId, setAssistantDriverId] = useState("");

  const [availableSeats, setAvailableSeats] = useState("");
  const [seatPrice, setSeatPrice] = useState("75000");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [busesData, driversData] = await Promise.all([
          getOfficeBuses(),
          getOfficeDrivers(),
        ]);

        setBuses(busesData);
        setDrivers(driversData);

        if (busesData.length > 0) {
          setBusId(String(busesData[0].id));
          setAvailableSeats(String(busesData[0].capacity));
        }

        if (driversData.length > 0) {
          setDriverId(String(driversData[0].id));

          if (driversData.length > 1) {
            setAssistantDriverId(String(driversData[1].id));
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل بيانات المكتب."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const selectedBus = buses.find(
    (bus) => String(bus.id) === busId
  );

  function handleBusChange(value: string) {
    setBusId(value);

    const bus = buses.find(
      (item) => String(item.id) === value
    );

    if (bus) {
      setAvailableSeats(String(bus.capacity));
    }
  }

  async function handleSubmit() {
    setError("");
    setSuccess("");

    if (!busId || !driverId || !assistantDriverId) {
      setError("يرجى اختيار المركبة والسائق الأساسي والسائق المساعد.");
      return;
    }

    if (driverId === assistantDriverId) {
      setError("يجب أن يكون السائق المساعد مختلفًا عن السائق الأساسي.");
      return;
    }

    if (!departureDate) {
      setError("يرجى اختيار تاريخ الرحلة.");
      return;
    }

    if (!availableSeats || Number(availableSeats) < 1) {
      setError("يرجى إدخال عدد المقاعد.");
      return;
    }

    if (!seatPrice || Number(seatPrice) < 0) {
      setError("يرجى إدخال سعر المقعد.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createTrip({
        bus_id: Number(busId),
        driver_id: Number(driverId),
        assistant_driver_id: Number(assistantDriverId),
        from_governorate: from,
        to_governorate: to,
        departure_date: departureDate,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        is_recurring: false,
        recurring_days: null,
        seat_price: Number(seatPrice),
        vip_seat_price: null,
        booking_closes_minutes_before: 60,
        available_seats: Number(availableSeats),
      });

      setSuccess(
        response.message || "تم إنشاء الرحلة بنجاح."
      );

      setTimeout(() => {
        window.location.href = "/office/trips";
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء إنشاء الرحلة."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-8">
        <p className="mb-2 text-sm text-accent">
          لوحة مكتب النقل
        </p>

        <h1 className="text-3xl font-bold">
          إضافة رحلة جديدة
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          أضف رحلة جديدة ليتمكن الركاب من حجز المقاعد
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-border/10 bg-card p-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-primary/20 px-4 py-3 text-center text-sm text-accent-soft">
            1 معلومات الرحلة
          </div>

          <div className="rounded-xl bg-card-secondary px-4 py-3 text-center text-sm text-gray-500">
            2 تفاصيل الرحلة
          </div>

          <div className="rounded-xl bg-card-secondary px-4 py-3 text-center text-sm text-gray-500">
            3 المقاعد والسعر
          </div>

          <div className="rounded-xl bg-card-secondary px-4 py-3 text-center text-sm text-gray-500">
            4 تأكيد
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/10 bg-card p-7 lg:col-span-2">
          <h2 className="mb-6 text-xl font-bold">
            معلومات الرحلة
          </h2>

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              جارٍ تحميل المركبات والسائقين...
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    من
                  </label>

                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-foreground outline-none focus:border-primary"
                  >
                    {governorates.map((g) => (
                      <option
                        key={g}
                        value={g}
                        className="bg-surface-page"
                      >
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    إلى
                  </label>

                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-foreground outline-none focus:border-primary"
                  >
                    {governorates.map((g) => (
                      <option
                        key={g}
                        value={g}
                        className="bg-surface-page"
                      >
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    تاريخ الرحلة
                  </label>

                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) =>
                      setDepartureDate(e.target.value)
                    }
                    className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    وقت الانطلاق
                  </label>

                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) =>
                      setDepartureTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    وقت الوصول المتوقع
                  </label>

                  <input
                    type="time"
                    value={arrivalTime}
                    onChange={(e) =>
                      setArrivalTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    المركبة
                  </label>

                  <select
                    value={busId}
                    onChange={(e) =>
                      handleBusChange(e.target.value)
                    }
                    disabled={buses.length === 0}
                    className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {buses.length === 0 ? (
                      <option className="bg-surface-page">
                        لا توجد مركبات
                      </option>
                    ) : (
                      buses.map((bus) => (
                        <option
                          key={bus.id}
                          value={bus.id}
                          className="bg-surface-page"
                        >
                          {bus.name} - {bus.plate_number}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    السائق الأساسي
                  </label>

                  <select
                    value={driverId}
                    onChange={(e) =>
                      setDriverId(e.target.value)
                    }
                    disabled={drivers.length === 0}
                    className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {drivers.length === 0 ? (
                      <option className="bg-surface-page">
                        لا يوجد سائقون
                      </option>
                    ) : (
                      drivers.map((driver) => (
                        <option
                          key={driver.id}
                          value={driver.id}
                          className="bg-surface-page"
                        >
                          {driver.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    السائق المساعد
                  </label>

                  <select
                    value={assistantDriverId}
                    onChange={(e) =>
                      setAssistantDriverId(e.target.value)
                    }
                    disabled={drivers.length < 2}
                    className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {drivers.length < 2 ? (
                      <option className="bg-surface-page">
                        يلزم وجود سائقين على الأقل
                      </option>
                    ) : (
                      drivers.map((driver) => (
                        <option
                          key={driver.id}
                          value={driver.id}
                          className="bg-surface-page"
                        >
                          {driver.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    عدد المقاعد
                  </label>

                  <input
                    type="number"
                    min="1"
                    max={selectedBus?.capacity}
                    value={availableSeats}
                    onChange={(e) =>
                      setAvailableSeats(e.target.value)
                    }
                    className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-foreground outline-none focus:border-primary"
                  />

                  {selectedBus && (
                    <p className="mt-2 text-xs text-gray-500">
                      سعة المركبة: {selectedBus.capacity} مقعد
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm text-gray-400">
                  سعر المقعد
                </label>

                <input
                  type="number"
                  min="0"
                  value={seatPrice}
                  onChange={(e) =>
                    setSeatPrice(e.target.value)
                  }
                  className="w-full rounded-xl border border-border/10 bg-surface-page px-4 py-3 text-foreground outline-none focus:border-primary"
                />

                <p className="mt-2 text-xs text-gray-500">
                  السعر بالليرة السورية
                </p>
              </div>

              <PrimaryButton
                className="mt-7 w-full"
                onClick={handleSubmit}
                disabled={submitting || loading}
              >
                {submitting ? "جارٍ إنشاء الرحلة..." : "إضافة الرحلة"}
              </PrimaryButton>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-border/10 bg-card p-6">
          <h2 className="mb-5 text-lg font-bold">
            معاينة الرحلة
          </h2>

          <div className="overflow-hidden rounded-xl border border-border/10 bg-card-secondary">
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-media-placeholder to-card-secondary text-7xl">
              🚌
            </div>

            <div className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    من
                  </p>

                  <p className="mt-1 font-bold">
                    {from}
                  </p>
                </div>

                <div className="text-primary">
                  ←
                </div>

                <div className="text-left">
                  <p className="text-xs text-gray-500">
                    إلى
                  </p>

                  <p className="mt-1 font-bold">
                    {to}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-border/10 pt-5">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    المركبة
                  </span>

                  <span className="text-sm">
                    {selectedBus?.name || "—"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    المقاعد
                  </span>

                  <span className="text-sm">
                    {availableSeats || "—"} مقعد
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    السائق
                  </span>

                  <span className="text-sm">
                    {drivers.find(
                      (driver) =>
                        String(driver.id) === driverId
                    )?.name || "—"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    السعر
                  </span>

                  <span className="font-bold text-accent">
                    {Number(seatPrice || 0).toLocaleString(
                      "ar-SY"
                    )}{" "}
                    ل.س
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}