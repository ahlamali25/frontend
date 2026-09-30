import { Suspense } from "react";
import SeatMapView from "@/components/seats/SeatMapView";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function SeatsPage() {
  return (
    <>
      <ThemeToggle className="fixed left-4 top-4 z-50" compact />
      <Suspense fallback={<div className="p-10 text-center text-gray-400">جارٍ التحميل...</div>}>
        <SeatMapView />
      </Suspense>
    </>
  );
}