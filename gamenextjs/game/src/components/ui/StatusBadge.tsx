import { PassengerTripStatus } from "@/types/passengerTrip";

const statusStyles: Record<PassengerTripStatus, string> = {
  "قادمة": "bg-emerald-500/15 text-emerald-400",
  "منتهية": "bg-red-500/15 text-red-400",
  "ملغاة": "bg-red-500/15 text-red-400",
};

export function StatusBadge({ status }: { status: PassengerTripStatus }) {
  return (
    <span className={`rounded-lg px-3 py-1.5 text-xs font-bold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}