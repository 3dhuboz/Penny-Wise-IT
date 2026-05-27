import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { ClipCard } from './ClipCard';

interface ClipData {
  id: string;
  title: string;
  description: string | null;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  mime_type: string;
  status: string;
  created_at: string;
}

export function ClipList() {
  const [clips, setClips] = useState<ClipData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClips = async () => {
    try {
      const data = await api.listClips();
      setClips(data.clips);
    } catch {
      // ignore — clips may not load before auth is ready
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips();
  }, []);

  const handleDelete = async (id: string) => {
    await api.deleteClip(id);
    setClips((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return <div className="text-sm text-slate-400">Loading clips...</div>;
  }

  if (clips.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
        No clips yet. Go to Record to create your first clip.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clips.map((clip) => (
        <ClipCard key={clip.id} clip={clip} onDelete={() => handleDelete(clip.id)} />
      ))}
    </div>
  );
}
