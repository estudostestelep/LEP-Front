
export default function ConfirmModal({ open, title, message, onCancel, onConfirm }: { open: boolean; title?: string; message?: string; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card text-card-foreground rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold">{title ?? 'Confirm'}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{message ?? 'Are you sure?'}</p>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <button onClick={onCancel} className="px-3 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">Delete</button>
        </div>
      </div>
    </div>
  );
}