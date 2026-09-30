export type BookingStatus = "مؤكد" | "ملغي";

export interface OfficeBooking {
  id: string;
  passenger: string;
  trip: string;
  date: string;
  seats: string[];   // بدل seat النصي الفردي
  amount: string;
  status: BookingStatus;
}

export interface BookingSummary {
  from: string;
  to: string;
  date: string;
  time: string;
  office: string;
  seats: string[];   // بدل seat الفردي — يدعم أكثر من مقعد بحجز واحد
  passenger: string;
  ticketPrice: number;
}