import { BusType } from "@/types/bus";

export interface TripListing {
  id: number;
  companyName: string;

  fromGovernorate: string;
  toGovernorate: string;

  busCategory: BusType;
  departureTime: string;
  departureDate: string;
  arrivalTime: string;
  durationHours: number;
  price: number;
  availableSeats: number;
  totalSeats: number;
}

interface RawBus {
  id: number;
  type: BusType;
  capacity: number;
}

interface RawOffice {
  id: number;
  name: string;
}

export interface RawTripListing {
  id: number;

  from_governorate: string;
  to_governorate: string;

  departure_time: string;
  departure_date: string; 
  arrival_time: string;

  seat_price: string | number;
  available_seats: number;

  bus: RawBus;
  office: RawOffice;
}

function calculateDurationHours(
  departureTime: string,
  arrivalTime: string
): number {
  const [departureHour, departureMinute] = departureTime
    .split(":")
    .map(Number);

  const [arrivalHour, arrivalMinute] = arrivalTime
    .split(":")
    .map(Number);

  const departureMinutes =
    departureHour * 60 + departureMinute;

  let arrivalMinutes =
    arrivalHour * 60 + arrivalMinute;

  if (arrivalMinutes < departureMinutes) {
    arrivalMinutes += 24 * 60;
  }

  const durationMinutes =
    arrivalMinutes - departureMinutes;

  return Math.round((durationMinutes / 60) * 10) / 10;
}

export function mapTripListing(
  raw: RawTripListing
): TripListing {
  return {
    id: raw.id,

    companyName: raw.office.name,

    fromGovernorate: raw.from_governorate,
    toGovernorate: raw.to_governorate,

    departureDate: raw.departure_date,

    busCategory: raw.bus.type,

    departureTime: raw.departure_time.slice(0, 5),
    arrivalTime: raw.arrival_time.slice(0, 5),

    durationHours: calculateDurationHours(
      raw.departure_time,
      raw.arrival_time
    ),

    price: Number(raw.seat_price),

    availableSeats: raw.available_seats,

    totalSeats: raw.bus.capacity,
  };
}