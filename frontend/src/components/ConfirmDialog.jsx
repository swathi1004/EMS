function ConfirmDialog({ open, message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-3">Confirm Action</h3>
        <p className="mb-4 text-slate-700">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
