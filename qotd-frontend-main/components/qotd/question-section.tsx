import { Badge } from "@/components/ui/badge";
import { Clock, Users, CheckCircle2 } from "lucide-react";

const questionData = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy" as const,
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: null,
    },
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  stats: {
    attempts: 15234,
    successRate: 68,
    avgTime: "12 min",
  },
};

const difficultyColors = {
  Easy: "bg-success/20 text-success border-success/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  Hard: "bg-destructive/20 text-destructive border-destructive/30",
};

export function QuestionSection() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            {questionData.id}. {questionData.title}
          </h2>
          <Badge
            variant="outline"
            className={difficultyColors[questionData.difficulty]}
          >
            {questionData.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{questionData.stats.attempts.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{questionData.stats.successRate}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{questionData.stats.avgTime}</span>
          </div>
        </div>
      </div>

      <div className="prose prose-invert prose-sm max-w-none">
        <div className="text-foreground/90 leading-relaxed whitespace-pre-line">
          {questionData.description.split("`").map((part, i) =>
            i % 2 === 1 ? (
              <code
                key={i}
                className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm"
              >
                {part}
              </code>
            ) : (
              <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            )
          )}
        </div>

        <div className="mt-6 space-y-4">
          {questionData.examples.map((example, idx) => (
            <div
              key={idx}
              className="bg-secondary/50 rounded-lg p-4 border border-border"
            >
              <p className="text-sm font-medium text-foreground mb-2">
                Example {idx + 1}:
              </p>
              <div className="font-mono text-sm space-y-1">
                <p className="text-muted-foreground">
                  <span className="text-foreground/70">Input:</span>{" "}
                  {example.input}
                </p>
                <p className="text-muted-foreground">
                  <span className="text-foreground/70">Output:</span>{" "}
                  {example.output}
                </p>
                {example.explanation && (
                  <p className="text-muted-foreground">
                    <span className="text-foreground/70">Explanation:</span>{" "}
                    {example.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-foreground mb-2">Constraints:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {questionData.constraints.map((constraint, idx) => (
              <li key={idx} className="font-mono">
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
