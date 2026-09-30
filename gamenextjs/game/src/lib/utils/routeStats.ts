import { trips } from "@/lib/mock/trips";

export interface RouteStat {
  route: string;
  count: number;
  color: string;
}

// ⚠️ نسب وألوان محسوبة يدويًا للمحاكاة — لاحقًا تُحسب فعليًا من بيانات الرحلات الحقيقية
export const routeStats: RouteStat[] = [
  { route: "دمشق → حلب", count: 5, color: "#8b5cf6" },
  { route: "دمشق → حمص", count: 4, color: "#06b6d4" },
  { route: "دمشق → اللاذقية", count: 3, color: "#f59e0b" },
  { route: "دمشق → حماة", count: 2, color: "#10b981" },
  { route: "أخرى", count: 4, color: "#6b7280" },
];

export const totalTripsCount = routeStats.reduce((sum, r) => sum + r.count, 0);