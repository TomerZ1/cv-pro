/**
 * Displays two profile versions side-by-side with copy buttons.
 *
 * @param {Object} props
 * @param {{label: string, bullets: string[]}} props.version1 - First profile version.
 * @param {{label: string, bullets: string[]}} props.version2 - Second profile version.
 */

import BulletItem from "./BulletItem";
import CopyButton from "./CopyButton";

/**
 * Renders a single profile version card.
 *
 * @param {Object} props
 * @param {{label: string, bullets: string[]}} props.version - Profile version data.
 * @param {string} props.bgClass - Background color class for differentiation.
 */
function VersionCard({ version, bgClass }) {
  return (
    <div className={`rounded-xl shadow-sm border border-gray-200 p-5 ${bgClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{version.label}</h3>
        <CopyButton text={version.bullets} label="Copy Version" />
      </div>

      <div className="space-y-2">
        {version.bullets.map((bullet, i) => (
          <BulletItem key={i} text={bullet} />
        ))}
      </div>
    </div>
  );
}

export default function ProfileEditor({ version1, version2 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VersionCard version={version1} bgClass="bg-white" />
      <VersionCard version={version2} bgClass="bg-slate-50" />
    </div>
  );
}
