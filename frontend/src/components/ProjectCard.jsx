/**
 * Displays a single project with Version A and Version B bullets.
 * Each version block has a copy button, and each bullet has a hover copy.
 *
 * @param {Object} props
 * @param {{title: string, version_a: string[], version_b: string[]}} props.project - Project data.
 */

import BulletItem from "./BulletItem";
import CopyButton from "./CopyButton";

export default function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Project header */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{project.title}</h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Version A — Tasks & Process */}
        {project.version_a.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Version A &mdash; Tasks &amp; Process
              </span>
              <CopyButton text={project.version_a} label="Copy A" />
            </div>
            <div className="space-y-1.5">
              {project.version_a.map((bullet, i) => (
                <BulletItem key={i} text={bullet} />
              ))}
            </div>
          </div>
        )}

        {/* Version B — Impact & Outcomes */}
        {project.version_b.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                Version B &mdash; Impact &amp; Outcomes
              </span>
              <CopyButton text={project.version_b} label="Copy B" />
            </div>
            <div className="space-y-1.5">
              {project.version_b.map((bullet, i) => (
                <BulletItem key={i} text={bullet} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
