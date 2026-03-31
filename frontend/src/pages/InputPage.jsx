/**
 * Input page — just the Job Description textarea.
 * JD is parsed once here and shared across all tool pages.
 *
 * @param {Object} props
 * @param {Function} props.dispatch - App state dispatch function.
 * @param {Object|null} props.jdData - Current parsed JD data.
 * @param {string} props.jdText - Current raw JD text.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseJd } from "../api/client";

export default function InputPage({ dispatch, jdData, jdText }) {
  const [text, setText] = useState(jdText);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Parse the JD text and save to state, then navigate to projects.
   */
  async function handleSave() {
    if (!text.trim()) {
      setError("Please paste a job description.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const jdData = await parseJd(text.trim());
      dispatch({ type: "SET_JD_DATA", payload: jdData });
      dispatch({ type: "SET_JD_TEXT", payload: text.trim() });
      navigate("/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Description</h1>
        <p className="text-sm text-gray-500 mt-1">
          Paste the job description here. It will be used across all tools for tailoring.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            min-h-[200px]"
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl
            hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors shadow-sm"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </button>

        {jdData && (
          <p className="text-xs text-green-600 text-center">
            JD saved — {jdData.keywords.length} keywords extracted.
          </p>
        )}
      </div>
    </div>
  );
}
