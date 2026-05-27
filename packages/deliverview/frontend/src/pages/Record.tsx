import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Upload, RotateCcw, Check } from 'lucide-react';
import { useRecorder } from '../hooks/useRecorder';
import { useUpload } from '../hooks/useUpload';
import { RecordButton } from '../components/recording/RecordButton';
import { RecordingControls } from '../components/recording/RecordingControls';
import { RecordingTimer } from '../components/recording/RecordingTimer';
import { RecordingPreview } from '../components/recording/RecordingPreview';
import { UploadProgress } from '../components/clips/UploadProgress';
import { Button } from '../components/ui/Button';

export function Record() {
  const navigate = useNavigate();
  const [withMic, setWithMic] = useState(true);
  const [title, setTitle] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);

  const {
    status,
    duration,
    blob,
    error: recordError,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useRecorder();

  const { uploading, progress, error: uploadError, upload, cancelUpload } = useUpload();

  const handleUpload = async () => {
    if (!blob) return;
    const result = await upload(blob, title || `Recording ${new Date().toLocaleString()}`);
    if (result) {
      setUploadComplete(true);
    }
  };

  const handleNewRecording = () => {
    resetRecording();
    setTitle('');
    setUploadComplete(false);
  };

  // Upload complete state
  if (uploadComplete) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-6 rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Clip Uploaded</h2>
            <p className="mt-1 text-slate-500">Your recording has been saved successfully.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleNewRecording}>
              <RotateCcw className="h-4 w-4" />
              Record Another
            </Button>
            <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Idle state — ready to record */}
      {status === 'idle' && !blob && (
        <div className="flex flex-col items-center gap-8 rounded-xl border border-slate-200 bg-white p-12 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Record a Screen Walkthrough</h2>
          <p className="max-w-md text-center text-slate-500">
            Share your screen and narrate. The recording captures your screen and microphone audio.
          </p>

          <RecordButton onClick={() => startRecording(withMic)} />

          <button
            onClick={() => setWithMic(!withMic)}
            className="mt-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
          >
            {withMic ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            {withMic ? 'Microphone on' : 'Microphone off'}
          </button>

          {recordError && (
            <p className="text-sm text-red-500">{recordError}</p>
          )}
        </div>
      )}

      {/* Recording / Paused state */}
      {(status === 'recording' || status === 'paused') && (
        <div className="flex flex-col items-center gap-6 rounded-xl border border-red-200 bg-white p-12 shadow-sm">
          <RecordingTimer seconds={duration} />
          <RecordingControls
            status={status}
            onPause={pauseRecording}
            onResume={resumeRecording}
            onStop={stopRecording}
          />
          <p className="text-xs text-slate-400">
            Click the browser's "Stop sharing" button or press Stop to finish.
          </p>
        </div>
      )}

      {/* Post-recording — preview + upload */}
      {status === 'stopped' && blob && (
        <div className="space-y-4">
          <RecordingPreview blob={blob} />

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-slate-700">Clip Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Homepage Walkthrough"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />

            {uploading ? (
              <div className="mt-4">
                <UploadProgress progress={progress} onCancel={cancelUpload} />
              </div>
            ) : (
              <div className="mt-4 flex gap-3">
                <Button onClick={handleUpload}>
                  <Upload className="h-4 w-4" />
                  Upload Clip
                </Button>
                <Button variant="secondary" onClick={handleNewRecording}>
                  <RotateCcw className="h-4 w-4" />
                  Discard & Re-record
                </Button>
              </div>
            )}

            {uploadError && <p className="mt-2 text-sm text-red-500">{uploadError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
