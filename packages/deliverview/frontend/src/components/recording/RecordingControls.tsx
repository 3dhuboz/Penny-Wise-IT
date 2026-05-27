import { Pause, Play, Square } from 'lucide-react';
import type { RecordingStatus } from '../../hooks/useRecorder';

interface RecordingControlsProps {
  status: RecordingStatus;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function RecordingControls({ status, onPause, onResume, onStop }: RecordingControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {status === 'recording' ? (
        <button
          onClick={onPause}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-white transition-colors hover:bg-slate-800"
        >
          <Pause className="h-5 w-5" />
        </button>
      ) : status === 'paused' ? (
        <button
          onClick={onResume}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700"
        >
          <Play className="h-5 w-5" />
        </button>
      ) : null}

      <button
        onClick={onStop}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
      >
        <Square className="h-5 w-5 fill-current" />
      </button>

      {status === 'recording' && (
        <span className="flex items-center gap-2 text-sm text-red-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          Recording
        </span>
      )}
      {status === 'paused' && (
        <span className="text-sm text-amber-500">Paused</span>
      )}
    </div>
  );
}
