import { apiFetch } from "@/lib/api/client";

export interface OfficeDriver {
  id: number;
  office_id: number;
  name: string;
  phone: string;
  license_number: string;
  status: string;
}

export async function getOfficeDrivers(): Promise<OfficeDriver[]> {
  return apiFetch<OfficeDriver[]>("/drivers", {
    auth: true,
  });
}