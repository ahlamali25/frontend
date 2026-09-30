import { PassengerTrip } from "@/types/passengerTrip";
import { offices } from "@/lib/mock/offices";

export const passengerTrips: PassengerTrip[] = [
  {
    id: "TRP-2026-0325-000123",
    companyName: offices[0].name,
    busCategory: "VIP",
    departureTime: "09:30",
    arrivalTime: "10:00",
    fromCity: "دمشق",
    fromArea: "المركز",
    toCity: "بغداد",
    toArea: "باب المصلى",
    date: "23 آب 2026",
    price: 56000,
    status: "قادمة",
  },
  {
    id: "TRP-2026-0330-000098",
    companyName: offices[1].name,
    busCategory: "عادي",
    departureTime: "13:00",
    arrivalTime: "10:00",
    fromCity: "دمشق",
    fromArea: "المركز",
    toCity: "درعا",
    toArea: "باب المصلى",
    date: "20 آب 2026",
    price: 56000,
    status: "منتهية",
  },
];