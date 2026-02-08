const db = require("../models/inMemoryDB");

function sanitizeQuestion(question, includeSolution = false) {
  const { testCases, ...safeQuestion } = question;
  if (!includeSolution) {
    const { officialSolution, ...withoutSolution } = safeQuestion;
    return withoutSolution;
  }
  return safeQuestion;
}

function shouldIncludeSolution(req) {
  const includeSolution = String(req.query.includeSolution || "").toLowerCase() === "true";
  const plan = db.normalizePlan(req.query.plan);
  return includeSolution && plan === "paid";
}

exports.getTodaysQuestion = (req, res) => {
  try {
    const question = db.getTodaysQuestion();
    const includeSolution = shouldIncludeSolution(req);

    res.status(200).json({
      success: true,
      data: sanitizeQuestion(question, includeSolution),
      hintCount: Array.isArray(question.hints) ? question.hints.length : 0,
      date: db.getDateKey(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch question",
    });
  }
};

exports.getQuestionById = (req, res) => {
  try {
    const question = db.getQuestionById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    const includeSolution = shouldIncludeSolution(req);
    return res.status(200).json({
      success: true,
      data: sanitizeQuestion(question, includeSolution),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch question",
    });
  }
};
