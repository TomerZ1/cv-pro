/**
 * Projects page — paste your projects section, run the rewriter, see results.
 * Claude returns Version A (Tasks & Process) and Version B (Impact & Outcomes)
 * bullets for each project found in the pasted text.
 *
 * @param {Object} props
 * @param {Object|null} props.jdData - Parsed JD data.
 * @param {string} props.sectionText - Raw pasted projects text.
 * @param {Object|null} props.results - Projects tool results.
 * @param {boolean} props.loading - Whether the tool is running.
 * @param {string|null} props.error - Error message if failed.
 * @param {Function} props.dispatch - App state dispatch.
 */

import { useState } from "react";
import ProjectCard from "../components/ProjectCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PromptDebugBox from "../components/PromptDebugBox";
import { runProjectsTool } from "../api/client";

export default function ProjectsPage({
  jdData,
  sectionText,
  results,
  loading,
  error,
  dispatch,
}) {
  const [text, setText] = useState(sectionText);

  /**
   * Save section text to state and run the projects tool.
   */
  async function handleRun() {
    if (!text.trim() || !jdData) return;

    dispatch({ type: "SET_SECTION_TEXT", payload: { key: "projects", value: text } });
    dispatch({ type: "SET_LOADING", payload: { key: "projects", value: true } });
    dispatch({ type: "SET_ERROR", payload: { key: "projects", message: null } });

    const cvData = { projects_text: text.trim() };

    try {
      const data = await runProjectsTool(cvData, jdData);
      dispatch({ type: "SET_RESULTS", payload: { key: "projects", value: data } });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: { key: "projects", message: err.message },
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "projects", value: false } });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Bullet Rewriter</h1>
          <p className="text-sm text-gray-500 mt-1">
            Paste your projects section below, then click Run.
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
          Projects (paste from your CV)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"ThinkRoom | Full Stack\n• Built a real-time tutoring platform using React and Python...\n• Implemented WebSocket-based live collaboration...\n\nSymNMF Clustering | Tel-Aviv University\n• Developed a clustering algorithm..."}
          rows={8}
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

      {loading && <LoadingSpinner message="Rewriting project bullets..." />}

      {results && !loading && <PromptDebugBox debug={results.debug} />}

      {results && !loading && (
        <div className="space-y-6 mt-6">
          {results.projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}

          {results.suggestions && results.suggestions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-semibold text-amber-800 mb-2">Suggestions</h3>
              <ul className="space-y-1">
                {results.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm text-amber-700">
                    &bull; {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
