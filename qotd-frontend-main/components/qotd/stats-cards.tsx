import { Target, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    label: "Total Attempts",
    value: "15,234",
    icon: Target,
    change: "+12%",
    positive: true,
  },
  {
    label: "Success Rate",
    value: "68%",
    icon: TrendingUp,
    change: "+5%",
    positive: true,
  },
  {
    label: "Avg. Time",
    value: "12 min",
    icon: Clock,
    change: "-2 min",
    positive: true,
  },
];

export function StatsCards() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Today&apos;s Statistics
      </h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-medium ${
                stat.positive ? "text-success" : "text-destructive"
              }`}
            >
              {stat.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
