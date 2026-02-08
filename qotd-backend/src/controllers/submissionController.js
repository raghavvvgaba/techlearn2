const db = require("../models/inMemoryDB");
const { runCode, evaluateSubmission } = require("../services/evaluationService");

function getQuestion(questionId) {
  if (questionId) {
    return db.getQuestionById(questionId);
  }
  return db.getTodaysQuestion();
}

function sanitizeSubmission(submission) {
  const { code, ...safeSubmission } = submission;
  return safeSubmission;
}

function buildUsagePayload(userId, plan) {
  const usage = db.getUsage(userId, plan, db.getDateKey());
  return {
    limits: usage.limits,
    usedRuns: usage.usedRuns,
    usedSubmissions: usage.usedSubmissions,
    remainingRuns: usage.remainingRuns,
    remainingSubmissions: usage.remainingSubmissions,
  };
}

exports.runUserCode = async (req, res) => {
  try {
    const { userId, plan = "free", questionId, code, language, stdin } = req.body;
    const normalizedPlan = db.normalizePlan(plan);

    if (!userId || !code || !language) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, code, language",
      });
    }

    if (!db.canConsume(userId, normalizedPlan, "run")) {
      return res.status(429).json({
        success: false,
        error: "Daily run limit reached for your plan.",
        usage: buildUsagePayload(userId, normalizedPlan),
      });
    }

    const question = getQuestion(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    const execution = await runCode({
      code,
      language,
      stdin: stdin || question.sampleInput,
    });

    db.consumeUsage(userId, db.getDateKey(), "run");

    return res.status(200).json({
      success: true,
      data: {
        status: execution.statusDescription,
        stdout: execution.stdout,
        stderr: execution.stderr,
        compileOutput: execution.compileOutput,
        executionTimeMs: execution.executionTimeMs,
        memoryKb: execution.memoryKb,
      },
      usage: buildUsagePayload(userId, normalizedPlan),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Code run failed",
    });
  }
};

exports.submitSolution = async (req, res) => {
  try {
    const { userId, plan = "free", questionId, code, language } = req.body;
    const normalizedPlan = db.normalizePlan(plan);

    if (!userId || !questionId || !code || !language) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, questionId, code, language",
      });
    }

    if (!db.canConsume(userId, normalizedPlan, "submission")) {
      return res.status(429).json({
        success: false,
        error: "Daily submission limit reached for your plan.",
        usage: buildUsagePayload(userId, normalizedPlan),
      });
    }

    const question = db.getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    const evaluation = await evaluateSubmission({
      code,
      language,
      testCases: question.testCases,
    });

    const nowIso = new Date().toISOString();
    const submission = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: String(userId),
      plan: normalizedPlan,
      questionId: String(question.id),
      difficulty: question.difficulty,
      language: String(language).toLowerCase(),
      code,
      isCorrect: evaluation.isCorrect,
      score: evaluation.score,
      result: evaluation.result,
      caseResults: evaluation.caseResults,
      executionTimeMs: evaluation.executionTimeMs,
      submittedAt: nowIso,
      dateKey: db.getDateKey(),
    };

    db.addSubmission(submission);
    db.consumeUsage(userId, db.getDateKey(), "submission");

    return res.status(201).json({
      success: true,
      data: sanitizeSubmission(submission),
      usage: buildUsagePayload(userId, normalizedPlan),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Submission failed",
    });
  }
};

exports.getUserSubmissions = (req, res) => {
  try {
    const { userId } = req.params;
    const includeCode = String(req.query.includeCode || "").toLowerCase() === "true";
    const allUserSubmissions = db.getUserSubmissions(userId);
    const data = includeCode
      ? allUserSubmissions
      : allUserSubmissions.map((submission) => sanitizeSubmission(submission));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch submissions",
    });
  }
};
