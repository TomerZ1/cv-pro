/**
 * Displays original skills vs. rewritten categories side-by-side.
 * Includes copy buttons per category and a recommendations section.
 *
 * @param {Object} props
 * @param {Object} props.original - Original skills {languages_frameworks, tools}.
 * @param {{categories: Array, recommendations: string[]}} props.rewritten - Rewritten skills.
 */

import CopyButton from "./CopyButton";

export default function SkillsEditor({ original, rewritten }) {
  // Build "Copy All" text — all categories as "Name: item, item" lines
  const allCategoriesText = rewritten.categories
    .map((cat) => `${cat.name}: ${cat.items.join(", ")}`)
    .join("\n");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original skills */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Original</h3>
          <div className="space-y-3 text-sm text-gray-700">
            {original.languages_frameworks && (
              <div>
                <p className="font-medium text-gray-500 text-xs mb-1">Languages & Frameworks</p>
                <p>{original.languages_frameworks}</p>
              </div>
            )}
            {original.tools && (
              <div>
                <p className="font-medium text-gray-500 text-xs mb-1">Tools</p>
                <p>{original.tools}</p>
              </div>
            )}
          </div>
        </div>

        {/* Rewritten categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Rewritten</h3>
            <CopyButton text={allCategoriesText} label="Copy All" />
          </div>

          <div className="space-y-3">
            {rewritten.categories.map((category, i) => (
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
      </div>

      {/* Recommendations */}
      {rewritten.recommendations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 mb-2">
            Recommendations (not in your CV yet)
          </h3>
          <ul className="space-y-1">
            {rewritten.recommendations.map((rec, i) => (
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
