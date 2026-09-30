export type DriverStatus = "متاح" | "في رحلة" | "غير متاح";

export interface Driver {
  id: number;
  name: string;
  phone: string;
  nationalId: string;        // جديد — رقم الهوية
  licenseNumber: string;
  assignedBusId?: string;    // جديد — المركبة المعينة (اختياري)
  trips: number;
  status: DriverStatus;
}