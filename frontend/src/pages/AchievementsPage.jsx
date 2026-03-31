/**
 * Achievements page — paste your full CV, run the transformer, see results.
 * The achievements tool scans the entire CV for achievement opportunities.
 *
 * @param {Object} props
 * @param {Object|null} props.jdData - Parsed JD data.
 * @param {string} props.sectionText - Raw pasted CV text.
 * @param {Object|null} props.results - Achievements tool results.
 * @param {boolean} props.loading - Whether the tool is running.
 * @param {string|null} props.error - Error message if failed.
 * @param {Function} props.dispatch - App state dispatch.
 */

import { useState } from "react";
import AchievementList from "../components/AchievementList";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { runAchievementsTool } from "../api/client";

export default function AchievementsPage({
  jdData,
  sectionText,
  results,
  loading,
  error,
  dispatch,
}) {
  const [text, setText] = useState(sectionText);

  /**
   * Save section text and run the achievements tool.
   */
  async function handleRun() {
    if (!text.trim() || !jdData) return;

    dispatch({ type: "SET_SECTION_TEXT", payload: { key: "achievements", value: text } });
    dispatch({ type: "SET_LOADING", payload: { key: "achievements", value: true } });
    dispatch({ type: "SET_ERROR", payload: { key: "achievements", message: null } });

    const cvData = { full_cv_text: text.trim() };

    try {
      const data = await runAchievementsTool(cvData, jdData);
      dispatch({ type: "SET_RESULTS", payload: { key: "achievements", value: data } });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: { key: "achievements", message: err.message },
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "achievements", value: false } });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Achievement Transformer</h1>
          <p className="text-sm text-gray-500 mt-1">
            Paste your full CV below to find achievement opportunities.
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
          Full CV (paste everything — the tool scans all sections)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your entire CV text here..."
          rows={10}
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

      {loading && <LoadingSpinner message="Analyzing achievements..." />}

      {results && !loading && (
        <AchievementList suggestions={results.suggestions} />
      )}
    </div>
  );
}
