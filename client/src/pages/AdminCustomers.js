import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, UserCheck, UserX } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', company: '', phone: '', hostingPlan: 'none', sitegroundSiteId: '' });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    api.get('/customers').then(res => { setCustomers(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const filtered = customers.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.company}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditCustomer(null);
    setForm({ firstName: '', lastName: '', email: '', password: 'TempPass123!', company: '', phone: '', hostingPlan: 'none', sitegroundSiteId: '' });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditCustomer(c);
    setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email, password: '', company: c.company || '', phone: c.phone || '', hostingPlan: c.hostingPlan || 'none', sitegroundSiteId: c.sitegroundSiteId || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCustomer) {
        await api.put(`/customers/${editCustomer._id}`, form);
        toast.success('Customer updated');
      } else {
        await api.post('/customers', form);
        toast.success('Customer created');
      }
      setShowModal(false);
      loadCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save customer');
    }
  };

  const toggleActive = async (c) => {
    try {
      await api.put(`/customers/${c._id}`, { ...c, isActive: !c.isActive });
      toast.success(`Customer ${c.isActive ? 'deactivated' : 'activated'}`);
      loadCustomers();
    } catch (err) {
      toast.error('Failed to update customer');
    }
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  if (loading) return <div className="page-loading">Loading customers...</div>;

  return (
    <div className="admin-page">
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <Link to="/admin" className="back-link"><ArrowLeft size={16} /> Back to Admin</Link>
        <div className="admin-header">
          <h1>Customer Management</h1>
          <button onClick={openCreate} className="btn btn-primary"><Plus size={16} /> Add Customer</button>
        </div>

        <div className="tickets-toolbar card" style={{ marginBottom: '1.5rem' }}>
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{filtered.length} customers</span>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Hosting Plan</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</td>
                  <td>{c.email}</td>
                  <td>{c.company || '-'}</td>
                  <td><span className="badge badge-info">{c.hostingPlan || 'none'}</span></td>
                  <td>
                    <span className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button onClick={() => openEdit(c)} className="btn btn-sm btn-secondary"><Edit size={14} /></button>
                      <button onClick={() => toggleActive(c)} className={`btn btn-sm ${c.isActive ? 'btn-danger' : 'btn-primary'}`}>
                        {c.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>{editCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input type="text" required value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input type="text" required value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} disabled={!!editCustomer} />
                </div>
                {!editCustomer && (
                  <div className="form-group">
                    <label>Temporary Password</label>
                    <input type="text" value={form.password} onChange={e => update('password', e.target.value)} />
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Company</label>
                    <input type="text" value={form.company} onChange={e => update('company', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Hosting Plan</label>
                    <select value={form.hostingPlan} onChange={e => update('hostingPlan', e.target.value)}>
                      <option value="none">None</option>
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="gogeek">GoGeek</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>SiteGround Site ID</label>
                    <input type="text" value={form.sitegroundSiteId} onChange={e => update('sitegroundSiteId', e.target.value)} placeholder="Optional" />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">{editCustomer ? 'Update' : 'Create'} Customer</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
