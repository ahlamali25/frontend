export type BusStatus = "متاح" | "في رحلة" | "صيانة";
export type BusType = "VIP" | "سياحي";

export interface Bus {
  id: string;
  plateNumber: string;
  name: string;
  type: BusType;
  model: string;
  year: string;
  capacity: number;
  seatLayout: string;
  contactPhone?: string;
  driverId?: number;   // مرجع لـ Driver.id — مصدر الحقيقة الوحيد لعلاقة السائق↔الحافلة
  status: BusStatus;
}