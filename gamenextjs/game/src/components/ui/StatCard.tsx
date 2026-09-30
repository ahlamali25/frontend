type StatVariant = "default" | "green" | "purple" | "red";

interface StatCardProps {
  title: string;
  value: string;
  suffix?: string;
  variant?: StatVariant;
}

const variantClasses: Record<StatVariant, string> = {
  default: "text-white",
  green: "text-emerald-400",
  purple: "text-accent",
  red: "text-red-400",
};

export function StatCard({ title, value, suffix, variant = "default" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-card p-6">
      <p className="text-sm text-gray-400">{title}</p>
      <div className={`mt-4 text-3xl font-black ${variantClasses[variant]}`}>
        {value}
        {suffix && <span className="mr-2 text-sm font-normal">{suffix}</span>}
      </div>
    </div>
  );
}