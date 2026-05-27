import { useState } from 'react';
import { Trash2, Video } from 'lucide-react';

interface ClipCardProps {
  clip: {
    id: string;
    title: string;
    duration_seconds: number | null;
    file_size_bytes: number | null;
    created_at: string;
  };
  onDelete: () => Promise<void>;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatSize(bytes: number | null): string {
  if (!bytes) return '--';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ClipCard({ clip, onDelete }: ClipCardProps) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    await onDelete();
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-slate-100">
        <Video className="h-10 w-10 text-slate-300" />
      </div>

      <h3 className="mb-1 truncate font-medium text-slate-800">{clip.title}</h3>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span>{formatDuration(clip.duration_seconds)}</span>
        <span>{formatSize(clip.file_size_bytes)}</span>
        <span>{new Date(clip.created_at).toLocaleDateString()}</span>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleDelete}
          className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
            confirming
              ? 'bg-red-500 text-white'
              : 'text-slate-400 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Trash2 className="h-3 w-3" />
          {confirming ? 'Confirm?' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
