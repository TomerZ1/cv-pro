/**
 * Renders a single bullet with **bold** converted to <strong> tags.
 * Includes a CopyButton beside the text.
 *
 * @param {Object} props
 * @param {string} props.text - Bullet text, may contain **bold** markers.
 * @param {boolean} [props.showCopy=true] - Whether to show the copy button.
 * @param {string} [props.className=""] - Additional Tailwind classes.
 */

import CopyButton from "./CopyButton";

/**
 * Convert **bold** markers in text to React elements with <strong> tags.
 *
 * @param {string} text - Text with potential **bold** markers.
 * @returns {(string | JSX.Element)[]} Array of strings and <strong> elements.
 */
function renderBoldText(text) {
  // Split on **...** patterns, keeping the content
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      // Strip markers and wrap in <strong>
      const content = part.slice(2, -2);
      return <strong key={i} className="font-semibold">{content}</strong>;
    }
    return part;
  });
}

export default function BulletItem({ text, showCopy = true, className = "" }) {
  return (
    <div className={`flex items-start gap-2 group ${className}`}>
      {/* Bullet character */}
      <span className="text-gray-400 mt-0.5 shrink-0">&bull;</span>

      {/* Bullet text with bold rendering */}
      <p className="flex-1 text-sm text-gray-800 leading-relaxed">
        {renderBoldText(text)}
      </p>

      {/* Copy button — visible on hover */}
      {showCopy && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <CopyButton text={text} />
        </div>
      )}
    </div>
  );
}
