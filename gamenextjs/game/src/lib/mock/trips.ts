import { Trip } from "@/types/trip";

export const trips: Trip[] = [
  { id: "TRP-00123", from: "دمشق", to: "حلب", date: "23 مايو 2026", time: "08:30", bus: "SH-505", driver: "أحمد محمد", seats: ["3A", "3B"], price: 150000, status: "مؤكد" },
  { id: "TRP-00124", from: "دمشق", to: "اللاذقية", date: "24 مايو 2026", time: "09:00", bus: "SH-412", driver: "سارة علي", seats: ["5A"], price: 75000, status: "مؤكد" },
  { id: "TRP-00125", from: "دمشق", to: "حمص", date: "24 مايو 2026", time: "10:30", bus: "SH-201", driver: "حسين كامل", seats: ["12C"], price: 75000, status: "مؤكد" },
  { id: "TRP-00126", from: "دمشق", to: "حماة", date: "23 مايو 2026", time: "11:00", bus: "SH-305", driver: "علي حسن", seats: ["2B"], price: 75000, status: "مؤكد" },
  { id: "TRP-00127", from: "دمشق", to: "طرطوس", date: "23 مايو 2026", time: "13:00", bus: "SH-601", driver: "نور المهدي", seats: ["7A", "7B"], price: 150000, status: "ملغى" },
];