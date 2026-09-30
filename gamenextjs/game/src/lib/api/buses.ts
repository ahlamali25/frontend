import { apiFetch } from "@/lib/api/client";

export interface OfficeBus {
  id: number;
  office_id: number;
  fleet_number: string;
  plate_number: string;
  name: string;
  type: string;
  model: string;
  year: string;
  capacity: number;
  seat_layout: string;
  contact_phone: string | null;
  driver_id: number | null;
  status: string;
}

export async function getOfficeBuses(): Promise<OfficeBus[]> {
  return apiFetch<OfficeBus[]>("/buses", {
    auth: true,
  });
}