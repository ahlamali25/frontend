import { TripListing } from "@/types/tripListing";
import { offices } from "@/lib/mock/offices";

export const tripListings: TripListing[] = [
  { id: 1, companyName: offices[0].name, busCategory: "VIP", departureTime: "08:00 ص", arrivalTime: "12:30 م", durationHours: 4.5, price: 45000, availableSeats: 5, totalSeats: 30 },
  { id: 2, companyName: offices[1].name, busCategory: "سياحي", departureTime: "10:30 ص", arrivalTime: "03:00 م", durationHours: 4.5, price: 35000, availableSeats: 12, totalSeats: 40 },
  { id: 3, companyName: offices[2].name, busCategory: "VIP", departureTime: "02:00 م", arrivalTime: "06:30 م", durationHours: 4.5, price: 45000, availableSeats: 0, totalSeats: 30 },
  { id: 4, companyName: offices[3].name, busCategory: "سياحي", departureTime: "05:00 م", arrivalTime: "09:30 م", durationHours: 4.5, price: 35000, availableSeats: 22, totalSeats: 40 },
];