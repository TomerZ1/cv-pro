/**
 * Projects page — runs the Project Bullet Rewriter (Tool 1) and displays results.
 * Includes per-bullet re-run functionality.
 *
 * @param {Object} props
 * @param {Object|null} props.cvData - Structured CV data from input.
 * @param {Object|null} props.jdData - Parsed JD data with raw_text and keywords.
 * @param {Object|null} props.results - Projects tool results from state.
 * @param {boolean} props.loading - Whether the tool is currently running.
 * @param {string|null} props.error - Error message if the tool failed.
 * @param {Function} props.dispatch - App state dispatch function.
 */

import { useState } from "react";
import ProjectCard from "../components/ProjectCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { runProjectsTool, regenerateBullet } from "../api/client";

export default function ProjectsPage({
  cvData,
  jdData,
  results,
  loading,
  error,
  dispatch,
}) {
  // Track which bullets are currently regenerating
  const [regeneratingBullets, setRegeneratingBullets] = useState(new Set());

  // Guard: need input data first
  if (!cvData || !jdData) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Please input your CV and Job Description first.</p>
        <p className="text-sm mt-1">Go to the Input page to get started.</p>
      </div>
    );
  }

  /**
   * Run the projects tool and store results.
   */
  async function handleRun() {
    dispatch({ type: "SET_LOADING", payload: { key: "projects", value: true } });
    dispatch({ type: "SET_ERROR", payload: { key: "projects", message: null } });

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

  /**
   * Regenerate a single bullet with the given angle.
   *
   * @param {string} projectKey - Project identifier.
   * @param {number} bulletIndex - Zero-based bullet index.
   * @param {string} angle - Requested angle.
   */
  async function handleRegenerate(projectKey, bulletIndex, angle) {
    const regenKey = `${projectKey}-${bulletIndex}`;
    setRegeneratingBullets((prev) => new Set(prev).add(regenKey));

    try {
      const project = results.projects[projectKey];
      const bullet = project.bullets[bulletIndex];

      const response = await regenerateBullet({
        section: "projects",
        project: projectKey,
        bullet_index: bulletIndex,
        current_bullet: bullet.original,
        other_bullets: project.bullets
          .filter((_, i) => i !== bulletIndex)
          .map((b) => b.original),
        angle,
        cv_data: cvData,
        jd_data: jdData,
      });

      // Update the bullet's variations with the new one
      dispatch({
        type: "UPDATE_BULLET",
        payload: {
          projectKey,
          bulletIndex,
          newVariation: { angle, text: response.new_bullet },
        },
      });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: { key: "projects", message: `Regen failed: ${err.message}` },
      });
    } finally {
      setRegeneratingBullets((prev) => {
        const next = new Set(prev);
        next.delete(regenKey);
        return next;
      });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Bullet Rewriter</h1>
          <p className="text-sm text-gray-500 mt-1">
            Rewrites each project bullet with angle variations tailored to the JD.
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

      {loading && <LoadingSpinner message="Rewriting project bullets..." />}

      {/* Results */}
      {results && !loading && (
        <div className="space-y-6">
          {Object.entries(results.projects).map(([key, project]) => (
            <ProjectCard
              key={key}
              projectKey={key}
              project={project}
              onRegenerate={handleRegenerate}
              regeneratingBullets={regeneratingBullets}
            />
          ))}

          {/* Suggestions section */}
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
