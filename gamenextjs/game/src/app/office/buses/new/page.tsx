"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api/client";
import { PrimaryButton } from "@/components/ui/Button";

type Driver = {
  id: number;
  name: string;
};

type FormData = {
  fleet_number: string;
  plate_number: string;
  name: string;
  type: "VIP" | "سياحي";
  model: string;
  year: string;
  capacity: string;
  seat_layout: string;
  contact_phone: string;
  driver_id: string;
};

type FormErrors = Record<string, string[]>;

export default function AddBusPage() {
  const router = useRouter();

  const [busType, setBusType] = useState<"VIP" | "سياحي">("VIP");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverId, setDriverId] = useState("");

  const [form, setForm] = useState<FormData>({
    fleet_number: "",
    plate_number: "",
    name: "",
    type: "VIP",
    model: "",
    year: "",
    capacity: "",
    seat_layout: "",
    contact_phone: "",
    driver_id: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDrivers() {
      try {
        const response = await apiFetch<Driver[]>("/drivers", {
          auth: true,
        });

        setDrivers(response);
      } catch (err) {
        console.error(err);

        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("حدث خطأ أثناء تحميل السائقين.");
        }
      } finally {
        setLoadingDrivers(false);
      }
    }

    loadDrivers();
  }, []);

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: [],
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setErrors({});
    setError("");

    try {
      await apiFetch("/buses", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          fleet_number: form.fleet_number,
          plate_number: form.plate_number,
          name: form.name,
          type: form.type,
          model: form.model,
          year: form.year,
          capacity: Number(form.capacity),
          seat_layout: form.seat_layout,
          contact_phone: form.contact_phone || null,
          driver_id: form.driver_id
            ? Number(form.driver_id)
            : null,
        }),
      });

      router.push("/office/buses");
    } catch (err) {
      console.error(err);

      if (err instanceof ApiError) {
        if (err.status === 422 && err.errors) {
          setErrors(err.errors);
        } else {
          setError(err.message);
        }
      } else {
        setError("حدث خطأ أثناء إضافة المركبة.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-xs text-gray-500">
          المركبات ← إضافة مركبة جديدة
        </p>

        <h1 className="text-2xl font-bold">
          إضافة مركبة جديدة
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/10 bg-card p-7"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="رقم المركبة"
            error={errors.fleet_number?.[0]}
          >
            <input
              value={form.fleet_number}
              onChange={(e) =>
                updateField("fleet_number", e.target.value)
              }
              placeholder="أدخل رقم المركبة"
              className="input"
            />
          </Field>

          <Field
            label="رقم اللوحة"
            error={errors.plate_number?.[0]}
          >
            <input
              value={form.plate_number}
              onChange={(e) =>
                updateField("plate_number", e.target.value)
              }
              placeholder="أدخل رقم اللوحة"
              className="input"
            />
          </Field>

          <Field
            label="الموبايل"
            error={errors.contact_phone?.[0]}
          >
            <input
              value={form.contact_phone}
              onChange={(e) =>
                updateField("contact_phone", e.target.value)
              }
              placeholder="أدخل رقم الموبايل"
              className="input"
            />
          </Field>

          <Field
            label="نوع المركبة"
            error={errors.type?.[0]}
          >
            <select
              value={busType}
              onChange={(e) => {
                const value = e.target.value as
                  | "VIP"
                  | "سياحي";

                setBusType(value);
                updateField("type", value);
              }}
              className="input"
            >
              <option value="VIP">VIP</option>
              <option value="سياحي">سياحي</option>
            </select>
          </Field>

          <Field
            label="عدد المقاعد"
            error={errors.capacity?.[0]}
          >
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) =>
                updateField("capacity", e.target.value)
              }
              placeholder="أدخل عدد المقاعد"
              className="input"
            />
          </Field>

          <Field
            label="سنة الصنع"
            error={errors.year?.[0]}
          >
            <input
              value={form.year}
              onChange={(e) =>
                updateField("year", e.target.value)
              }
              placeholder="أدخل سنة الصنع"
              className="input"
            />
          </Field>

          <Field
            label="اسم الموديل"
            error={errors.model?.[0]}
          >
            <input
              value={form.model}
              onChange={(e) =>
                updateField("model", e.target.value)
              }
              placeholder="أدخل اسم الموديل"
              className="input"
            />
          </Field>

          <Field
            label="اسم المركبة"
            error={errors.name?.[0]}
          >
            <input
              value={form.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
              placeholder="أدخل اسم المركبة"
              className="input"
            />
          </Field>

          <Field
            label="تخطيط المقاعد"
            error={errors.seat_layout?.[0]}
          >
            <input
              value={form.seat_layout}
              onChange={(e) =>
                updateField("seat_layout", e.target.value)
              }
              placeholder="مثال: 2+2"
              className="input"
            />
          </Field>

          <Field
            label="السائق"
            error={errors.driver_id?.[0]}
          >
            <select
              value={driverId}
              onChange={(e) => {
                setDriverId(e.target.value);
                updateField("driver_id", e.target.value);
              }}
              className="input"
              disabled={loadingDrivers}
            >
              <option value="">
                {loadingDrivers
                  ? "جاري تحميل السائقين..."
                  : "اختر سائق"}
              </option>

              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-7 flex gap-3">
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? "جاري الحفظ..." : "💾 حفظ"}
          </PrimaryButton>

          <Link
            href="/office/buses"
            className="rounded-xl border border-border/10 px-6 py-4 text-sm font-bold text-gray-300 transition hover:bg-foreground/5"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-400">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}