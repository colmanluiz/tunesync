import { IconType } from "react-icons/lib";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: IconType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-semibold">{value}</div>
            {trend && (
              <span
                className={`ml-2 text-sm ${
                  trend.isPositive
                    ? "text-(--jonquil-600)"
                    : "text-(--honeysuckle-600)"
                }`}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <div className="mt-1 text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>
        <div className="rounded-full bg-(--honeysuckle-100) p-3">
          <Icon className="size-5 text-(--honeysuckle-950)" />
        </div>
      </div>
    </div>
  );
}
