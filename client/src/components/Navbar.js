import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Ticket, Settings } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">PW</span>
          <div className="brand-text">
            <span className="brand-name">Penny Wise</span>
            <span className="brand-tagline">I.T</span>
          </div>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/services" className={isActive('/services') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Services</Link>
          <Link to="/portfolio" className={isActive('/portfolio') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Portfolio</Link>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Contact</Link>

          {user ? (
            <>
              <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/tickets" className={isActive('/tickets') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Tickets</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Admin</Link>
              )}
            </>
          ) : null}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-dropdown">
              <button className="user-dropdown-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar">{user.firstName?.[0]}{user.lastName?.[0]}</div>
                <span className="user-name">{user.firstName}</span>
                <ChevronDown size={16} />
              </button>
              {dropdownOpen && (
                <div className="user-dropdown-menu" onClick={() => setDropdownOpen(false)}>
                  <div className="dropdown-header">
                    <strong>{user.firstName} {user.lastName}</strong>
                    <span>{user.email}</span>
                  </div>
                  <Link to="/dashboard"><LayoutDashboard size={16} /> Dashboard</Link>
                  <Link to="/tickets"><Ticket size={16} /> My Tickets</Link>
                  <Link to="/profile"><User size={16} /> Profile</Link>
                  {user.role === 'admin' && <Link to="/admin"><Settings size={16} /> Admin Panel</Link>}
                  <button onClick={handleLogout} className="dropdown-logout"><LogOut size={16} /> Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
