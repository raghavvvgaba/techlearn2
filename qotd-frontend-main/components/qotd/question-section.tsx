import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Users } from "lucide-react";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface QuestionData {
  id: string;
  title: string;
  difficulty: Difficulty;
  problemStatement: string;
  sampleInput: string;
  sampleOutput: string;
  officialSolution?: string;
}

interface TodayStats {
  attempts: number;
  correctToday: number;
}

interface QuestionSectionProps {
  question: QuestionData | null;
  todayStats: TodayStats;
  loading?: boolean;
  canViewSolution: boolean;
}

const difficultyColors: Record<Difficulty, string> = {
  Beginner: "bg-success/20 text-success border-success/30",
  Intermediate: "bg-warning/20 text-warning border-warning/30",
  Advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

export function QuestionSection({
  question,
  todayStats,
  loading = false,
  canViewSolution,
}: QuestionSectionProps) {
  if (loading || !question) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <p className="text-sm text-muted-foreground">Loading today&apos;s question...</p>
      </div>
    );
  }

  const successRate =
    todayStats.attempts > 0
      ? Math.round((todayStats.correctToday / todayStats.attempts) * 100)
      : 0;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            {question.id}. {question.title}
          </h2>
          <Badge variant="outline" className={difficultyColors[question.difficulty]}>
            {question.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{todayStats.attempts}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successRate}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Today</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Problem Statement</p>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {question.problemStatement}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <p className="text-xs uppercase tracking-wide text-foreground/70 mb-2">Sample Input</p>
            <pre className="font-mono text-sm text-muted-foreground whitespace-pre-wrap">
              {question.sampleInput}
            </pre>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <p className="text-xs uppercase tracking-wide text-foreground/70 mb-2">Sample Output</p>
            <pre className="font-mono text-sm text-muted-foreground whitespace-pre-wrap">
              {question.sampleOutput}
            </pre>
          </div>
        </div>

        {canViewSolution && question.officialSolution ? (
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
            <p className="text-xs uppercase tracking-wide text-primary mb-2">Official Solution</p>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {question.officialSolution}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
