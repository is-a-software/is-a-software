'use client';

export default function DeleteConfirmModal({ pendingDelete, isDeleting, onCancel, onConfirm }) {
  if (!pendingDelete) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 px-4">
      <div className="glass w-full max-w-md rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white">Confirm deletion</h3>
        <p className="text-slate-300 text-sm">
          {pendingDelete.type === 'domain'
            ? `Delete ${pendingDelete.label} and all associated DNS records?`
            : `Delete record ${pendingDelete.label}?`}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
