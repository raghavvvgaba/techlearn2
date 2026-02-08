const express = require("express");
const cors = require("cors");
require("dotenv").config();

const questionRoutes = require("./src/routes/questions");
const submissionRoutes = require("./src/routes/submissions");
const statsRoutes = require("./src/routes/stats");

const app = express();

const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 120);
const requestWindowByIp = new Map();

function basicRateLimit(req, res, next) {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();
  const existing = requestWindowByIp.get(ip);

  if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    requestWindowByIp.set(ip, { windowStart: now, count: 1 });
    return next();
  }

  existing.count += 1;
  if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please retry shortly.",
    });
  }

  return next();
}

app.use(cors());
app.use(express.json({ limit: "200kb" }));
app.use(basicRateLimit);

app.get("/", (req, res) => {
  res.json({
    message: "QOTD API is running",
    endpoints: [
      "GET /api/health",
      "GET /api/questions/today",
      "POST /api/submissions/run",
      "POST /api/submissions",
      "GET /api/submissions/user/:userId",
      "GET /api/stats",
      "GET /api/stats/leaderboard",
    ],
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/questions", questionRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/stats", statsRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const server = app.listen(PORT, HOST, () => {
  const address = server.address();
  console.log("=========================================");
  console.log("QOTD backend started");
  console.log(`Port: ${address.port}`);
  console.log(`Host: ${HOST}`);
  console.log("=========================================");
});

module.exports = app;
