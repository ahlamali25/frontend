import { apiFetch } from "@/lib/api/client";
import {
  TripListing,
  RawTripListing,
  mapTripListing,
} from "@/types/tripListing";

export interface TripSearchParams {
  from_governorate: string;
  to_governorate: string;
  departure_date: string;
}

export async function searchTrips(
  params: TripSearchParams
): Promise<TripListing[]> {
  const query = new URLSearchParams({
    from_governorate: params.from_governorate,
    to_governorate: params.to_governorate,
    departure_date: params.departure_date,
  }).toString();

  const response = await apiFetch<RawTripListing[]>(
    `/trips/search?${query}`
  );

  return response.map(mapTripListing);
}