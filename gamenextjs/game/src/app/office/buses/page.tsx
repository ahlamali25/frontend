"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api/client";
import { StatCard } from "@/components/ui/StatCard";
import { InfoRow } from "@/components/ui/InfoRow";

type Bus = {
  id: number;
  name: string;
  model?: string;
  type?: string;
  plate_number?: string;
  capacity: number;
  year?: number;
  status: string;
  driver_id?: number | null;

  driver?: {
    id: number;
    name: string;
  } | null;
};

type BusesResponse = Bus[];

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    available: "متاح",
    in_trip: "في رحلة",
    maintenance: "في الصيانة",
    unavailable: "غير متاح",
  };

  return labels[status] ?? status;
}

function getStatusClass(status: string) {
  switch (status) {
    case "available":
      return "bg-emerald-500/15 text-emerald-400";

    case "in_trip":
      return "bg-primary/20 text-accent";

    case "maintenance":
      return "bg-orange-500/15 text-orange-400";

    default:
      return "bg-gray-500/15 text-gray-400";
  }
}

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBuses() {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch<BusesResponse>("/buses", {
        auth: true,
      });

      setBuses(response);
    } catch (err) {
      console.error(err);

      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError(
            "انتهت جلسة تسجيل الدخول، يرجى تسجيل الدخول مرة أخرى."
          );
        } else {
          setError(err.message);
        }
      } else {
        setError("حدث خطأ أثناء تحميل المركبات.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBuses();
  }, []);

  const totalBuses = buses.length;

const availableBuses = buses.filter(
  (bus) => bus.status === "available" || bus.status === "متاح"
).length;

const inTripBuses = buses.filter(
  (bus) => bus.status === "in_trip" || bus.status === "في رحلة"
).length;

const maintenanceBuses = buses.filter(
  (bus) => bus.status === "maintenance" || bus.status === "في الصيانة"
).length;

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm text-accent">مكتب النقل</p>

          <h1 className="text-4xl font-black">المركبات</h1>

          <p className="mt-2 text-sm text-gray-400">
            إدارة مركبات وأساطيل مكتب النقل
          </p>
        </div>

        <Link
          href="/office/buses/new"
          className="rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-[#4f3ad6]/20 transition hover:bg-primary-hover"
        >
          + إضافة مركبة جديدة
        </Link>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid gap-5 md:grid-cols-4">
        <StatCard
          title="إجمالي المركبات"
          value={totalBuses.toLocaleString("ar-SY")}
        />

        <StatCard
          title="متاحة"
          value={availableBuses.toLocaleString("ar-SY")}
          variant="green"
        />

        <StatCard
          title="في رحلة"
          value={inTripBuses.toLocaleString("ar-SY")}
          variant="purple"
        />

        <StatCard
          title="في الصيانة"
          value={maintenanceBuses.toLocaleString("ar-SY")}
          variant="red"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-primary/20 bg-card p-10 text-center text-gray-400">
          جاري تحميل المركبات...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && buses.length === 0 && (
        <div className="rounded-2xl border border-primary/20 bg-card p-10 text-center">
          <p className="text-lg font-bold">لا توجد مركبات</p>

          <p className="mt-2 text-sm text-gray-400">
            لم تتم إضافة أي مركبات إلى مكتبك حتى الآن.
          </p>
        </div>
      )}

      {/* Buses */}
      {!loading && !error && buses.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="overflow-hidden rounded-2xl border border-primary/20 bg-card transition hover:border-primary/50"
            >
              {/* Bus image / illustration */}
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-media-placeholder-alt to-card-secondary">
                <div className="absolute right-4 top-4">
                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold ${getStatusClass(
                      bus.status
                    )}`}
                  >
                    {getStatusLabel(bus.status)}
                  </span>
                </div>

                <svg
                  width="210"
                  height="120"
                  viewBox="0 0 240 140"
                  fill="none"
                  className="text-accent"
                >
                  <rect
                    x="25"
                    y="25"
                    width="190"
                    height="80"
                    rx="16"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <rect
                    x="45"
                    y="40"
                    width="55"
                    height="30"
                    rx="5"
                    fill="currentColor"
                    opacity="0.18"
                  />

                  <rect
                    x="110"
                    y="40"
                    width="35"
                    height="30"
                    rx="5"
                    fill="currentColor"
                    opacity="0.18"
                  />

                  <rect
                    x="155"
                    y="40"
                    width="35"
                    height="30"
                    rx="5"
                    fill="currentColor"
                    opacity="0.18"
                  />

                  <path
                    d="M25 78H215"
                    stroke="currentColor"
                    strokeWidth="3"
                  />

                  <circle
                    cx="65"
                    cy="110"
                    r="13"
                    fill="#080d22"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <circle
                    cx="175"
                    cy="110"
                    r="13"
                    fill="#080d22"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
              </div>

              {/* Bus information */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {bus.name}
                    </h3>

                    <p className="mt-1 text-sm text-accent">
                      #{bus.id}
                    </p>
                  </div>

                  {bus.year && (
                    <div className="rounded-lg bg-card-secondary px-3 py-2 text-xs text-gray-400">
                      {bus.year}
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <InfoRow
                    label="الشركة / الموديل"
                    value={bus.model ?? "غير محدد"}
                    bordered
                  />

                  <InfoRow
                    label="عدد المقاعد"
                    value={`${bus.capacity} مقعد`}
                    bordered
                  />

                  <InfoRow
                    label="السائق الحالي"
                    value={bus.driver?.name ?? "غير معيّن"}
                    bordered
                  />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="rounded-lg border border-border/10 bg-card-secondary py-2.5 text-sm text-gray-300 transition hover:border-primary/40 hover:text-foreground"
                  >
                    التفاصيل
                  </button>

                  <button
                    type="button"
                    className="rounded-lg bg-primary/15 py-2.5 text-sm font-bold text-accent transition hover:bg-primary/25"
                  >
                    تعديل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}