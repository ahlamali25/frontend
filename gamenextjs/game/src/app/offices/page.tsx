"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { StarIcon } from "@/components/icons/StarIcon";
import { PrimaryButton } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api/client";
import type { Office } from "@/types/office";

export default function OfficesPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const loadOffices = useCallback(async (searchValue = "") => {
    try {
      setError("");
      setLoading(true);

      const params = new URLSearchParams();

      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      }

      const query = params.toString();

      const data = await apiFetch<Office[]>(
        `/offices${query ? `?${query}` : ""}`
      );

      setOffices(data);
    } catch (err) {
      console.error(err);
      setError("تعذر تحميل المكاتب حاليًا. حاول مرة أخرى.");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    loadOffices();
  }, [loadOffices]);

  const handleSearch = async () => {
    setSearch(searchInput);
    setSearching(true);
    await loadOffices(searchInput);
  };

  const clearSearch = async () => {
    setSearchInput("");
    setSearch("");
    await loadOffices("");
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-border/5 bg-gradient-to-b from-card-muted to-sidebar pb-12 pt-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-accent">
              📄 المكاتب المتاحة
            </div>

            <h1 className="text-4xl font-extrabold md:text-5xl">
              اختر مكتبك المفضل
            </h1>

            <p className="mt-6 leading-8 text-gray-400">
              استعرض مكاتب النقل المتوفرة وتعرّف على الخدمات والرحلات التي
              يقدمها كل مكتب.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-3xl border border-border/15 bg-gradient-to-b from-card to-card-deep p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                البحث عن مكتب
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="اكتب اسم المكتب..."
                  className="w-full rounded-xl border border-border/15 bg-surface-page px-4 py-3.5 text-foreground outline-none transition placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex items-end gap-3 md:w-auto">
              <PrimaryButton
                onClick={handleSearch}
                disabled={searching}
                className="flex min-w-44 items-center justify-center gap-2"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                {searching ? "جاري البحث..." : "البحث عن المكتب"}
              </PrimaryButton>

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="rounded-xl border border-border/15 px-4 py-3.5 text-sm text-gray-400 transition hover:text-foreground"
                >
                  مسح
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">مكاتب النقل</h2>

          <p className="mt-2 text-sm text-gray-400">
            {loading
              ? "جاري تحميل المكاتب..."
              : `${offices.length} مكاتب نقل متاحة`}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center text-red-400">
            <p>{error}</p>

            <button
              onClick={() => loadOffices(search)}
              className="mt-3 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold hover:bg-red-500/20"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border border-border/10 bg-card"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && offices.length === 0 && (
          <div className="rounded-3xl border border-border/10 bg-card p-12 text-center">
            <div className="text-4xl">🔍</div>

            <h3 className="mt-4 text-xl font-bold">
              لا توجد مكاتب مطابقة
            </h3>

            <p className="mt-2 text-gray-400">
              لم نجد مكتبًا يطابق اسم البحث.
            </p>

            {search && (
              <button
                onClick={clearSearch}
                className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
              >
                عرض جميع المكاتب
              </button>
            )}
          </div>
        )}

        {/* Cards */}
        {!loading && !error && offices.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => {
              const initials =
                office.name?.trim()?.charAt(0) || "م";

              return (
                <div
                  key={office.id}
                  className="group overflow-hidden rounded-2xl border border-border/10 bg-gradient-to-b from-card to-card-deep p-6 transition duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-[#4f3ad6]/20"
                >
                  {/* Office Header */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-xl font-bold text-accent transition group-hover:from-primary/30 group-hover:to-primary/10">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold">
                        {office.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1 text-sm">
                        <span className="text-yellow-400">
                          <StarIcon />
                        </span>

                        <span className="text-gray-300">
                          {office.rating ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Office Information */}
                  <div className="mt-5 rounded-2xl border border-border/5 bg-card-secondary p-5">
                    <p className="text-xs font-medium text-gray-500">
                      عن المكتب
                    </p>

                    <p className="mt-2 min-h-14 leading-7 text-gray-300">
                      {office.description ||
                        "مكتب نقل يقدم رحلات بين مختلف المحافظات السورية."}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-border/5 pt-5">
                    <div>
                      <span className="text-xs font-medium text-gray-500">
                        الرحلات المتاحة
                      </span>

                      <p className="mt-1 font-bold text-foreground">
                        {office.trips_count}
                      </p>
                    </div>

                    <Link
                      href={`/trips?office_id=${office.id}`}
                      className="rounded-lg bg-gradient-to-r from-primary to-primary-hover px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#4f3ad6]/30 transition hover:shadow-xl hover:shadow-[#4f3ad6]/50"
                    >
                      عرض الرحلات
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}