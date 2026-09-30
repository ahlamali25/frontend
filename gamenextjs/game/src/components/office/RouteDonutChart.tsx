interface RouteDistribution {
  from_governorate: string;
  to_governorate: string;
  count: number;
}

interface RouteDonutChartProps {
  routes?: RouteDistribution[];
}

const routeColors = [
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#6b7280",
];

export function RouteDonutChart({
  routes = [],
}: RouteDonutChartProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const totalTripsCount = routes.reduce(
    (total, route) => total + Number(route.count),
    0
  );

  let offsetAccumulated = 0;

  const routeStats = routes.map((route, index) => ({
    route:
      route.to_governorate === ""
        ? route.from_governorate
        : `${route.from_governorate} → ${route.to_governorate}`,
    count: Number(route.count),
    color: routeColors[index % routeColors.length],
  }));

  return (
    <div className="rounded-2xl border border-border/10 bg-card p-6">
      <h2 className="mb-6 text-lg font-bold">توزيع الرحلات حسب الوجهة</h2>

      {routeStats.length === 0 ? (
        <div className="flex h-36 items-center justify-center text-sm text-gray-500">
          لا توجد بيانات للرحلات
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="relative h-36 w-36 shrink-0">
            <svg
              viewBox="0 0 140 140"
              className="h-full w-full -rotate-90"
            >
              {routeStats.map((stat) => {
                const fraction =
                  totalTripsCount > 0
                    ? stat.count / totalTripsCount
                    : 0;

                const dash = fraction * circumference;
                const gap = circumference - dash;
                const offset =
                  -offsetAccumulated * circumference;

                offsetAccumulated += fraction;

                return (
                  <circle
                    key={stat.route}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke={stat.color}
                    strokeWidth="16"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={offset}
                  />
                );
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black">
                {totalTripsCount}
              </span>

              <span className="text-xs text-gray-400">
                رحلة
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {routeStats.map((stat) => (
              <div
                key={stat.route}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: stat.color,
                    }}
                  />

                  <span className="text-gray-300">
                    {stat.route}
                  </span>
                </div>

                <span className="font-bold">
                  {stat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}