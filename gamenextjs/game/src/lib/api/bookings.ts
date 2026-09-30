import { apiFetch } from "@/lib/api/client";

export interface CreateBookingPayload {
  trip_id: number;
  seat_numbers: string[];
}

export interface BookingResponse {
  message: string;
  booking: {
    id: number;
    user_id: number;
    trip_id: number;
    booking_code: string;
    seats_count: number;
    total_amount: number;
    status: string;
  };
}

export interface CreatePaymentPayload {
  sender_account: string;
}

export interface PaymentResponse {
  message: string;
  payment: {
    id: number;
    booking_id: number;
    payment_method: string;
    sender_account: string;
    receiver_account: string;
    amount: number;
    transaction_reference: string;
    status: string;
    paid_at: string;
  };
}

export interface UserBooking {
  id: number;
  user_id: number;
  trip_id: number;
  booking_code: string;
  seats_count: number;
  total_amount: number;
  status: string;

  trip: {
    id: number;
    from_governorate: string;
    to_governorate: string;
    departure_date: string;
    departure_time: string;
    arrival_time: string;
    seat_price: string | number;
    vip_seat_price: string | number | null;

    office: {
      id: number;
      name: string;
    };

    bus: {
      id: number;
      name: string;
      type: string;
    };
  };

  payment: {
    id: number;
    payment_method: string;
    amount: number;
    transaction_reference: string;
    status: string;
    paid_at: string;
  } | null;

  seats?: {
    id: number;
    seat_number: string;
    status: string;
  }[];
}

export async function createBooking(
  payload: CreateBookingPayload
): Promise<BookingResponse> {
  return apiFetch<BookingResponse>("/bookings", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function createPayment(
  bookingId: number,
  payload: CreatePaymentPayload
): Promise<PaymentResponse> {
  return apiFetch<PaymentResponse>(
    `/bookings/${bookingId}/payments`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }
  );
}

export async function getUserBookings(): Promise<UserBooking[]> {
  return apiFetch<UserBooking[]>("/user/bookings", {
    auth: true,
  });
}

export async function getBooking(bookingId: number) {
  return apiFetch(`/bookings/${bookingId}`, {
    auth: true,
  });
}