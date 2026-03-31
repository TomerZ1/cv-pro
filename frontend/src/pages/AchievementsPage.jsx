/**
 * Achievements page — runs the Achievement Transformer (Tool 4) and displays results.
 *
 * @param {Object} props
 * @param {Object|null} props.cvData - Structured CV data.
 * @param {Object|null} props.jdData - Parsed JD data.
 * @param {Object|null} props.results - Achievements tool results.
 * @param {boolean} props.loading - Whether the tool is running.
 * @param {string|null} props.error - Error message if failed.
 * @param {Function} props.dispatch - App state dispatch.
 */

import AchievementList from "../components/AchievementList";
import { runAchievementsTool } from "../api/client";

export default function AchievementsPage({
  cvData,
  jdData,
  results,
  loading,
  error,
  dispatch,
}) {
  if (!cvData || !jdData) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Please input your CV and Job Description first.</p>
        <p className="text-sm mt-1">Go to the Input page to get started.</p>
      </div>
    );
  }

  /**
   * Run the achievements tool and store results.
   */
  async function handleRun() {
    dispatch({ type: "SET_LOADING", payload: { key: "achievements", value: true } });
    dispatch({ type: "SET_ERROR", payload: { key: "achievements", message: null } });

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
            Finds achievement opportunities across your entire CV.
          </p>
        </div>
        <button
          onClick={handleRun}
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg
            hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors shadow-sm"
        >
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin text-4xl text-indigo-500 mb-3">&#8635;</div>
          <p className="text-gray-500">Analyzing achievements...</p>
        </div>
      )}

      {results && !loading && (
        <AchievementList suggestions={results.suggestions} />
      )}
    </div>
  );
}
