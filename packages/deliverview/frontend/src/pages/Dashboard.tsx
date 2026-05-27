import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Video, Package, ArrowRight, Users, Send, Eye, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, type HandoverData, type ClipData } from '../lib/api';
import { ClipList } from '../components/clips/ClipList';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const { user } = useUser();
  const [handovers, setHandovers] = useState<HandoverData[]>([]);
  const [clipCount, setClipCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);

  useEffect(() => {
    Promise.all([api.listHandovers(), api.listClips(), api.listClients()])
      .then(([h, c, cl]) => {
        setHandovers(h.handovers);
        setClipCount(c.clips.length);
        setClientCount(cl.clients.length);
      })
      .catch(() => {});
  }, []);

  const stats = {
    total: handovers.length,
    draft: handovers.filter((h) => h.status === 'draft').length,
    sent: handovers.filter((h) => h.status === 'sent').length,
    viewed: handovers.filter((h) => h.status === 'viewed').length,
    acknowledged: handovers.filter((h) => h.status === 'acknowledged').length,
  };

  const pending = handovers.filter((h) => h.status === 'sent' || h.status === 'viewed');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
        </h2>
        <p className="mt-1 text-slate-500">
          Record walkthroughs, build handover packages, and track client acknowledgments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10"><Package className="h-5 w-5 text-brand" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{stats.total}</p><p className="text-xs text-slate-400">Total Handovers</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50"><CheckCircle2 className="h-5 w-5 text-green-500" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{stats.acknowledged}</p><p className="text-xs text-slate-400">Acknowledged</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50"><Video className="h-5 w-5 text-red-500" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{clipCount}</p><p className="text-xs text-slate-400">Clips</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50"><Users className="h-5 w-5 text-purple-500" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{clientCount}</p><p className="text-xs text-slate-400">Clients</p></div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/record" className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50"><Video className="h-6 w-6 text-red-500" /></div>
          <div className="flex-1"><h3 className="font-semibold text-slate-800">Record a Clip</h3><p className="text-sm text-slate-400">Screen + mic recording</p></div>
          <ArrowRight className="h-5 w-5 text-slate-300" />
        </Link>
        <Link to="/handovers" className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10"><Package className="h-6 w-6 text-brand" /></div>
          <div className="flex-1"><h3 className="font-semibold text-slate-800">Handovers</h3><p className="text-sm text-slate-400">Build and send packages</p></div>
          <ArrowRight className="h-5 w-5 text-slate-300" />
        </Link>
      </div>

      {/* Pending handovers */}
      {pending.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-800">Awaiting Response</h3>
          <div className="grid gap-3">
            {pending.map((h) => (
              <Link key={h.id} to={`/handovers/${h.id}`}
                className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 transition-colors hover:bg-amber-100">
                {h.status === 'sent' ? <Send className="h-4 w-4 text-blue-500" /> : <Eye className="h-4 w-4 text-amber-500" />}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-slate-800">{h.title}</p>
                  <p className="text-xs text-slate-500">{h.client_name} — {h.status === 'sent' ? 'Sent, not yet viewed' : 'Viewed, not yet acknowledged'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent clips */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Recent Clips</h3>
          <Link to="/record">
            <Button variant="ghost" size="sm"><Video className="h-4 w-4" />New Recording</Button>
          </Link>
        </div>
        <ClipList />
      </div>
    </div>
  );
}
