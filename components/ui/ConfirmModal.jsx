export default function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading = false }) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onCancel?.()} />

      {/* Card */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-red-900/40 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-lg text-center mt-4">{title}</h3>

          {/* Message */}
          <p className="text-slate-400 text-sm text-center mt-2">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onCancel?.()}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={() => onConfirm?.()}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Deleting...
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
