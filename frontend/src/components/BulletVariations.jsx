/**
 * Displays a single original bullet alongside its angle variations.
 * Includes a re-run button to regenerate the bullet.
 *
 * @param {Object} props
 * @param {string} props.original - The original bullet text.
 * @param {{angle: string, text: string}[]} props.variations - Angle variations.
 * @param {Function} props.onRegenerate - Callback: (bulletIndex, angle) => void.
 * @param {number} props.bulletIndex - Zero-based index of this bullet.
 * @param {boolean} [props.isRegenerating=false] - Whether regen is in progress.
 */

import BulletItem from "./BulletItem";

/** @type {Record<string, string>} Badge colors per angle type */
const ANGLE_COLORS = {
  tech: "bg-blue-100 text-blue-700",
  impact: "bg-green-100 text-green-700",
  problem: "bg-amber-100 text-amber-700",
  tasks_process: "bg-blue-100 text-blue-700",
  impact_outcomes: "bg-green-100 text-green-700",
};

export default function BulletVariations({
  original,
  variations,
  onRegenerate,
  bulletIndex,
  isRegenerating = false,
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Original bullet — dimmed */}
      <div className="opacity-50">
        <p className="text-xs font-medium text-gray-500 mb-1">Original</p>
        <BulletItem text={original} showCopy={false} />
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Variations with angle badges */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500">Variations</p>

        {variations.map((variation, i) => (
          <div key={i} className="flex items-start gap-2">
            {/* Angle badge */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5
                ${ANGLE_COLORS[variation.angle] || "bg-gray-100 text-gray-700"}`}
            >
              {variation.angle}
            </span>

            {/* Variation bullet */}
            <div className="flex-1">
              <BulletItem text={variation.text} />
            </div>
          </div>
        ))}
      </div>

      {/* Re-run button */}
      <button
        onClick={() => onRegenerate(bulletIndex, "any")}
        disabled={isRegenerating}
        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800
          disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isRegenerating ? (
          <>
            <span className="animate-spin">&#8635;</span>
            Regenerating...
          </>
        ) : (
          <>
            <span>&#8635;</span>
            Re-run this bullet
          </>
        )}
      </button>
    </div>
  );
}
