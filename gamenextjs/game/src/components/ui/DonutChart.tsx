interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerLabel: string;
}

export function DonutChart({ segments, centerLabel }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  return (
    <div className="flex items-center gap-8">
      <div className="relative h-[180px] w-[180px] shrink-0">
        <svg viewBox="0 0 180 180" className="-rotate-90">
          {segments.map((segment, i) => {
            const length = (segment.value / total) * circumference;
            const dashArray = `${length} ${circumference - length}`;
            const dashOffset = -cumulativeOffset;
            cumulativeOffset += length;

            return (
              <circle
                key={i}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black">{total}</span>
          <span className="text-xs text-gray-400">{centerLabel}</span>
        </div>
      </div>

      <div className="space-y-3">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-gray-300">{segment.value} {segment.label}</span>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
          </div>
        ))}
      </div>
    </div>
  );
}