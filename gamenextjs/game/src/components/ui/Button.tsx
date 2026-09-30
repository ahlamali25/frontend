import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({ className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl bg-gradient-to-r from-[#4f3ad6] to-[#604be8] px-6 py-4 font-bold text-white shadow-lg shadow-[#4f3ad6]/40 transition hover:shadow-xl hover:shadow-[#4f3ad6]/60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}