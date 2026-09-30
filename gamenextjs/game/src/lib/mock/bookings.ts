import { OfficeBooking } from "@/types/booking";

export const officeBookings: OfficeBooking[] = [
  { id: "000123", passenger: "أحمد محمد", trip: "دمشق → حلب", date: "23 مايو 2026", seats: ["3A", "3B"], amount: "150,000", status: "مؤكد" },
  { id: "000124", passenger: "سارة علي", trip: "دمشق → اللاذقية", date: "24 مايو 2026", seats: ["5A"], amount: "75,000", status: "مؤكد" },
  { id: "000125", passenger: "حسين كامل", trip: "دمشق → حمص", date: "24 مايو 2026", seats: ["12C"], amount: "75,000", status: "مؤكد" },
  { id: "000126", passenger: "علي حسن", trip: "دمشق → حماة", date: "23 مايو 2026", seats: ["2B"], amount: "75,000", status: "مؤكد" },
  { id: "000127", passenger: "نور الهدى", trip: "دمشق → طرطوس", date: "23 مايو 2026", seats: ["7A", "7B"], amount: "150,000", status: "ملغي" },
];