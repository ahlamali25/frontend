import { apiFetch } from "@/lib/api/client";
import {
  TripListing,
  RawTripListing,
  mapTripListing,
} from "@/types/tripListing";

export interface TripSearchParams {
  from_governorate?: string;
  to_governorate?: string;
  departure_date?: string;
  office_id?: string;
}

export interface TripDetails {
  id: number;
  office_id: number;
  bus_id: number;
  driver_id: number;
  assistant_driver_id: number;
  from_governorate: string;
  to_governorate: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  is_recurring: boolean;
  recurring_days: string[] | null;
  seat_price: string | number;
  vip_seat_price: string | number | null;
  booking_closes_minutes_before: number;
  available_seats: number;
  status: string;
  bus: {
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
  };
  office: {
    id: number;
    name: string;
    phone: string;
    address: string;
    rating: string | number;
    description: string | null;
    status: string;
  };
}

export interface TripSeat {
  id: number;
  trip_id: number;
  seat_number: string;
  status: string;
  booking_id: number | null;
}

export interface CreateTripPayload {
  bus_id: number;
  driver_id: number;
  assistant_driver_id: number;
  from_governorate: string;
  to_governorate: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  is_recurring?: boolean;
  recurring_days?: string[] | null;
  seat_price: number;
  vip_seat_price?: number | null;
  booking_closes_minutes_before?: number | null;
  available_seats: number;
}

export interface CreateTripResponse {
  message: string;
  trip: TripDetails;
}

export async function searchTrips(
  params: TripSearchParams
): Promise<TripListing[]> {
  const queryParams = new URLSearchParams();

  if (params.from_governorate) {
    queryParams.set("from_governorate", params.from_governorate);
  }

  if (params.to_governorate) {
    queryParams.set("to_governorate", params.to_governorate);
  }

  if (params.departure_date) {
    queryParams.set("departure_date", params.departure_date);
  }

  if (params.office_id) {
    queryParams.set("office_id", params.office_id);
  }

  const query = queryParams.toString();

  const response = await apiFetch<RawTripListing[]>(
    `/trips/search${query ? `?${query}` : ""}`
  );

  return response.map(mapTripListing);
}

export async function getTrip(
  tripId: number
): Promise<TripDetails> {
  return apiFetch<TripDetails>(`/trips/${tripId}`);
}

export async function getTripSeats(
  tripId: number
): Promise<TripSeat[]> {
  return apiFetch<TripSeat[]>(`/trips/${tripId}/seats`);
}

export async function createTrip(
  payload: CreateTripPayload
): Promise<CreateTripResponse> {
  return apiFetch<CreateTripResponse>("/trips", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}