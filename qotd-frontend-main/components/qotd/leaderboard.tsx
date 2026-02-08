import { Trophy, Medal } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Sarah Chen", time: "3:24", score: 100 },
  { rank: 2, name: "Alex Kumar", time: "4:12", score: 98 },
  { rank: 3, name: "Jordan Lee", time: "5:01", score: 95 },
  { rank: 4, name: "Taylor Swift", time: "5:45", score: 92 },
  { rank: 5, name: "Morgan Davis", time: "6:18", score: 90 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-4 h-4 text-warning" />;
  if (rank <= 3) return <Medal className="w-4 h-4 text-muted-foreground" />;
  return (
    <span className="w-4 h-4 text-xs text-muted-foreground font-medium flex items-center justify-center">
      {rank}
    </span>
  );
};

export function Leaderboard() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-warning" />
        Top Solvers Today
      </h3>
      <div className="space-y-2">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              user.rank === 1
                ? "bg-primary/10 border-primary/30"
                : "bg-secondary/50 border-border hover:bg-secondary"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 flex items-center justify-center">
                {getRankIcon(user.rank)}
              </div>
              <span
                className={`text-sm ${
                  user.rank === 1
                    ? "font-semibold text-foreground"
                    : "text-foreground/90"
                }`}
              >
                {user.name}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground font-mono">
                {user.time}
              </span>
              <span className="text-primary font-medium w-8 text-right">
                {user.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
