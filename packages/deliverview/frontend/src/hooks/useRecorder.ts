import { useState, useRef, useCallback, useEffect } from 'react';

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped';

interface RecorderState {
  status: RecordingStatus;
  duration: number;
  blob: Blob | null;
  error: string | null;
}

export function useRecorder() {
  const [state, setState] = useState<RecorderState>({
    status: 'idle',
    duration: 0,
    blob: null,
    error: null,
  });

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamsRef = useRef<MediaStream[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamsRef.current.forEach((s) => s.getTracks().forEach((t) => t.stop()));
    streamsRef.current = [];
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startRecording = useCallback(
    async (withMic = true) => {
      cleanup();
      setState({ status: 'idle', duration: 0, blob: null, error: null });

      try {
        // Screen capture
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { width: 1920, height: 1080, frameRate: 30 },
          audio: true,
        });
        streamsRef.current.push(screenStream);

        let combinedStream: MediaStream;

        if (withMic) {
          try {
            const micStream = await navigator.mediaDevices.getUserMedia({
              audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
            });
            streamsRef.current.push(micStream);

            // Mix audio streams
            const audioCtx = new AudioContext();
            audioCtxRef.current = audioCtx;
            const dest = audioCtx.createMediaStreamDestination();

            const micSource = audioCtx.createMediaStreamSource(micStream);
            micSource.connect(dest);

            const screenAudioTracks = screenStream.getAudioTracks();
            if (screenAudioTracks.length > 0) {
              const sysSource = audioCtx.createMediaStreamSource(
                new MediaStream(screenAudioTracks)
              );
              sysSource.connect(dest);
            }

            combinedStream = new MediaStream([
              ...screenStream.getVideoTracks(),
              ...dest.stream.getAudioTracks(),
            ]);
          } catch {
            // Mic denied — fall back to screen only
            combinedStream = screenStream;
          }
        } else {
          combinedStream = screenStream;
        }

        // Determine supported mime type
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
            ? 'video/webm;codecs=vp8,opus'
            : 'video/webm';

        const recorder = new MediaRecorder(combinedStream, {
          mimeType,
          videoBitsPerSecond: 2_500_000,
        });
        recorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          setState((prev) => ({ ...prev, status: 'stopped', blob }));
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        };

        // Auto-stop when user clicks browser "Stop sharing"
        screenStream.getVideoTracks()[0].onended = () => {
          if (recorderRef.current?.state === 'recording') {
            recorderRef.current.stop();
          }
        };

        recorder.start(1000); // collect chunks every second

        // Duration timer
        timerRef.current = setInterval(() => {
          setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
        }, 1000);

        setState({ status: 'recording', duration: 0, blob: null, error: null });
      } catch (err) {
        cleanup();
        const msg = err instanceof Error ? err.message : 'Failed to start recording';
        setState({ status: 'idle', duration: 0, blob: null, error: msg });
      }
    },
    [cleanup]
  );

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording' || recorderRef.current?.state === 'paused') {
      recorderRef.current.stop();
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setState((prev) => ({ ...prev, status: 'paused' }));
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (recorderRef.current?.state === 'paused') {
      recorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      setState((prev) => ({ ...prev, status: 'recording' }));
    }
  }, []);

  const resetRecording = useCallback(() => {
    cleanup();
    setState({ status: 'idle', duration: 0, blob: null, error: null });
  }, [cleanup]);

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  };
}
