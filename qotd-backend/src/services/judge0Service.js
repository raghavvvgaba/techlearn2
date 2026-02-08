const DEFAULT_RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";
const DEFAULT_BASE_URL = `https://${DEFAULT_RAPIDAPI_HOST}`;

const SUPPORTED_LANGUAGES = {
  python: 71,
  java: 62,
};

function buildHeaders() {
  const headers = { "Content-Type": "application/json" };

  if (process.env.RAPIDAPI_KEY) {
    headers["x-rapidapi-key"] = process.env.RAPIDAPI_KEY;
    headers["x-rapidapi-host"] = process.env.RAPIDAPI_HOST || DEFAULT_RAPIDAPI_HOST;
    return headers;
  }

  if (process.env.JUDGE0_API_KEY) {
    headers.Authorization = `Bearer ${process.env.JUDGE0_API_KEY}`;
    return headers;
  }

  const error = new Error(
    "Code execution provider is not configured. Set RAPIDAPI_KEY or JUDGE0_API_KEY."
  );
  error.statusCode = 503;
  throw error;
}

function getLanguageId(language) {
  const normalizedLanguage = String(language || "").trim().toLowerCase();
  const languageId = SUPPORTED_LANGUAGES[normalizedLanguage];
  if (!languageId) {
    const error = new Error("Unsupported language. Use python or java.");
    error.statusCode = 400;
    throw error;
  }
  return { normalizedLanguage, languageId };
}

async function executeCode({ sourceCode, language, stdin = "" }) {
  const { normalizedLanguage, languageId } = getLanguageId(language);
  const headers = buildHeaders();
  const baseUrl = process.env.JUDGE0_API_BASE_URL || DEFAULT_BASE_URL;
  const endpoint = `${baseUrl}/submissions?base64_encoded=false&wait=true`;

  const payload = {
    language_id: languageId,
    source_code: sourceCode,
    stdin,
  };

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    const error = new Error("Execution provider unreachable");
    error.statusCode = 503;
    throw error;
  }

  if (!response.ok) {
    const bodyText = await response.text();
    const error = new Error(`Execution failed with status ${response.status}: ${bodyText}`);
    error.statusCode = 503;
    throw error;
  }

  const result = await response.json();
  return {
    language: normalizedLanguage,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    compileOutput: result.compile_output || "",
    statusId: result.status?.id || null,
    statusDescription: result.status?.description || "Unknown",
    timeSeconds: result.time ? Number(result.time) : null,
    memoryKb: result.memory ? Number(result.memory) : null,
  };
}

module.exports = {
  SUPPORTED_LANGUAGES,
  executeCode,
};
