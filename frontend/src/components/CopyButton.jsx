/**
 * Reusable clipboard copy button.
 * Shows a brief "Copied!" feedback after clicking.
 *
 * @param {Object} props
 * @param {string | string[]} props.text - Text or array of bullets to copy.
 * @param {string} [props.label="Copy"] - Button label text.
 * @param {string} [props.className=""] - Additional Tailwind classes.
 */

import useCopyToClipboard from "../hooks/useCopyToClipboard";

export default function CopyButton({ text, label = "Copy", className = "" }) {
  const { copyToClipboard, copied } = useCopyToClipboard();

  return (
    <button
      onClick={() => copyToClipboard(text)}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded
        border border-gray-300 hover:bg-gray-100 transition-colors
        ${copied ? "bg-green-50 border-green-400 text-green-700" : "text-gray-600"}
        ${className}`}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
