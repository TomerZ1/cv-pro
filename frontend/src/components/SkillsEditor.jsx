/**
 * Displays rewritten skill categories with copy buttons and recommendations.
 *
 * @param {Object} props
 * @param {{name: string, items: string[]}[]} props.categories - Organized skill categories.
 * @param {string[]} props.recommendations - Skills to consider adding.
 */

import CopyButton from "./CopyButton";

export default function SkillsEditor({ categories, recommendations }) {
  // Build "Copy All" text — all categories as "Name: item, item" lines
  const allCategoriesText = categories
    .map((cat) => `${cat.name}: ${cat.items.join(", ")}`)
    .join("\n");

  return (
    <div className="space-y-6">
      {/* Rewritten categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Rewritten Skills</h3>
          <CopyButton text={allCategoriesText} label="Copy All" />
        </div>

        <div className="space-y-3">
          {categories.map((category, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-gray-800">{category.name}</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton
                    text={`${category.name}: ${category.items.join(", ")}`}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">
                {category.items.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 mb-2">
            Recommendations (not in your CV yet)
          </h3>
          <ul className="space-y-1">
            {recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-amber-700">
                &bull; {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
