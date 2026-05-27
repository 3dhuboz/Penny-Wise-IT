import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Send, Eye, CheckCircle2, FileText, Clock } from 'lucide-react';
import { api, type HandoverData, type ClipData, type ClientData } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-600', icon: FileText },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700', icon: Send },
  viewed: { label: 'Viewed', color: 'bg-amber-100 text-amber-700', icon: Eye },
  acknowledged: { label: 'Acknowledged', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
};

export function Handovers() {
  const navigate = useNavigate();
  const [handovers, setHandovers] = useState<HandoverData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [clips, setClips] = useState<ClipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', client_id: '', description: '' });
  const [selectedClips, setSelectedClips] = useState<{ clip_id: string; chapter_title: string }[]>([]);

  useEffect(() => {
    Promise.all([api.listHandovers(), api.listClients(), api.listClips()])
      .then(([h, c, cl]) => { setHandovers(h.handovers); setClients(c.clients); setClips(cl.clips); })
      .finally(() => setLoading(false));
  }, []);

  const toggleClip = (clipId: string) => {
    setSelectedClips((prev) => {
      const exists = prev.find((c) => c.clip_id === clipId);
      if (exists) return prev.filter((c) => c.clip_id !== clipId);
      const clip = clips.find((c) => c.id === clipId);
      return [...prev, { clip_id: clipId, chapter_title: clip?.title ?? '' }];
    });
  };

  const updateChapterTitle = (clipId: string, title: string) => {
    setSelectedClips((prev) => prev.map((c) => c.clip_id === clipId ? { ...c, chapter_title: title } : c));
  };

  const handleCreate = async () => {
    if (!form.title || !form.client_id) return;
    const result = await api.createHandover({
      title: form.title,
      client_id: form.client_id,
      description: form.description || undefined,
      clip_ids: selectedClips.length > 0 ? selectedClips : undefined,
    });
    setShowCreate(false);
    navigate(`/handovers/${result.id}`);
  };

  if (loading) return <div className="text-sm text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Handovers</h2>
          <p className="text-sm text-slate-400">{handovers.length} total</p>
        </div>
        <Button onClick={() => { setForm({ title: '', client_id: '', description: '' }); setSelectedClips([]); setShowCreate(true); }}>
          <Plus className="h-4 w-4" />New Handover
        </Button>
      </div>

      {handovers.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
          No handovers yet. Record some clips, add clients, then create your first handover.
        </div>
      ) : (
        <div className="grid gap-3">
          {handovers.map((h) => {
            const cfg = statusConfig[h.status] ?? statusConfig.draft;
            const Icon = cfg.icon;
            return (
              <Link key={h.id} to={`/handovers/${h.id}`}
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-800 truncate">{h.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{h.client_name}</span>
                    {h.company_name && <span>{h.company_name}</span>}
                    <span>{new Date(h.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${cfg.color}`}>
                  <Icon className="h-3 w-3" />{cfg.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Handover">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Acme Corp Website Handover"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Client *</label>
            <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
              <option value="">Select a client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.contact_name}{c.company_name ? ` (${c.company_name})` : ''}</option>)}
            </select>
            {clients.length === 0 && <p className="mt-1 text-xs text-amber-500">Add clients first in the Clients page.</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              placeholder="Notes about this handover..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>

          {clips.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Clips</label>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {clips.map((clip) => {
                  const selected = selectedClips.find((s) => s.clip_id === clip.id);
                  return (
                    <div key={clip.id} className={`rounded-lg border p-2 text-sm ${selected ? 'border-brand bg-brand/5' : 'border-slate-200'}`}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!selected} onChange={() => toggleClip(clip.id)} className="rounded" />
                        <span className="font-medium text-slate-700">{clip.title}</span>
                      </label>
                      {selected && (
                        <input type="text" value={selected.chapter_title} onChange={(e) => updateChapterTitle(clip.id, e.target.value)}
                          placeholder="Chapter title..." className="mt-1 ml-6 w-[calc(100%-1.5rem)] rounded border border-slate-200 px-2 py-1 text-xs" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Handover</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
