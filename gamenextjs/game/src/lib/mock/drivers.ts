import { Driver } from "@/types/driver";

export const drivers: Driver[] = [
  { id: 1, name: "أحمد محمد", phone: "0998 123 456", nationalId: "01234567890", licenseNumber: "D-10245", assignedBusId: "SH-505", trips: 28, status: "متاح" },
  { id: 2, name: "سارة علي", phone: "0933 456 789", nationalId: "01234567891", licenseNumber: "D-10287", assignedBusId: "SH-412", trips: 21, status: "في رحلة" },
  { id: 3, name: "حسين كامل", phone: "0944 789 123", nationalId: "01234567892", licenseNumber: "D-10311", assignedBusId: "SH-201", trips: 34, status: "متاح" },
  { id: 4, name: "علي حسن", phone: "0955 222 333", nationalId: "01234567893", licenseNumber: "D-10452", assignedBusId: "SH-305", trips: 19, status: "متاح" },
  { id: 5, name: "نور المهدي", phone: "0966 555 777", nationalId: "01234567894", licenseNumber: "D-10672", trips: 16, status: "غير متاح" },
];