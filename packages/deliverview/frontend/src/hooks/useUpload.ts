import { useState, useCallback, useRef } from 'react';
import { api } from '../lib/api';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });
  const abortRef = useRef<(() => void) | null>(null);

  const upload = useCallback(
    async (blob: Blob, title: string): Promise<{ id: string } | null> => {
      setState({ uploading: true, progress: 0, error: null });

      const file = new File([blob], `${title || 'recording'}.webm`, { type: blob.type });

      const { promise, abort } = api.uploadClip(file, title, (percent) => {
        setState((prev) => ({ ...prev, progress: percent }));
      });
      abortRef.current = abort;

      try {
        const result = await promise;
        setState({ uploading: false, progress: 100, error: null });
        abortRef.current = null;
        return { id: result.id };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setState({ uploading: false, progress: 0, error: msg });
        abortRef.current = null;
        return null;
      }
    },
    []
  );

  const cancelUpload = useCallback(() => {
    abortRef.current?.();
    setState({ uploading: false, progress: 0, error: null });
  }, []);

  return { ...state, upload, cancelUpload };
}
