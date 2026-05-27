import { useMemo } from 'react';

interface RecordingPreviewProps {
  blob: Blob;
}

export function RecordingPreview({ blob }: RecordingPreviewProps) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-black">
      <video
        src={url}
        controls
        className="w-full"
        style={{ maxHeight: '480px' }}
      />
    </div>
  );
}
