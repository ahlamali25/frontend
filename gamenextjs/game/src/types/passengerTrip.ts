export type PassengerTripStatus = "قادمة" | "منتهية" | "ملغاة";

export interface PassengerTrip {
  id: string;               // TRP-2026-0325-000123
  companyName: string;
  busCategory: "VIP" | "عادي";
  departureTime: string;
  arrivalTime: string;
  fromCity: string;
  fromArea: string;
  toCity: string;
  toArea: string;
  date: string;
  price: number;
  status: PassengerTripStatus;
}