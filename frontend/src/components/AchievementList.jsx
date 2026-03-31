/**
 * Displays achievement transformation suggestions.
 * Each card shows original vs. suggested bullet, impact score,
 * reasoning, and a coach question with text input.
 *
 * @param {Object} props
 * @param {Array} props.suggestions - List of achievement suggestion objects.
 */

import { useState } from "react";
import BulletItem from "./BulletItem";
import CopyButton from "./CopyButton";

/** @type {string[]} Impact score dot colors (index = score - 1) */
const SCORE_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-500",
];

/**
 * Renders a single achievement suggestion card.
 *
 * @param {Object} props
 * @param {Object} props.suggestion - Achievement suggestion data.
 */
function AchievementCard({ suggestion }) {
  // Local state for coach question answer — not sent to backend
  const [answer, setAnswer] = useState("");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Location badge + impact score */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
            {suggestion.section}
          </span>
          {suggestion.project && (
            <span className="text-xs text-gray-500">{suggestion.project}</span>
          )}
          <span className="text-xs text-gray-400">#{suggestion.bullet_index}</span>
        </div>

        {/* Impact score dots */}
        <div className="flex items-center gap-1" title={suggestion.impact_reason}>
          <span className="text-xs text-gray-500 mr-1">Impact:</span>
          {[1, 2, 3, 4, 5].map((score) => (
            <div
              key={score}
              className={`w-2.5 h-2.5 rounded-full ${
                score <= suggestion.impact_score
                  ? SCORE_COLORS[suggestion.impact_score - 1]
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Original bullet — dimmed */}
        <div className="opacity-50">
          <p className="text-xs font-medium text-gray-500 mb-1">Original</p>
          <BulletItem text={suggestion.original} showCopy={false} />
        </div>

        {/* Suggested bullet — highlighted */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-green-600">Suggested</p>
            <CopyButton text={suggestion.suggested} />
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <BulletItem text={suggestion.suggested} showCopy={false} />
          </div>
        </div>

        {/* Reasoning */}
        <p className="text-xs text-gray-500 italic">{suggestion.reasoning}</p>

        {/* Coach question with input field */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <p className="text-sm text-blue-800 font-medium mb-2">
            {suggestion.coach_question}
          </p>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={suggestion.coach_field_label}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
              bg-white"
          />
        </div>
      </div>
    </div>
  );
}

export default function AchievementList({ suggestions }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No achievement suggestions generated.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, i) => (
        <AchievementCard key={i} suggestion={suggestion} />
      ))}
    </div>
  );
}
