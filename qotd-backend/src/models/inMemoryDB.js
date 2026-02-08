const DAY_MS = 24 * 60 * 60 * 1000;

const PLAN_LIMITS = {
  free: { runs: 2, submissions: 1 },
  paid: { runs: 4, submissions: 1 },
};

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

function getDateKey(offsetMs = 0) {
  return new Date(Date.now() + offsetMs).toISOString().split("T")[0];
}

const questions = [
  {
    id: "1",
    title: "Two Sum (Indices)",
    difficulty: "Beginner",
    problemStatement:
      "Given an array and target, print the two indices (0-based) whose values sum to target.",
    sampleInput: "4\n2 7 11 15\n9",
    sampleOutput: "0 1",
    hints: ["Use a hash map for O(1) lookups.", "Store value -> index as you iterate."],
    category: "Array",
    date: getDateKey(0),
    officialSolution:
      "Track each number in a hash map. For each num, check if (target-num) already exists.",
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "4\n3 2 4 8\n6", expectedOutput: "1 2" },
      { input: "2\n3 3\n6", expectedOutput: "0 1" },
    ],
  },
  {
    id: "2",
    title: "Min in Rotated Array",
    difficulty: "Intermediate",
    problemStatement:
      "Given a rotated sorted array without duplicates, print the minimum element.",
    sampleInput: "5\n4 5 1 2 3",
    sampleOutput: "1",
    hints: ["Binary search the pivot.", "Compare mid with right boundary."],
    category: "Binary Search",
    date: getDateKey(-DAY_MS),
    officialSolution: "Binary search for inflection point where ordering breaks.",
    testCases: [
      { input: "5\n4 5 1 2 3", expectedOutput: "1" },
      { input: "7\n8 9 10 2 3 4 6", expectedOutput: "2" },
    ],
  },
  {
    id: "3",
    title: "Longest Valid Parentheses Length",
    difficulty: "Advanced",
    problemStatement:
      "Given a parentheses string, print the length of the longest valid parentheses substring.",
    sampleInput: "(()())",
    sampleOutput: "6",
    hints: ["Use stack indexes.", "Track last invalid boundary index."],
    category: "Stack",
    date: getDateKey(-2 * DAY_MS),
    officialSolution: "Maintain index stack; when invalid close appears, reset boundary.",
    testCases: [
      { input: "(()())", expectedOutput: "6" },
      { input: ")()())", expectedOutput: "4" },
    ],
  },
];

const submissions = [];
const usageByDate = {};

function normalizePlan(plan) {
  return String(plan || "free").toLowerCase() === "paid" ? "paid" : "free";
}

function getPlanLimits(plan) {
  return PLAN_LIMITS[normalizePlan(plan)];
}

function ensureUsageRow(userId, dateKey) {
  if (!usageByDate[dateKey]) {
    usageByDate[dateKey] = {};
  }
  if (!usageByDate[dateKey][userId]) {
    usageByDate[dateKey][userId] = { runs: 0, submissions: 0 };
  }
  return usageByDate[dateKey][userId];
}

function getTodaysQuestion() {
  const today = getDateKey();
  return questions.find((q) => q.date === today) || questions[0];
}

function getQuestionById(id) {
  return questions.find((q) => q.id === String(id));
}

function getUsage(userId, plan, dateKey = getDateKey()) {
  const safeUserId = String(userId || "").trim();
  const limits = getPlanLimits(plan);
  if (!safeUserId) {
    return {
      usedRuns: 0,
      usedSubmissions: 0,
      remainingRuns: limits.runs,
      remainingSubmissions: limits.submissions,
      limits,
    };
  }

  const row = ensureUsageRow(safeUserId, dateKey);
  return {
    usedRuns: row.runs,
    usedSubmissions: row.submissions,
    remainingRuns: Math.max(0, limits.runs - row.runs),
    remainingSubmissions: Math.max(0, limits.submissions - row.submissions),
    limits,
  };
}

function canConsume(userId, plan, kind, dateKey = getDateKey()) {
  const usage = getUsage(userId, plan, dateKey);
  if (kind === "run") {
    return usage.remainingRuns > 0;
  }
  if (kind === "submission") {
    return usage.remainingSubmissions > 0;
  }
  return false;
}

function consumeUsage(userId, dateKey = getDateKey(), kind) {
  const row = ensureUsageRow(String(userId), dateKey);
  if (kind === "run") {
    row.runs += 1;
  }
  if (kind === "submission") {
    row.submissions += 1;
  }
}

function addSubmission(submission) {
  submissions.push(submission);
}

function getDailySubmissions(dateKey = getDateKey()) {
  return submissions.filter((submission) => submission.dateKey === dateKey);
}

function getUserSubmissions(userId) {
  return submissions.filter((submission) => submission.userId === String(userId));
}

function getUserDailyLatestSubmission(userId, dateKey = getDateKey()) {
  return submissions
    .filter((submission) => submission.userId === String(userId) && submission.dateKey === dateKey)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
}

function getDailyLeaderboardByDifficulty(dateKey = getDateKey()) {
  const base = {
    Beginner: [],
    Intermediate: [],
    Advanced: [],
  };

  DIFFICULTIES.forEach((difficulty) => {
    const ranked = submissions
      .filter(
        (submission) =>
          submission.dateKey === dateKey &&
          submission.plan === "paid" &&
          submission.isCorrect &&
          submission.difficulty === difficulty &&
          submission.userId
      )
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        if (a.executionTimeMs !== b.executionTimeMs) {
          return a.executionTimeMs - b.executionTimeMs;
        }
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      })
      .slice(0, 10)
      .map((submission, index) => ({
        rank: index + 1,
        userId: submission.userId,
        questionId: submission.questionId,
        score: submission.score,
        executionTimeMs: submission.executionTimeMs,
        submittedAt: submission.submittedAt,
      }));

    base[difficulty] = ranked;
  });

  return base;
}

module.exports = {
  PLAN_LIMITS,
  DIFFICULTIES,
  questions,
  submissions,
  getDateKey,
  normalizePlan,
  getPlanLimits,
  getTodaysQuestion,
  getQuestionById,
  getUsage,
  canConsume,
  consumeUsage,
  addSubmission,
  getDailySubmissions,
  getUserSubmissions,
  getUserDailyLatestSubmission,
  getDailyLeaderboardByDifficulty,
};
