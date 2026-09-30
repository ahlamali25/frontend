import { Seat, SeatColumn } from "@/types/seat";

const columns: SeatColumn[] = ["A", "B", "C", "D"];
const totalRows = 8;

// ⚠️ مقاعد محجوزة افتراضيًا للمحاكاة — لاحقًا تجي من الـ API الحقيقي
const bookedSeatIds = new Set(["3A", "3B"]);

export function generateSeatMap(): Seat[] {
  const seats: Seat[] = [];

  for (let row = 1; row <= totalRows; row++) {
    for (const column of columns) {
      const id = `${row}${column}`;
      seats.push({
        id,
        row,
        column,
        status: bookedSeatIds.has(id) ? "booked" : "available",
      });
    }
  }

  return seats;
}