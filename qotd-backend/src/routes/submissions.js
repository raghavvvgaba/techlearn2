const express = require("express");

const router = express.Router();
const {
  runUserCode,
  submitSolution,
  getUserSubmissions,
} = require("../controllers/submissionController");

router.post("/run", runUserCode);
router.post("/", submitSolution);
router.get("/user/:userId", getUserSubmissions);

module.exports = router;
