import OfficeSidebar from "@/components/office/OfficeSidebar";

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <OfficeSidebar />
      <section className="flex-1 p-8">{children}</section>
    </div>
  );
}