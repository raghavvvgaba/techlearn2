"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/qotd/header";
import { QuestionSection } from "@/components/qotd/question-section";
import { CodeEditor } from "@/components/qotd/code-editor";
import { OutputSection } from "@/components/qotd/output-section";
import { StatsCards } from "@/components/qotd/stats-cards";
import { Leaderboard } from "@/components/qotd/leaderboard";
import { HintSection } from "@/components/qotd/hint-section";
import { SubscribeSection } from "@/components/qotd/subscribe-section";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Plan = "free" | "paid";
type Language = "python" | "java";

interface Question {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  problemStatement: string;
  sampleInput: string;
  sampleOutput: string;
  hints: string[];
  officialSolution?: string;
}

interface UsageState {
  remainingRuns: number;
  remainingSubmissions: number;
}

interface StatsState {
  overall: {
    totalAttempts: number;
    successRate: string;
  };
  today: {
    attempts: number;
    correctToday: number;
  };
}

interface LeaderboardState {
  beginner: Array<{ rank: number; userId: string; score: number; executionTimeMs: number | null }>;
  intermediate: Array<{ rank: number; userId: string; score: number; executionTimeMs: number | null }>;
  advanced: Array<{ rank: number; userId: string; score: number; executionTimeMs: number | null }>;
}

const API_BASE = process.env.NEXT_PUBLIC_QOTD_API_URL || "http://localhost:5000";

const PYTHON_TEMPLATE = `# Read from stdin and print output.
# Example:
# data = input().strip()
# print(data)
`;

const JAVA_TEMPLATE = `import java.io.*;

public class Main {
  public static void main(String[] args) throws Exception {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    // Read input from stdin and print output.
  }
}
`;

function buildTemplate(language: Language) {
  return language === "java" ? JAVA_TEMPLATE : PYTHON_TEMPLATE;
}

function readErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }
  const errorValue = (payload as { error?: string }).error;
  return errorValue || fallback;
}

