import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', company: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <div className="auth-logo"><span className="brand-icon">PW</span></div>
          <h1>Get Started</h1>
          <p>Create your Penny Wise I.T account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" required value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="First name" />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" required value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Last name" />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Company</label>
              <input type="text" value={form.company} onChange={e => update('company', e.target.value)} placeholder="Your company" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="0400 000 000" />
            </div>
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input type="password" required value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 6 characters" />
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input type="password" required value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Confirm password" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
