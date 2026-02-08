const { executeCode } = require("./judge0Service");

function normalizeOutput(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .trim();
}

async function runCode({ code, language, stdin }) {
  const result = await executeCode({
    sourceCode: code,
    language,
    stdin: stdin || "",
  });

  return {
    ...result,
    executionTimeMs: result.timeSeconds != null ? Math.round(result.timeSeconds * 1000) : null,
  };
}

async function evaluateSubmission({ code, language, testCases }) {
  const safeTestCases = Array.isArray(testCases) ? testCases : [];
  if (!safeTestCases.length) {
    return {
      isCorrect: false,
      score: 0,
      result: "No test cases configured for this question.",
      caseResults: [],
      executionTimeMs: null,
    };
  }

  const caseResults = [];
  let passedCount = 0;
  let totalExecutionTimeMs = 0;
  let executionSampleCount = 0;

  for (let index = 0; index < safeTestCases.length; index += 1) {
    const testCase = safeTestCases[index];
    const execution = await runCode({
      code,
      language,
      stdin: testCase.input || "",
    });

    const actualOutput = normalizeOutput(execution.stdout);
    const expectedOutput = normalizeOutput(testCase.expectedOutput);
    const hasExecutionError = Boolean(execution.stderr || execution.compileOutput);
    const passed = !hasExecutionError && actualOutput === expectedOutput;

    if (passed) {
      passedCount += 1;
    }
    if (execution.executionTimeMs != null) {
      totalExecutionTimeMs += execution.executionTimeMs;
      executionSampleCount += 1;
    }

    caseResults.push({
      caseNumber: index + 1,
      input: testCase.input || "",
      expectedOutput,
      actualOutput,
      passed,
      status: execution.statusDescription,
      stderr: execution.stderr,
      compileOutput: execution.compileOutput,
      executionTimeMs: execution.executionTimeMs,
    });
  }

  const isCorrect = passedCount === safeTestCases.length;
  const score = Math.round((passedCount / safeTestCases.length) * 100);
  const executionTimeMs =
    executionSampleCount > 0 ? Math.round(totalExecutionTimeMs / executionSampleCount) : null;

  return {
    isCorrect,
    score,
    result: isCorrect
      ? `Correct. Passed ${passedCount}/${safeTestCases.length} test cases.`
      : `Incorrect. Passed ${passedCount}/${safeTestCases.length} test cases.`,
    caseResults,
    executionTimeMs,
  };
}

module.exports = {
  runCode,
  evaluateSubmission,
};
