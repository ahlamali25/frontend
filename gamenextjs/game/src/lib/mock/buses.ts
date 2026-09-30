import { Bus } from "@/types/bus";

// driverId يطابق Driver.id بـ lib/mock/drivers.ts — نفس التخصيص كـ assignedBusId هناك
export const buses: Bus[] = [
  { id: "SH-505", plateNumber: "دمشق 12345", name: "باص VIP", type: "VIP", model: "Mercedes-Benz", year: "2023", capacity: 32, seatLayout: "2+1", contactPhone: "0933 100 001", driverId: 1, status: "متاح" },
  { id: "SH-412", plateNumber: "دمشق 67890", name: "باص سياحي", type: "سياحي", model: "King Long", year: "2022", capacity: 45, seatLayout: "2+2", contactPhone: "0933 100 002", driverId: 2, status: "في رحلة" },
  { id: "SH-201", plateNumber: "حلب 54321", name: "باص نقل", type: "سياحي", model: "Higer", year: "2021", capacity: 40, seatLayout: "2+2", contactPhone: "0933 100 003", driverId: 3, status: "متاح" },
  { id: "SH-305", plateNumber: "دمشق 11223", name: "باص VIP", type: "VIP", model: "Mercedes-Benz", year: "2024", capacity: 32, seatLayout: "2+1", contactPhone: "0933 100 004", driverId: 4, status: "متاح" },
  { id: "SH-601", plateNumber: "حمص 99887", name: "باص سياحي", type: "سياحي", model: "Yutong", year: "2020", capacity: 45, seatLayout: "2+2", contactPhone: "0933 100 005", driverId: 5, status: "صيانة" },
];