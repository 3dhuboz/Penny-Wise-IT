import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Bell, Trash2, ArrowLeft, CheckCircle2, Eye, Clock, Mail, Video, Copy } from 'lucide-react';
import { api, type HandoverDetail as HandoverDetailType } from '../lib/api';
import { Button } from '../components/ui/Button';

export function HandoverDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<HandoverDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [reminding, setReminding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getHandover(id).then(setData).catch(() => setError('Handover not found')).finally(() => setLoading(false));
  }, [id]);

  const handleSend = async () => {
    if (!id) return;
    setSending(true);
    setError(null);
    try {
      await api.sendHandover(id);
      const updated = await api.getHandover(id);
      setData(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const handleRemind = async () => {
    if (!id) return;
    setReminding(true);
    setError(null);
    try {
      await api.sendReminder(id);
      const updated = await api.getHandover(id);
      setData(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reminder');
    } finally {
      setReminding(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    await api.deleteHandover(id);
    navigate('/handovers');
  };

  const copyViewerLink = () => {
    if (!data) return;
    const url = `${window.location.origin}/view/${data.handover.magic_token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-sm text-slate-400">Loading...</div>;
  if (error && !data) return <div className="text-sm text-red-500">{error}</div>;
  if (!data) return null;

  const { handover, clips, acknowledgment, emails, reminders } = data;

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    sent: 'bg-blue-100 text-blue-700',
    viewed: 'bg-amber-100 text-amber-700',
    acknowledged: 'bg-green-100 text-green-700',
  };

  // Build timeline events
  const timeline: { label: string; time: string; icon: typeof Clock }[] = [];
  timeline.push({ label: 'Created', time: handover.created_at, icon: Clock });
  if (handover.sent_at) timeline.push({ label: 'Sent to client', time: handover.sent_at, icon: Send });
  emails.forEach((e) => timeline.push({ label: `Email ${e.status}`, time: e.sent_at, icon: Mail }));
  reminders.forEach((r) => timeline.push({ label: `Reminder #${r.reminder_number} sent`, time: r.sent_at, icon: Bell }));
  if (handover.viewed_at) timeline.push({ label: 'Client viewed', time: handover.viewed_at, icon: Eye });
  if (acknowledgment) timeline.push({ label: `Acknowledged by ${acknowledgment.client_name}`, time: acknowledgment.acknowledged_at, icon: CheckCircle2 });
  timeline.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/handovers')} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600">
        <ArrowLeft className="h-4 w-4" />Back to Handovers
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{handover.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{handover.client_name}{handover.company_name ? ` — ${handover.company_name}` : ''}</p>
          {handover.description && <p className="mt-2 text-sm text-slate-500">{handover.description}</p>}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[handover.status] ?? ''}`}>
          {handover.status.charAt(0).toUpperCase() + handover.status.slice(1)}
        </span>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {handover.status === 'draft' && (
          <>
            <Button onClick={handleSend} disabled={sending}><Send className="h-4 w-4" />{sending ? 'Sending...' : 'Send to Client'}</Button>
            <Button variant="danger" onClick={handleDelete}><Trash2 className="h-4 w-4" />Delete</Button>
          </>
        )}
        {(handover.status === 'sent' || handover.status === 'viewed') && (
          <>
            <Button variant="secondary" onClick={handleRemind} disabled={reminding}>
              <Bell className="h-4 w-4" />{reminding ? 'Sending...' : 'Send Reminder'}
            </Button>
            <Button variant="ghost" onClick={copyViewerLink}>
              <Copy className="h-4 w-4" />{copied ? 'Copied!' : 'Copy Viewer Link'}
            </Button>
          </>
        )}
        {handover.status === 'acknowledged' && (
          <Button variant="ghost" onClick={copyViewerLink}>
            <Copy className="h-4 w-4" />{copied ? 'Copied!' : 'Copy Viewer Link'}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Clips */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-semibold text-slate-800">Clips ({clips.length})</h3>
          {clips.length === 0 ? (
            <p className="text-sm text-slate-400">No clips attached</p>
          ) : (
            <div className="space-y-2">
              {clips.map((clip, i) => (
                <div key={clip.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-medium text-brand">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">{clip.chapter_title || clip.clip_title}</p>
                    {clip.duration_seconds && (
                      <p className="text-xs text-slate-400">{Math.floor(clip.duration_seconds / 60)}:{String(Math.round(clip.duration_seconds % 60)).padStart(2, '0')}</p>
                    )}
                  </div>
                  <Video className="h-4 w-4 text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-semibold text-slate-800">Timeline</h3>
          <div className="space-y-4">
            {timeline.map((event, i) => {
              const Icon = event.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                    <Icon className="h-3 w-3 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">{event.label}</p>
                    <p className="text-xs text-slate-400">{new Date(event.time).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Acknowledgment details */}
      {acknowledgment && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <h3 className="mb-2 font-semibold text-green-800">Acknowledgment Record</h3>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div><span className="text-green-600">Name:</span> <span className="text-green-800">{acknowledgment.client_name}</span></div>
            <div><span className="text-green-600">Email:</span> <span className="text-green-800">{acknowledgment.client_email}</span></div>
            <div><span className="text-green-600">Date:</span> <span className="text-green-800">{new Date(acknowledgment.acknowledged_at).toLocaleString()}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
