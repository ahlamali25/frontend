import { IconProps } from "./types";

export function BusIcon({ width = 32, height = 32, className = "text-[#4f3ad6]" }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="7" y="7" width="34" height="30" rx="7" stroke="currentColor" strokeWidth="2.5" />
      <path d="M7 20H41" stroke="currentColor" strokeWidth="2.5" />
      <rect x="12" y="12" width="10" height="5" rx="1.5" fill="currentColor" opacity="0.35" />
      <rect x="26" y="12" width="10" height="5" rx="1.5" fill="currentColor" opacity="0.35" />
      <circle cx="15" cy="38" r="3" fill="currentColor" />
      <circle cx="33" cy="38" r="3" fill="currentColor" />
    </svg>
  );
}