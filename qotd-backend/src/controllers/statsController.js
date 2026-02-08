const db = require("../models/inMemoryDB");

exports.getStatistics = (req, res) => {
  try {
    const todayQuestion = db.getTodaysQuestion();
    const todayDate = db.getDateKey();
    const todaySubmissions = db.getDailySubmissions(todayDate);
    const totalSubmissions = db.submissions;
    const userId = req.query.userId;
    const plan = db.normalizePlan(req.query.plan);

    const overallAttempts = totalSubmissions.length;
    const overallCorrect = totalSubmissions.filter((submission) => submission.isCorrect).length;

    const responseData = {
      overall: {
        totalAttempts: overallAttempts,
        correctSubmissions: overallCorrect,
        successRate: overallAttempts ? `${((overallCorrect / overallAttempts) * 100).toFixed(2)}%` : "0.00%",
      },
      today: {
        date: todayDate,
        questionId: todayQuestion.id,
        title: todayQuestion.title,
        difficulty: todayQuestion.difficulty,
        attempts: todaySubmissions.length,
        correctToday: todaySubmissions.filter((submission) => submission.isCorrect).length,
      },
    };

    if (userId) {
      responseData.viewer = {
        userId: String(userId),
        plan,
        usage: db.getUsage(String(userId), plan, todayDate),
        latestSubmission: db.getUserDailyLatestSubmission(String(userId), todayDate) || null,
      };
    }

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    });
  }
};

exports.getLeaderboard = (req, res) => {
  try {
    const date = db.getDateKey();
    const userId = req.query.userId ? String(req.query.userId) : null;
    const plan = db.normalizePlan(req.query.plan);
    const viewerLatestSubmission = userId ? db.getUserDailyLatestSubmission(userId, date) : null;
    const leaderboard = db.getDailyLeaderboardByDifficulty(date);

    return res.status(200).json({
      success: true,
      data: {
        date,
        leaderboard: {
          beginner: leaderboard.Beginner,
          intermediate: leaderboard.Intermediate,
          advanced: leaderboard.Advanced,
        },
        viewer: {
          userId,
          plan,
          canAppearOnLeaderboard: Boolean(userId && plan === "paid"),
          latestScore: viewerLatestSubmission ? viewerLatestSubmission.score : null,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch leaderboard",
    });
  }
};

exports.getQuestionStats = (req, res) => {
  try {
    const { questionId } = req.params;
    const question = db.getQuestionById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    const questionSubmissions = db.submissions.filter(
      (submission) => submission.questionId === String(questionId)
    );

    const avgExecutionTime =
      questionSubmissions.length > 0
        ? Math.round(
            questionSubmissions.reduce(
              (acc, submission) => acc + (submission.executionTimeMs || 0),
              0
            ) / questionSubmissions.length
          )
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        questionId: String(questionId),
        totalAttempts: questionSubmissions.length,
        correctAttempts: questionSubmissions.filter((submission) => submission.isCorrect).length,
        averageExecutionTimeMs: avgExecutionTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch question statistics",
    });
  }
};
