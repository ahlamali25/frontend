"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { apiFetch, ApiError } from "@/lib/api/client";
import { PrimaryButton } from "@/components/ui/Button";

interface Bus {
  id: number;
  name?: string;
  plate_number?: string;
}

interface DriverForm {
  name: string;
  phone: string;
  national_id: string;
  license_number: string;
  assigned_bus_id: string;
  status: "متاح" | "في رحلة" | "غير متاح";
  notes: string;
}

export default function AddDriverPage() {
  const router = useRouter();

  const [buses, setBuses] = useState<Bus[]>([]);
  const [loadingBuses, setLoadingBuses] = useState(true);

  const [form, setForm] = useState<DriverForm>({
    name: "",
    phone: "",
    national_id: "",
    license_number: "",
    assigned_bus_id: "",
    status: "متاح",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadBuses() {
      try {
        const data = await apiFetch<Bus[]>("/buses", {
          auth: true,
        });

        setBuses(data);
      } catch (err) {
        console.error(err);

        if (err instanceof ApiError) {
          setGeneralError(err.message);
        } else {
          setGeneralError("تعذر تحميل قائمة الحافلات.");
        }
      } finally {
        setLoadingBuses(false);
      }
    }

    loadBuses();
  }, []);

  function updateField<K extends keyof DriverForm>(
    field: K,
    value: DriverForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

    setGeneralError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSaving) return;

    setIsSaving(true);
    setErrors({});
    setGeneralError("");

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        national_id: form.national_id.trim(),
        license_number: form.license_number.trim(),
        assigned_bus_id: form.assigned_bus_id
          ? Number(form.assigned_bus_id)
          : null,
        status: form.status,
        notes: form.notes.trim() || null,
      };

      await apiFetch("/drivers", {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      });

      router.push("/office/drivers");
      router.refresh();
    } catch (err) {
      console.error("Create driver error:", err);

      if (err instanceof ApiError) {
        setGeneralError(err.message);
        setErrors(err.errors ?? {});
      } else {
        setGeneralError("تعذر إضافة السائق. حاول مرة أخرى.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="mb-2 text-xs text-gray-500">
          السائقين ← إضافة سائق جديد
        </p>

        <h1 className="text-2xl font-bold">
          إضافة سائق جديد
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/10 bg-card p-7"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="الاسم الكامل"
            error={errors.name?.[0]}
          >
            <input
              value={form.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
              placeholder="أدخل الاسم الكامل"
              className="input"
            />
          </Field>

          <Field
            label="رقم الهاتف"
            error={errors.phone?.[0]}
          >
            <input
              value={form.phone}
              onChange={(e) =>
                updateField("phone", e.target.value)
              }
              placeholder="أدخل رقم الهاتف"
              className="input"
            />
          </Field>

          <Field
            label="رقم الهوية"
            error={errors.national_id?.[0]}
          >
            <input
              value={form.national_id}
              onChange={(e) =>
                updateField("national_id", e.target.value)
              }
              placeholder="أدخل رقم الهوية"
              className="input"
            />
          </Field>

          <Field
            label="رقم الرخصة"
            error={errors.license_number?.[0]}
          >
            <input
              value={form.license_number}
              onChange={(e) =>
                updateField("license_number", e.target.value)
              }
              placeholder="أدخل رقم الرخصة"
              className="input"
            />
          </Field>

          <Field
            label="المركبة المعينة"
            error={errors.assigned_bus_id?.[0]}
          >
            <select
              value={form.assigned_bus_id}
              onChange={(e) =>
                updateField("assigned_bus_id", e.target.value)
              }
              className="input"
              disabled={loadingBuses}
            >
              <option value="">
                {loadingBuses
                  ? "جاري تحميل الحافلات..."
                  : "اختر مركبة"}
              </option>

              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.id}
                  {bus.name ? ` — ${bus.name}` : ""}
                  {bus.plate_number
                    ? ` — ${bus.plate_number}`
                    : ""}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="الحالة"
            error={errors.status?.[0]}
          >
            <select
              value={form.status}
              onChange={(e) =>
                updateField(
                  "status",
                  e.target.value as DriverForm["status"]
                )
              }
              className="input"
            >
              <option value="متاح">متاح</option>
              <option value="في رحلة">في رحلة</option>
              <option value="غير متاح">غير متاح</option>
            </select>
          </Field>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-400">
              ملاحظات
            </label>

            <textarea
              value={form.notes}
              onChange={(e) =>
                updateField("notes", e.target.value)
              }
              placeholder="أدخل أي ملاحظات إضافية (اختياري)"
              rows={4}
              className="input resize-none"
            />

            {errors.notes?.[0] && (
              <p className="mt-1 text-xs text-red-400">
                {errors.notes[0]}
              </p>
            )}
          </div>
        </div>

        {generalError && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-red-400">
              {generalError}
            </p>
          </div>
        )}

        <div className="mt-7 flex gap-3">
          <PrimaryButton
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "جاري حفظ السائق..."
              : "💾 حفظ السائق"}
          </PrimaryButton>

          <Link
            href="/office/drivers"
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
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-400">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}