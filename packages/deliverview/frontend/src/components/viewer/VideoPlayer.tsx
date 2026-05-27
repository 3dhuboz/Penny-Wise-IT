import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  onEnded?: () => void;
  autoPlay?: boolean;
}

export function VideoPlayer({ src, onEnded, autoPlay }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (autoPlay) videoRef.current.play().catch(() => {});
    }
  }, [src, autoPlay]);

  return (
    <div className="overflow-hidden rounded-lg bg-black shadow-lg">
      <video
        ref={videoRef}
        src={src}
        controls
        onEnded={onEnded}
        className="w-full"
        style={{ maxHeight: '540px' }}
      />
    </div>
  );
}
