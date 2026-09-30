"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { apiFetch, ApiError } from "@/lib/api/client";
import { StatCard } from "@/components/ui/StatCard";
import { InfoRow } from "@/components/ui/InfoRow";

type Driver = {
  id: number;
  name: string;
  phone: string;
  national_id: string;
  license_number: string;
  assigned_bus_id?: number | null;
  notes?: string | null;
  status: string;
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDrivers() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch<Driver[]>("/drivers", {
          auth: true,
        });

        setDrivers(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("تعذر تحميل بيانات السائقين.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDrivers();
  }, []);

  const filteredDrivers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return drivers;

    return drivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(value) ||
        driver.phone.toLowerCase().includes(value) ||
        driver.license_number.toLowerCase().includes(value)
    );
  }, [drivers, search]);

  const totalDrivers = drivers.length;

  const availableDrivers = drivers.filter(
    (driver) => driver.status === "متاح" || driver.status === "available"
  ).length;

  const inTripDrivers = drivers.filter(
    (driver) => driver.status === "في رحلة" || driver.status === "in_trip"
  ).length;

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm text-accent">مكتب النقل</p>
          <h1 className="text-4xl font-black">السائقين</h1>
          <p className="mt-2 text-sm text-gray-400">
            إدارة ومتابعة سائقي المكتب
          </p>
        </div>

        <Link
          href="/office/drivers/new"
          className="rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-[#4f3ad6]/20 transition hover:bg-primary-hover"
        >
          + إضافة سائق
        </Link>
      </div>

      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <StatCard
          title="إجمالي السائقين"
          value={loading ? "..." : String(totalDrivers)}
        />

        <StatCard
          title="السائقون المتاحون"
          value={loading ? "..." : String(availableDrivers)}
          variant="green"
        />

        <StatCard
          title="السائقون في رحلة"
          value={loading ? "..." : String(inTripDrivers)}
          variant="purple"
        />
      </div>

      <div className="mb-6 rounded-2xl border border-primary/20 bg-card p-5">
        <div className="relative">
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4-4" />
          </svg>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن سائق بالاسم أو رقم الهاتف أو رقم الرخصة..."
            className="w-full rounded-xl border border-border/10 bg-surface-page py-4 pr-12 pl-4 text-sm text-foreground outline-none transition placeholder:text-gray-600 focus:border-primary"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-primary/20 bg-card p-10 text-center text-gray-400">
          جاري تحميل بيانات السائقين...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
          <p className="font-bold text-red-400">{error}</p>
          <p className="mt-2 text-sm text-gray-500">
            تأكد من تسجيل الدخول واتصال التطبيق بالـ API.
          </p>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="rounded-2xl border border-primary/20 bg-card p-10 text-center">
          <p className="font-bold text-gray-300">
            {search
              ? "لا يوجد سائق يطابق البحث."
              : "لا يوجد سائقون مضافون إلى المكتب حتى الآن."}
          </p>

          {!search && (
            <Link
              href="/office/drivers/new"
              className="mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              + إضافة أول سائق
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="group rounded-2xl border border-primary/20 bg-card p-6 transition hover:border-primary/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-xl font-black text-accent">
                    {driver.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-bold">{driver.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      سائق مكتب النقل
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    driver.status === "متاح" ||
                    driver.status === "available"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : driver.status === "في رحلة" ||
                        driver.status === "in_trip"
                      ? "bg-primary/15 text-accent"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {driver.status}
                </span>
              </div>

              <div className="mt-6 space-y-4 border-t border-border/5 pt-5">
                <InfoRow label="رقم الهاتف" value={driver.phone} />

                <InfoRow
                  label="رقم الرخصة"
                  value={driver.license_number}
                />

                <InfoRow
                  label="الحافلة المخصصة"
                  value={
                    driver.assigned_bus_id
                      ? `حافلة رقم ${driver.assigned_bus_id}`
                      : "غير مخصصة"
                  }
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link
                  href={`/office/drivers/${driver.id}`}
                  className="rounded-lg border border-border/10 bg-card-secondary py-2.5 text-center text-sm text-gray-300 transition hover:border-primary/40 hover:text-foreground"
                >
                  عرض التفاصيل
                </Link>

                <Link
                  href={`/office/drivers/${driver.id}/edit`}
                  className="rounded-lg bg-primary/15 py-2.5 text-center text-sm font-bold text-accent transition hover:bg-primary/25"
                >
                  تعديل
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
