/**
 * Error message card with optional retry button.
 *
 * @param {Object} props
 * @param {string} props.message - Error message to display.
 * @param {Function} [props.onRetry] - Optional callback for the retry button.
 */

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
      {/* Error icon */}
      <span className="text-red-500 text-xl shrink-0">&#9888;</span>

      <div className="flex-1">
        <p className="text-sm text-red-700">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-4 py-1.5 text-sm font-medium text-red-700 bg-red-100
              rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