export default function QOTDPage() {
  const [userId, setUserId] = useState("demo-user");
  const [plan, setPlan] = useState<Plan>("free");
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(buildTemplate("python"));
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [stats, setStats] = useState<StatsState>({
    overall: { totalAttempts: 0, successRate: "0.00%" },
    today: { attempts: 0, correctToday: 0 },
  });
  const [usage, setUsage] = useState<UsageState | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardState>({
    beginner: [],
    intermediate: [],
    advanced: [],
  });
  const [canAppearOnLeaderboard, setCanAppearOnLeaderboard] = useState(false);
  const [latestScore, setLatestScore] = useState<number | null>(null);

  const [output, setOutput] = useState<{
    type: "idle" | "success" | "error" | "running";
    message: string;
  }>({ type: "idle", message: "" });

  const encodedUserId = useMemo(() => encodeURIComponent(userId.trim()), [userId]);

  const fetchQuestion = useCallback(async () => {
    setQuestionLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/questions/today?plan=${plan}&includeSolution=true`,
        { cache: "no-store" }
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(readErrorMessage(payload, "Failed to load question"));
      }
      setQuestion(payload.data as Question);
    } catch (error) {
      setOutput({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to load question",
      });
    } finally {
      setQuestionLoading(false);
    }
  }, [plan]);

  const fetchStatsAndLeaderboard = useCallback(async () => {
    const statsUrl = `${API_BASE}/api/stats?userId=${encodedUserId}&plan=${plan}`;
    const leaderboardUrl = `${API_BASE}/api/stats/leaderboard?userId=${encodedUserId}&plan=${plan}`;

    const [statsResponse, leaderboardResponse] = await Promise.all([
      fetch(statsUrl, { cache: "no-store" }),
      fetch(leaderboardUrl, { cache: "no-store" }),
    ]);

    const statsPayload = await statsResponse.json();
    const leaderboardPayload = await leaderboardResponse.json();

    if (!statsResponse.ok) {
      throw new Error(readErrorMessage(statsPayload, "Failed to load stats"));
    }
    if (!leaderboardResponse.ok) {
      throw new Error(readErrorMessage(leaderboardPayload, "Failed to load leaderboard"));
    }

    setStats({
      overall: {
        totalAttempts: statsPayload.data.overall.totalAttempts,
        successRate: statsPayload.data.overall.successRate,
      },
      today: {
        attempts: statsPayload.data.today.attempts,
        correctToday: statsPayload.data.today.correctToday,
      },
    });

    if (statsPayload.data.viewer?.usage) {
      setUsage({
        remainingRuns: statsPayload.data.viewer.usage.remainingRuns,
        remainingSubmissions: statsPayload.data.viewer.usage.remainingSubmissions,
      });
    }

    setLeaderboard(leaderboardPayload.data.leaderboard as LeaderboardState);
    setCanAppearOnLeaderboard(Boolean(leaderboardPayload.data.viewer?.canAppearOnLeaderboard));
    setLatestScore(leaderboardPayload.data.viewer?.latestScore ?? null);
  }, [encodedUserId, plan]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchQuestion(), fetchStatsAndLeaderboard()]);
  }, [fetchQuestion, fetchStatsAndLeaderboard]);

  useEffect(() => {
    refreshAll().catch((error) => {
      setOutput({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to fetch data",
      });
    });
  }, [refreshAll]);

  const handleLanguageChange = (nextLanguage: string) => {
    const normalized = nextLanguage === "java" ? "java" : "python";
    setLanguage(normalized);
    setCode(buildTemplate(normalized));
  };

  const handleRunCode = async () => {
    if (!question) {
      setOutput({ type: "error", message: "Question is still loading." });
      return;
    }
    if (!userId.trim()) {
      setOutput({ type: "error", message: "Enter a user ID before running code." });
      return;
    }

    setBusy(true);
    setOutput({ type: "running", message: "Running code..." });

    try {
      const response = await fetch(`${API_BASE}/api/submissions/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.trim(),
          plan,
          questionId: question.id,
          language,
          code,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        if (payload.usage) {
          setUsage({
            remainingRuns: payload.usage.remainingRuns,
            remainingSubmissions: payload.usage.remainingSubmissions,
          });
        }
        throw new Error(readErrorMessage(payload, "Run failed"));
      }

      setUsage({
        remainingRuns: payload.usage.remainingRuns,
        remainingSubmissions: payload.usage.remainingSubmissions,
      });

      const lines = [
        `Status: ${payload.data.status}`,
        payload.data.stdout ? `\nSTDOUT:\n${payload.data.stdout}` : "",
        payload.data.stderr ? `\nSTDERR:\n${payload.data.stderr}` : "",
        payload.data.compileOutput ? `\nCOMPILER:\n${payload.data.compileOutput}` : "",
        payload.data.executionTimeMs != null ? `\nTime: ${payload.data.executionTimeMs} ms` : "",
      ]
        .filter(Boolean)
        .join("");

      setOutput({ type: "success", message: lines || "Run completed." });
      await fetchStatsAndLeaderboard();
    } catch (error) {
      setOutput({
        type: "error",
        message: error instanceof Error ? error.message : "Run failed",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async () => {
    if (!question) {
      setOutput({ type: "error", message: "Question is still loading." });
      return;
    }
    if (!userId.trim()) {
      setOutput({ type: "error", message: "Enter a user ID before submitting." });
      return;
    }

    setBusy(true);
    setOutput({ type: "running", message: "Submitting solution..." });

    try {
      const response = await fetch(`${API_BASE}/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.trim(),
          plan,
          questionId: question.id,
          language,
          code,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        if (payload.usage) {
          setUsage({
            remainingRuns: payload.usage.remainingRuns,
            remainingSubmissions: payload.usage.remainingSubmissions,
          });
        }
        throw new Error(readErrorMessage(payload, "Submission failed"));
      }

      setUsage({
        remainingRuns: payload.usage.remainingRuns,
        remainingSubmissions: payload.usage.remainingSubmissions,
      });

      const casePreview = (payload.data.caseResults || [])
        .slice(0, 3)
        .map(
          (caseResult: { caseNumber: number; passed: boolean }) =>
            `Case ${caseResult.caseNumber}: ${caseResult.passed ? "Passed" : "Failed"}`
        )
        .join("\n");

      const message = [
        payload.data.result,
        `Score: ${payload.data.score}`,
        payload.data.executionTimeMs != null ? `Avg Time: ${payload.data.executionTimeMs} ms` : "",
        casePreview ? `\n${casePreview}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      setOutput({ type: payload.data.isCorrect ? "success" : "error", message });
      await fetchStatsAndLeaderboard();
    } catch (error) {
      setOutput({
        type: "error",
        message: error instanceof Error ? error.message : "Submission failed",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header streak={7} />

      <main className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Session</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              className="bg-secondary border-border"
            />
            <Select value={plan} onValueChange={(value) => setPlan(value as Plan)}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={API_BASE}
              readOnly
              className="bg-secondary/40 border-border text-muted-foreground"
              aria-label="Backend API base URL"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <QuestionSection
              question={question}
              todayStats={stats.today}
              loading={questionLoading}
              canViewSolution={plan === "paid"}
            />
            <div className="lg:hidden">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={handleLanguageChange}
                onRun={handleRunCode}
                onSubmit={handleSubmit}
                canRun={(usage?.remainingRuns ?? 0) > 0}
                canSubmit={(usage?.remainingSubmissions ?? 0) > 0}
                isBusy={busy}
                runLabel={`Run (${usage?.remainingRuns ?? 0} left)`}
                submitLabel={`Submit (${usage?.remainingSubmissions ?? 0} left)`}
              />
              <div className="mt-6">
                <OutputSection output={output} />
              </div>
            </div>
            <HintSection hints={question?.hints || []} />
          </div>

          <div className="hidden lg:block space-y-6">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={handleLanguageChange}
              onRun={handleRunCode}
              onSubmit={handleSubmit}
              canRun={(usage?.remainingRuns ?? 0) > 0}
              canSubmit={(usage?.remainingSubmissions ?? 0) > 0}
              isBusy={busy}
              runLabel={`Run (${usage?.remainingRuns ?? 0} left)`}
              submitLabel={`Submit (${usage?.remainingSubmissions ?? 0} left)`}
            />
            <OutputSection output={output} />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCards
            totalAttempts={stats.overall.totalAttempts}
            successRate={stats.overall.successRate}
            todayAttempts={stats.today.attempts}
            todayCorrect={stats.today.correctToday}
            usage={usage}
          />
          <Leaderboard
            data={leaderboard}
            viewer={{
              plan,
              canAppearOnLeaderboard,
              latestScore,
            }}
          />
          <SubscribeSection />
        </div>
      </main>
    </div>
  );
}
