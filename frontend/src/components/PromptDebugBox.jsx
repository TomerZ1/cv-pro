/**
 * Collapsible debug box showing the exact prompt sent to Claude.
 * For testing only — shows system prompt and user message with injections.
 *
 * @param {{system_prompt: string, user_message: string}} props.debug - Debug info from backend.
 */

import { useState } from "react";

export default function PromptDebugBox({ debug }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("user");

  if (!debug?.system_prompt && !debug?.user_message) return null;

  return (
    <div className="mt-6 border border-yellow-300 rounded-xl overflow-hidden bg-yellow-50">
      {/* Toggle header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3 text-left
          hover:bg-yellow-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-yellow-800">
            🔍 Debug: View Prompt Sent to Claude
          </span>
          <span className="text-xs text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full">
            Testing only
          </span>
        </div>
        <span className="text-yellow-700 text-sm">{open ? "▲ Hide" : "▼ Show"}</span>
      </button>

      {open && (
        <div className="border-t border-yellow-300">
          {/* Tab switcher */}
          <div className="flex border-b border-yellow-300">
            <button
              onClick={() => setTab("user")}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                tab === "user"
                  ? "bg-white text-yellow-900 border-b-2 border-yellow-500"
                  : "text-yellow-700 hover:bg-yellow-100"
              }`}
            >
              User Message (with injections)
            </button>
            <button
              onClick={() => setTab("system")}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                tab === "system"
                  ? "bg-white text-yellow-900 border-b-2 border-yellow-500"
                  : "text-yellow-700 hover:bg-yellow-100"
              }`}
            >
              System Prompt
            </button>
          </div>

          {/* Content */}
          <div className="p-4 bg-white">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed
              max-h-96 overflow-y-auto">
              {tab === "user" ? debug.user_message : debug.system_prompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
