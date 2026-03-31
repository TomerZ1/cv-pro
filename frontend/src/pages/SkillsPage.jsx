/**
 * Skills page — runs the Skills Rewriter (Tool 2) and displays results.
 *
 * @param {Object} props
 * @param {Object|null} props.cvData - Structured CV data.
 * @param {Object|null} props.jdData - Parsed JD data.
 * @param {Object|null} props.results - Skills tool results.
 * @param {boolean} props.loading - Whether the tool is running.
 * @param {string|null} props.error - Error message if failed.
 * @param {Function} props.dispatch - App state dispatch.
 */

import SkillsEditor from "../components/SkillsEditor";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { runSkillsTool } from "../api/client";

export default function SkillsPage({
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
   * Run the skills tool and store results.
   */
  async function handleRun() {
    dispatch({ type: "SET_LOADING", payload: { key: "skills", value: true } });
    dispatch({ type: "SET_ERROR", payload: { key: "skills", message: null } });

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
            Reorganizes your skills section to match the job description.
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

      {error && <ErrorMessage message={error} onRetry={handleRun} />}

      {loading && <LoadingSpinner message="Reorganizing skills..." />}

      {results && !loading && (
        <SkillsEditor original={results.original} rewritten={results.rewritten} />
      )}
    </div>
  );
}
