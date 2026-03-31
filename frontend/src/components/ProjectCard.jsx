/**
 * Displays a single project with all its bullet variations.
 * Includes a "Copy All" button for the entire project.
 *
 * @param {Object} props
 * @param {string} props.projectKey - Project identifier key.
 * @param {{title: string, bullets: Array}} props.project - Project data with bullets.
 * @param {Function} props.onRegenerate - Callback: (projectKey, bulletIndex, angle) => void.
 * @param {Set<string>} [props.regeneratingBullets] - Set of "projectKey-bulletIndex" currently regenerating.
 */

import BulletVariations from "./BulletVariations";
import CopyButton from "./CopyButton";

export default function ProjectCard({
  projectKey,
  project,
  onRegenerate,
  regeneratingBullets = new Set(),
}) {
  // Collect all variation texts for "Copy All" — take first variation of each bullet
  const allBulletTexts = project.bullets.map((bullet) =>
    bullet.variations.length > 0 ? bullet.variations[0].text : bullet.original
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Project header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{project.title}</h3>
        <CopyButton text={allBulletTexts} label="Copy All" />
      </div>

      {/* Bullet variations */}
      <div className="p-5 space-y-4">
        {project.bullets.map((bullet, index) => (
          <BulletVariations
            key={index}
            original={bullet.original}
            variations={bullet.variations}
            bulletIndex={index}
            isRegenerating={regeneratingBullets.has(`${projectKey}-${index}`)}
            onRegenerate={(bulletIndex, angle) =>
              onRegenerate(projectKey, bulletIndex, angle)
            }
          />
        ))}
      </div>
    </div>
  );
}
