/**
 * Skills page — paste your skills section, run the rewriter, see results.
 *
 * @param {Object} props
 * @param {Object|null} props.jdData - Parsed JD data.
 * @param {string} props.sectionText - Raw pasted skills text.
 * @param {Object|null} props.results - Skills tool results.
 * @param {boolean} props.loading - Whether the tool is running.
 * @param {string|null} props.error - Error message if failed.
 * @param {Function} props.dispatch - App state dispatch.
 */

import { useState } from "react";
import SkillsEditor from "../components/SkillsEditor";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PromptDebugBox from "../components/PromptDebugBox";
import { runSkillsTool } from "../api/client";

export default function SkillsPage({
  jdData,
  sectionText,
  results,
  loading,
  error,
  dispatch,
}) {
  const [text, setText] = useState(sectionText);

  /**
   * Save section text and run the skills tool.
   */
  async function handleRun() {
    if (!text.trim() || !jdData) return;

    dispatch({ type: "SET_SECTION_TEXT", payload: { key: "skills", value: text } });
    dispatch({ type: "SET_LOADING", payload: { key: "skills", value: true } });
    dispatch({ type: "SET_ERROR", payload: { key: "skills", message: null } });

    const cvData = { skills_text: text.trim() };

    try {
      const data = await runSkillsTool(cvData, jdData);
      dispatch({ type: "SET_RESULTS", payload: { key: "skills", value: data } });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: { key: "skills", message: err.message },
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "skills", value: false } });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skills Rewriter</h1>
          <p className="text-sm text-gray-500 mt-1">
            Paste your skills section below, then click Run.
          </p>
        </div>
        <button
          onClick={handleRun}
          disabled={loading || !text.trim() || !jdData}
          className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg
            hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors shadow-sm"
        >
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      {/* Section input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills & Tools (paste from your CV)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Languages & Frameworks: Python, TypeScript, C, Java, FastAPI, React\nTools: Docker, Git, VS Code, Linux"}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {!jdData && (
          <p className="text-xs text-amber-600 mt-2">
            Please save a Job Description on the Input page first.
          </p>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={handleRun} />}

      {loading && <LoadingSpinner message="Reorganizing skills..." />}

      {results && !loading && <PromptDebugBox debug={results.debug} />}

      {results && !loading && (
        <div className="mt-6">
          <SkillsEditor
            categories={results.categories}
            recommendations={results.recommendations}
          />
        </div>
      )}
    </div>
  );
}
