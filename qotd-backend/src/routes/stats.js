const express = require("express");

const router = express.Router();
const { getStatistics, getLeaderboard, getQuestionStats } = require("../controllers/statsController");

router.get("/", getStatistics);
router.get("/leaderboard", getLeaderboard);
router.get("/question/:questionId", getQuestionStats);

module.exports = router;
