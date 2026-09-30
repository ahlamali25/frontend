export type SeatColumn = "A" | "B" | "C" | "D";
export type SeatStatus = "available" | "booked" | "selected";

export interface Seat {
  id: string;       // مثل "3A"
  row: number;
  column: SeatColumn;
  status: SeatStatus;
}