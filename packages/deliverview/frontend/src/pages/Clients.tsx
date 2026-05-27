import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Building2, Mail, Phone } from 'lucide-react';
import { api, type ClientData } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export function Clients() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ClientData | null>(null);
  const [form, setForm] = useState({ contact_name: '', contact_email: '', company_name: '', phone: '', notes: '' });

  const fetchClients = async () => {
    try {
      const data = await api.listClients();
      setClients(data.clients);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ contact_name: '', contact_email: '', company_name: '', phone: '', notes: '' });
    setShowForm(true);
  };

  const openEdit = (c: ClientData) => {
    setEditing(c);
    setForm({
      contact_name: c.contact_name,
      contact_email: c.contact_email,
      company_name: c.company_name ?? '',
      phone: c.phone ?? '',
      notes: c.notes ?? '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.contact_name || !form.contact_email) return;
    if (editing) {
      await api.updateClient(editing.id, form);
    } else {
      await api.createClient(form);
    }
    setShowForm(false);
    fetchClients();
  };

  const handleDelete = async (id: string) => {
    await api.deleteClient(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <div className="text-sm text-slate-400">Loading clients...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Client Directory</h2>
          <p className="text-sm text-slate-400">{clients.length} client{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" />Add Client</Button>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
          No clients yet. Add your first client to start creating handovers.
        </div>
      ) : (
        <div className="grid gap-3">
          {clients.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand font-semibold text-sm">
                {c.contact_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-800 truncate">{c.contact_name}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  {c.company_name && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{c.company_name}</span>}
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.contact_email}</span>
                  {c.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>}
                </div>
              </div>
              <button onClick={() => openEdit(c)} className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(c.id)} className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Client' : 'Add Client'}>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
            <input type="text" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
            <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company</label>
            <input type="text" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Add Client'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
