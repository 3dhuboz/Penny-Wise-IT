import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, Plus, Clock, CheckCircle, AlertCircle, ArrowRight, Workflow } from 'lucide-react';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/tickets').catch(() => ({ data: [] })),
      api.get('/workflows').catch(() => ({ data: [] }))
    ]).then(([ticketRes, workflowRes]) => {
      setTickets(ticketRes.data);
      setWorkflows(workflowRes.data);
      setLoading(false);
    });
  }, []);

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  const statusColor = (status) => {
    const map = { 'open': 'badge-warning', 'in-progress': 'badge-info', 'waiting-on-customer': 'badge-gray', 'resolved': 'badge-success', 'closed': 'badge-gray' };
    return map[status] || 'badge-gray';
  };

  const priorityColor = (priority) => {
    const map = { 'low': 'badge-gray', 'medium': 'badge-info', 'high': 'badge-warning', 'critical': 'badge-danger' };
    return map[priority] || 'badge-gray';
  };

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div className="dash-header">
          <div>
            <h1>Welcome back, {user?.firstName}!</h1>
            <p>Here's an overview of your account</p>
          </div>
          <Link to="/tickets/new" className="btn btn-primary"><Plus size={16} /> New Ticket</Link>
        </div>

        <div className="dash-stats">
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><AlertCircle size={24} /></div>
            <div className="stat-info"><strong>{openTickets.length}</strong><span>Open Tickets</span></div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><CheckCircle size={24} /></div>
            <div className="stat-info"><strong>{resolvedTickets.length}</strong><span>Resolved</span></div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}><Ticket size={24} /></div>
            <div className="stat-info"><strong>{tickets.length}</strong><span>Total Tickets</span></div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}><Workflow size={24} /></div>
            <div className="stat-info"><strong>{workflows.length}</strong><span>Workflows</span></div>
          </div>
        </div>

        <div className="dash-grid">
          <div className="dash-section">
            <div className="section-title">
              <h2><Clock size={18} /> Recent Tickets</h2>
              <Link to="/tickets" className="btn btn-sm btn-secondary">View All <ArrowRight size={14} /></Link>
            </div>
            {tickets.length === 0 ? (
              <div className="empty-state card">
                <p>No tickets yet. Need help? Create a support ticket.</p>
                <Link to="/tickets/new" className="btn btn-primary btn-sm"><Plus size={14} /> Create Ticket</Link>
              </div>
            ) : (
              <div className="ticket-list">
                {tickets.slice(0, 5).map(ticket => (
                  <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="ticket-item card">
                    <div className="ti-header">
                      <span className="ti-number">{ticket.ticketNumber}</span>
                      <span className={`badge ${statusColor(ticket.status)}`}>{ticket.status}</span>
                    </div>
                    <h4>{ticket.subject}</h4>
                    <div className="ti-meta">
                      <span className={`badge ${priorityColor(ticket.priority)}`}>{ticket.priority}</span>
                      <span className="ti-date">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="dash-section">
            <div className="section-title">
              <h2><Workflow size={18} /> Active Workflows</h2>
            </div>
            {workflows.length === 0 ? (
              <div className="empty-state card">
                <p>No active workflows. Your workflows will appear here when created by the team.</p>
              </div>
            ) : (
              <div className="workflow-list">
                {workflows.filter(w => w.status === 'active').slice(0, 5).map(wf => {
                  const completed = wf.steps?.filter(s => s.status === 'completed').length || 0;
                  const total = wf.steps?.length || 0;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <div key={wf._id} className="workflow-item card">
                      <h4>{wf.name}</h4>
                      <p className="wf-desc">{wf.description}</p>
                      <div className="wf-progress">
                        <div className="wf-bar"><div className="wf-fill" style={{ width: `${pct}%` }}></div></div>
                        <span>{pct}% ({completed}/{total})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
