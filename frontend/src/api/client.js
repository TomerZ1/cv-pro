/**
 * API client for CV Pro backend.
 * All fetch calls to the backend go through this module.
 * Uses the Vite proxy in dev (/api → localhost:8000).
 */

/** @type {string} Base URL for API calls — empty string uses the Vite proxy */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Generic fetch wrapper with error handling.
 *
 * @param {string} path - API path (e.g. "/api/parse-jd").
 * @param {RequestInit} options - Fetch options.
 * @returns {Promise<Object>} Parsed JSON response.
 * @throws {Error} With backend error message if response is not ok.
 */
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;

  // Default to JSON content type unless already set (e.g. FormData)
  if (options.body && !(options.body instanceof FormData)) {
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Parse a job description and extract keywords.
 *
 * @param {string} text - Raw job description text.
 * @returns {Promise<{raw_text: string, keywords: string[]}>} Parsed JD data.
 */
export async function parseJd(text) {
  return request("/api/parse-jd", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

/**
 * Run the Projects rewriting tool (Tool 1).
 *
 * @param {Object} cvData - Structured CV data from input boxes.
 * @param {Object} jdData - Parsed JD data with raw_text and keywords.
 * @returns {Promise<{projects: Object, suggestions: string[]}>} Rewritten projects.
 */
export async function runProjectsTool(cvData, jdData) {
  return request("/api/tools/projects", {
    method: "POST",
    body: JSON.stringify({ cv_data: cvData, jd_data: jdData }),
  });
}

/**
 * Regenerate a single bullet with a specific angle.
 *
 * @param {Object} payload - Regeneration request with section, project, bullet_index, etc.
 * @returns {Promise<{new_bullet: string}>} The regenerated bullet.
 */
export async function regenerateBullet(payload) {
  return request("/api/regenerate-bullet", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Run the Skills rewriting tool (Tool 2).
 *
 * @param {Object} cvData - Structured CV data.
 * @param {Object} jdData - Parsed JD data.
 * @returns {Promise<Object>} Rewritten skills categories.
 */
export async function runSkillsTool(cvData, jdData) {
  return request("/api/tools/skills", {
    method: "POST",
    body: JSON.stringify({ cv_data: cvData, jd_data: jdData }),
  });
}

/**
 * Run the Profile generator tool (Tool 3).
 *
 * @param {Object} cvData - Structured CV data.
 * @param {Object} jdData - Parsed JD data.
 * @returns {Promise<Object>} Two profile versions.
 */
export async function runProfileTool(cvData, jdData) {
  return request("/api/tools/profile", {
    method: "POST",
    body: JSON.stringify({ cv_data: cvData, jd_data: jdData }),
  });
}

/**
 * Run the Achievement transformer tool (Tool 4).
 *
 * @param {Object} cvData - Structured CV data.
 * @param {Object} jdData - Parsed JD data.
 * @returns {Promise<Object>} Achievement suggestions.
 */
export async function runAchievementsTool(cvData, jdData) {
  return request("/api/tools/achievements", {
    method: "POST",
    body: JSON.stringify({ cv_data: cvData, jd_data: jdData }),
  });
}
