import { Medal, Trophy } from "lucide-react";

interface LeaderboardRow {
  rank: number;
  userId: string;
  score: number;
  executionTimeMs: number | null;
}

interface LeaderboardData {
  beginner: LeaderboardRow[];
  intermediate: LeaderboardRow[];
  advanced: LeaderboardRow[];
}

interface ViewerData {
  plan: "free" | "paid";
  canAppearOnLeaderboard: boolean;
  latestScore: number | null;
}

interface LeaderboardProps {
  data: LeaderboardData;
  viewer: ViewerData;
}

const sectionOrder: Array<keyof LeaderboardData> = ["beginner", "intermediate", "advanced"];

const sectionTitle: Record<keyof LeaderboardData, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const getRankIcon = (rank: number) => {
  if (rank === 1) {
    return <Trophy className="w-4 h-4 text-warning" />;
  }
  if (rank <= 3) {
    return <Medal className="w-4 h-4 text-muted-foreground" />;
  }
  return (
    <span className="w-4 h-4 text-xs text-muted-foreground font-medium flex items-center justify-center">
      {rank}
    </span>
  );
};

export function Leaderboard({ data, viewer }: LeaderboardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-warning" />
        Daily Leaderboard
      </h3>
      {!viewer.canAppearOnLeaderboard ? (
        <p className="text-xs text-muted-foreground mb-4">
          Free users can view score but do not appear on leaderboard.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground mb-4">
          Your latest score: {viewer.latestScore ?? "No submission yet"}
        </p>
      )}

      <div className="space-y-4">
        {sectionOrder.map((section) => (
          <div key={section}>
            <p className="text-xs uppercase tracking-wide text-foreground/70 mb-2">
              {sectionTitle[section]}
            </p>
            {!data[section].length ? (
              <p className="text-xs text-muted-foreground">No entries yet.</p>
            ) : (
              <div className="space-y-2">
                {data[section].map((row) => (
                  <div
                    key={`${section}-${row.rank}-${row.userId}`}
                    className="flex items-center justify-between p-2 rounded-lg border bg-secondary/50 border-border"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 flex items-center justify-center">{getRankIcon(row.rank)}</div>
                      <span className="text-xs text-foreground">{row.userId}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {row.score} pts | {row.executionTimeMs ?? "-"} ms
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
