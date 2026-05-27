interface UploadProgressProps {
  progress: number;
  onCancel?: () => void;
}

export function UploadProgress({ progress, onCancel }: UploadProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">Uploading...</span>
        <span className="font-medium text-brand">{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {onCancel && (
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-red-500"
        >
          Cancel upload
        </button>
      )}
    </div>
  );
}
