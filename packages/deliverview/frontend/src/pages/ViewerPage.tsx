import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { viewerApi } from '../lib/api';
import { BrandedHeader } from '../components/viewer/BrandedHeader';
import { VideoPlayer } from '../components/viewer/VideoPlayer';
import { ChapterSidebar } from '../components/viewer/ChapterSidebar';
import { AcknowledgmentForm } from '../components/viewer/AcknowledgmentForm';

interface ViewerClip {
  id: string;
  clip_id: string;
  position: number;
  chapter_title: string | null;
  clip_title: string;
  duration_seconds: number | null;
  mime_type: string;
}

export function ViewerPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [handover, setHandover] = useState<{ title: string; description: string | null; staff_name: string } | null>(null);
  const [clips, setClips] = useState<ViewerClip[]>([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchedSet, setWatchedSet] = useState<Set<number>>(new Set());
  const [showAckForm, setShowAckForm] = useState(false);
  const [ackDone, setAckDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    viewerApi.getHandover(token)
      .then((data) => {
        setHandover(data.handover);
        setClips(data.clips);
        setAcknowledged(data.acknowledged);
        if (data.acknowledged) setAckDone(true);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [token]);

  const allWatched = clips.length > 0 && watchedSet.size >= clips.length;

  const handleClipEnded = useCallback(() => {
    setWatchedSet((prev) => new Set(prev).add(currentIndex));
    // Auto-advance to next clip
    if (currentIndex < clips.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, clips.length]);

  const handleAcknowledge = async (data: {
    client_name: string;
    client_email: string;
    consent_text: string;
    signature_data?: string;
  }) => {
    if (!token) return;
    await viewerApi.acknowledge(token, data);
    setAckDone(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-400">Loading handover...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <BrandedHeader />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="text-xl font-bold text-slate-800">Unable to Load Handover</h1>
          <p className="mt-2 text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (ackDone) {
    return (
      <div className="min-h-screen bg-slate-50">
        <BrandedHeader />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Handover Acknowledged</h1>
          <p className="mt-2 text-slate-500">
            Thank you for reviewing and acknowledging this handover. A confirmation email has been sent to you.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            You may close this window. A record of your acknowledgment has been securely stored.
          </p>
        </div>
      </div>
    );
  }

  const currentClip = clips[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      <BrandedHeader />

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{handover?.title}</h1>
          {handover?.description && <p className="mt-1 text-slate-500">{handover.description}</p>}
          <p className="mt-1 text-sm text-slate-400">Prepared by {handover?.staff_name}</p>
        </div>

        {clips.length === 0 ? (
          <p className="text-slate-400">No clips in this handover.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Main video area */}
            <div className="space-y-4">
              {currentClip && token && (
                <>
                  <VideoPlayer
                    src={viewerApi.clipStreamUrl(token, currentClip.clip_id)}
                    onEnded={handleClipEnded}
                    autoPlay={currentIndex > 0}
                  />
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-700">
                      {currentClip.chapter_title || currentClip.clip_title}
                    </h2>
                    <span className="text-sm text-slate-400">
                      Chapter {currentIndex + 1} of {clips.length}
                    </span>
                  </div>
                </>
              )}

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${(watchedSet.size / clips.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">
                  {watchedSet.size}/{clips.length} watched
                </span>
              </div>

              {/* Ack form — shown after all chapters watched */}
              {allWatched && !acknowledged && (
                <div className="mt-8">
                  {showAckForm ? (
                    <AcknowledgmentForm
                      handoverTitle={handover?.title ?? ''}
                      onSubmit={handleAcknowledge}
                    />
                  ) : (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                      <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-500" />
                      <h3 className="text-lg font-semibold text-green-800">All chapters viewed</h3>
                      <p className="mt-1 text-sm text-green-600">
                        You're ready to acknowledge receipt of this handover.
                      </p>
                      <button
                        onClick={() => setShowAckForm(true)}
                        className="mt-4 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-light"
                      >
                        Proceed to Acknowledgment
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!allWatched && !acknowledged && (
                <p className="text-center text-sm text-slate-400">
                  Watch all chapters to unlock the acknowledgment form.
                </p>
              )}
            </div>

            {/* Chapter sidebar */}
            <ChapterSidebar
              chapters={clips}
              currentIndex={currentIndex}
              watchedSet={watchedSet}
              onSelect={(i) => {
                setCurrentIndex(i);
                setWatchedSet((prev) => new Set(prev).add(currentIndex));
              }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <p>Penny Wise I.T | ABN: XX XXX XXX XXX</p>
        <p className="mt-1">Your IP address and browser details are recorded for verification purposes.</p>
      </footer>
    </div>
  );
}
