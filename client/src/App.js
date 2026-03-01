import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import NewTicket from './pages/NewTicket';
import AdminDashboard from './pages/AdminDashboard';
import AdminCustomers from './pages/AdminCustomers';
import AdminServices from './pages/AdminServices';
import AdminWorkflows from './pages/AdminWorkflows';
import AdminSiteGround from './pages/AdminSiteGround';
import Profile from './pages/Profile';
import SocialAI from './pages/SocialAI';
import AdminSocial from './pages/AdminSocial';
import SocialAIProduct from './pages/SocialAIProduct';
import AutoHue from './pages/AutoHue';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/social-ai" element={<SocialAIProduct />} />
      <Route path="/autohue" element={<AutoHue />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
      <Route path="/tickets/new" element={<ProtectedRoute><NewTicket /></ProtectedRoute>} />
      <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/social" element={<ProtectedRoute><SocialAI /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute adminOnly><AdminCustomers /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute adminOnly><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/workflows" element={<ProtectedRoute adminOnly><AdminWorkflows /></ProtectedRoute>} />
      <Route path="/admin/siteground" element={<ProtectedRoute adminOnly><AdminSiteGround /></ProtectedRoute>} />
      <Route path="/admin/social" element={<ProtectedRoute adminOnly><AdminSocial /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: { background: '#1e293b', color: '#f8fafc', borderRadius: '8px' }
        }} />
      </Router>
    </AuthProvider>
  );
}

export default App;
