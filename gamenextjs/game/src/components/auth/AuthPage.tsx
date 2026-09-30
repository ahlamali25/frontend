"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaBus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
} from "react-icons/fa";
import { login, register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type AuthMode = "login" | "register";

interface AuthPageProps {
  mode?: AuthMode;
}

interface AuthFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  agreeTerms: boolean;
}

const initialFormData: AuthFormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  passwordConfirmation: "",
  agreeTerms: false,
};

export function AuthPage({ mode = "login" }: AuthPageProps) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (isRegister && formData.password !== formData.passwordConfirmation) {
      setError("كلمة المرور وتأكيدها غير متطابقين.");
      return;
    }

    setIsSubmitting(true);

    try {
if (isRegister) {
  const data = await register({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
    password_confirmation: formData.passwordConfirmation,
  });

  if (data.user.role === "office_admin") {
    router.push("/office/dashboard");
  } else {
    router.push("/");
  }
} else {
  const data = await login({
    email: formData.email,
    password: formData.password,
  });

  if (data.user.role === "office_admin") {
    router.push("/office/dashboard");
  } else {
    router.push("/");
  }
}
    } catch (err) {
      if (err instanceof ApiError) {
        const firstFieldError = err.errors ? Object.values(err.errors)[0]?.[0] : null;
        setError(firstFieldError ?? err.message);
      } else {
        setError("تعذر الاتصال بالخادم، حاول مرة أخرى.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <ThemeToggle className="fixed left-4 top-4 z-50" compact />
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center px-4 py-8 md:px-8"
      style={{
        backgroundColor: "var(--special-page)",
        backgroundImage: "var(--special-glow)",
      }}
    >
      <div
        className="relative w-full max-w-[1180px] min-h-[700px] overflow-hidden rounded-[28px] border"
        style={{
          borderColor: "var(--special-border-accent)",
          backgroundColor: "var(--special-panel)",
          boxShadow: "var(--special-panel-shadow)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-bus.png')" }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "var(--special-auth-overlay)",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "var(--special-inner-glow)",
          }}
        />

        <div className="relative z-10 min-h-[700px] flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-[560px]">
            <div className="flex flex-col items-center mb-7">
              <div className="flex items-center gap-3">
                <FaBus className="text-4xl" style={{ color: "var(--special-accent-strong)" }} />
                <span className="text-4xl font-bold" style={{ color: "var(--special-accent-strong)" }}>
                  رحلتي
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mt-7">
                {isRegister ? "إنشاء حساب جديد" : "تسجيل الدخول"}
              </h1>

              <p className="mt-3 text-sm md:text-base" style={{ color: "var(--special-text)" }}>
                {isRegister
                  ? "أنشئ حسابك الآن وابدأ رحلتك بسهولة"
                  : "مرحباً بك من جديد، سجل دخولك لمتابعة رحلتك"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <InputField
                  label="الاسم الكامل"
                  name="name"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.name}
                  onChange={handleInputChange}
                  icon={<FaUser />}
                  required
                />
              )}

              <InputField
                label="البريد الإلكتروني"
                name="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={handleInputChange}
                icon={<FaEnvelope />}
                required
              />

              {isRegister && (
                <InputField
                  label="رقم الهاتف"
                  name="phone"
                  type="tel"
                  placeholder="09xxxxxxxx"
                  value={formData.phone}
                  onChange={handleInputChange}
                  icon={<FaPhone />}
                  required
                />
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm" style={{ color: "var(--special-label)" }}>
                    كلمة المرور
                  </label>

                  {!isRegister && (
                    <Link
                      href="#"
                      className="text-xs hover:underline"
                      style={{ color: "var(--special-accent)" }}
                    >
                      نسيت كلمة المرور؟
                    </Link>
                  )}
                </div>

                <div className="relative">
                  <FaLock
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--special-accent)" }}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="أدخل كلمة المرور"
                    className="w-full h-[68px] rounded-xl border outline-none pr-12 pl-12 text-right transition focus:ring-1"
                    style={{
                      backgroundColor: "var(--special-field)",
                      borderColor: "var(--special-border)",
                      color: "var(--foreground)",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--special-white-muted)" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <InputField
                  label="تأكيد كلمة المرور"
                  name="passwordConfirmation"
                  type={showPassword ? "text" : "password"}
                  placeholder="أعد إدخال كلمة المرور"
                  value={formData.passwordConfirmation}
                  onChange={handleInputChange}
                  icon={<FaLock />}
                  required
                />
              )}

              {isRegister && (
                <label className="flex items-center gap-3 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 accent-form-accent"
                  />

                  <span className="text-sm" style={{ color: "var(--special-text)" }}>
                    أوافق على{" "}
                    <span style={{ color: "var(--special-accent)" }}>الشروط والأحكام</span> و{" "}
                    <span style={{ color: "var(--special-accent)" }}>سياسة الخصوصية</span>
                  </span>
                </label>
              )}

              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    color: "var(--special-danger)",
                    backgroundColor: "var(--special-error-bg)",
                    border: "1px solid var(--special-error-border)",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="theme-on-primary w-full h-[66px] rounded-xl text-lg font-bold text-white transition-all duration-200 disabled:opacity-60"
                style={{
                  background: "var(--special-accent-gradient)",
                  boxShadow: "var(--special-accent-shadow)",
                }}
              >
                {isSubmitting
                  ? "جارٍ المعالجة..."
                  : isRegister
                  ? "إنشاء حساب"
                  : "تسجيل الدخول"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--special-rule)" }} />
              <span className="text-sm" style={{ color: "var(--special-subdued)" }}>أو</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--special-rule)" }} />
            </div>

            <div className="text-center text-sm">
              <span style={{ color: "var(--special-secondary)" }}>
                {isRegister ? "لديك حساب بالفعل؟" : "ليس لديك حساب؟"}
              </span>{" "}
              <Link
                href={isRegister ? "/login" : "/register"}
                className="font-bold hover:underline"
                style={{ color: "var(--special-accent)" }}
              >
                {isRegister ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  required?: boolean;
  icon: React.ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  required,
  icon,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="text-sm block mb-2" style={{ color: "var(--special-label)" }}>
        {label}
      </label>

      <div className="relative">
        <span className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--special-accent)" }}>
          {icon}
        </span>

        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full h-[68px] rounded-xl border outline-none pr-12 pl-4 text-right transition focus:ring-1"
          style={{
            backgroundColor: "var(--special-field)",
            borderColor: "var(--special-border)",
            color: "var(--foreground)",
          }}
        />
      </div>
    </div>
  );
}