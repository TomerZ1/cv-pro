/**
 * Custom hook for copying text to clipboard.
 * Strips **bold** markdown markers, prefixes bullets with bullet character,
 * and provides a temporary "copied" feedback state.
 */

import { useState, useCallback, useRef } from "react";

/**
 * Clean text for clipboard: strip **bold** markers and prefix with bullet char.
 *
 * @param {string} text - Raw text that may contain **bold** markers.
 * @returns {string} Cleaned plain text ready for Canva.
 */
function cleanForClipboard(text) {
  // Strip **bold** markers
  let cleaned = text.replace(/\*\*(.*?)\*\*/g, "$1");

  // Prefix with bullet character if not already present
  if (!cleaned.startsWith("\u2022")) {
    cleaned = `\u2022 ${cleaned}`;
  }

  return cleaned;
}

/**
 * Hook that provides clipboard copy functionality with feedback.
 *
 * @returns {{copyToClipboard: Function, copied: boolean}} Copy function and state.
 */
export default function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const copyToClipboard = useCallback(
    /**
     * Copy text to clipboard. Accepts a single string or array of strings.
     *
     * @param {string | string[]} text - Text or array of bullets to copy.
     */
    async (text) => {
      // Handle array of bullets — clean each, join with newlines
      const cleaned = Array.isArray(text)
        ? text.map(cleanForClipboard).join("\n")
        : cleanForClipboard(text);

      await navigator.clipboard.writeText(cleaned);

      setCopied(true);

      // Clear any existing timeout to prevent stale resets
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset "copied" state after 2 seconds
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    },
    []
  );

  return { copyToClipboard, copied };
}
