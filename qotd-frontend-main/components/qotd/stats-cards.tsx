import { Clock, Target, TrendingUp } from "lucide-react";

interface Usage {
  remainingRuns: number;
  remainingSubmissions: number;
}

interface StatsCardsProps {
  totalAttempts: number;
  successRate: string;
  todayAttempts: number;
  todayCorrect: number;
  usage: Usage | null;
}

export function StatsCards({
  totalAttempts,
  successRate,
  todayAttempts,
  todayCorrect,
  usage,
}: StatsCardsProps) {
  const cards = [
    {
      label: "Total Attempts",
      value: String(totalAttempts),
      icon: Target,
      helper: `Today: ${todayAttempts}`,
    },
    {
      label: "Success Rate",
      value: successRate,
      icon: TrendingUp,
      helper: `Correct today: ${todayCorrect}`,
    },
    {
      label: "Remaining Runs",
      value: usage ? String(usage.remainingRuns) : "-",
      icon: Clock,
      helper: usage ? `Submissions left: ${usage.remainingSubmissions}` : "Login required",
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Today&apos;s Statistics</h3>
      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <card.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-lg font-semibold text-foreground">{card.value}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{card.helper}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
