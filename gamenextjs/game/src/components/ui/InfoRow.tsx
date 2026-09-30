interface InfoRowProps {
  label: string;
  value: string;
  bordered?: boolean;
}

export function InfoRow({ label, value, bordered = false }: InfoRowProps) {
  return (
    <div className={`flex items-center justify-between ${bordered ? "border-b border-border/5 pb-3" : ""}`}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-200">{value}</span>
    </div>
  );
}