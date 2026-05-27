import { CheckCircle2, PlayCircle, Circle } from 'lucide-react';

interface Chapter {
  id: string;
  clip_id: string;
  position: number;
  chapter_title: string | null;
  clip_title: string;
  duration_seconds: number | null;
}

interface ChapterSidebarProps {
  chapters: Chapter[];
  currentIndex: number;
  watchedSet: Set<number>;
  onSelect: (index: number) => void;
}

export function ChapterSidebar({ chapters, currentIndex, watchedSet, onSelect }: ChapterSidebarProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <h3 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
        Chapters ({watchedSet.size}/{chapters.length} viewed)
      </h3>
      <div className="divide-y divide-slate-100">
        {chapters.map((ch, i) => {
          const isWatched = watchedSet.has(i);
          const isCurrent = i === currentIndex;
          return (
            <button
              key={ch.id}
              onClick={() => onSelect(i)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                isCurrent ? 'bg-brand/5' : 'hover:bg-slate-50'
              }`}
            >
              {isWatched ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
              ) : isCurrent ? (
                <PlayCircle className="h-5 w-5 shrink-0 text-brand" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-slate-300" />
              )}
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm ${isCurrent ? 'font-medium text-brand' : 'text-slate-700'}`}>
                  {ch.chapter_title || ch.clip_title}
                </p>
                {ch.duration_seconds && (
                  <p className="text-xs text-slate-400">
                    {Math.floor(ch.duration_seconds / 60)}:{String(Math.round(ch.duration_seconds % 60)).padStart(2, '0')}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
