import { Office } from "@/types/office";

export const offices: Office[] = [
  { id: 1, name: "السفير للنقل", rating: "4.8", trips: 32, from: "دمشق", to: "حلب", description: "رحلات يومية بين دمشق وحلب", initials: "س" },
  { id: 2, name: "الجنوب للنقل", rating: "4.6", trips: 24, from: "دمشق", to: "درعا", description: "رحلات مريحة وآمنة", initials: "ج" },
  { id: 3, name: "الفرات للنقل", rating: "4.7", trips: 18, from: "دمشق", to: "دير الزور", description: "رحلات منتظمة على مدار الأسبوع", initials: "ف" },
  { id: 4, name: "الشمال للنقل", rating: "4.4", trips: 28, from: "حلب", to: "إدلب", description: "خدمة نقل مريحة وموثوقة", initials: "ش" },
  { id: 5, name: "البلاد للنقل", rating: "4.3", trips: 21, from: "حمص", to: "اللاذقية", description: "رحلات يومية بأسعار مناسبة", initials: "ب" },
  { id: 6, name: "الساحل للنقل", rating: "4.5", trips: 26, from: "اللاذقية", to: "طرطوس", description: "رحلات مريحة بين مدن الساحل", initials: "س" },
];