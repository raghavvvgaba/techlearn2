const express = require("express");

const router = express.Router();
const { getTodaysQuestion, getQuestionById } = require("../controllers/questionController");

router.get("/today", getTodaysQuestion);
router.get("/:id", getQuestionById);

module.exports = router;
