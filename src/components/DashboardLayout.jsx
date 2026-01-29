import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Briefcase, Wrench, Users, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{ marginBottom: '2rem', padding: '0.5rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0066CC' }}>BK Builders</h1>
          <p style={{ fontSize: '0.875rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
        </div>

        <nav style={{ flex: 1 }}>
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/projects" icon={<Briefcase size={20} />} label="Projects" />
          <NavItem to="/tools" icon={<Wrench size={20} />} label="Tools" />
          <NavItem to="/employees" icon={<Users size={20} />} label="Employees" />
        </nav>

        <button
          onClick={handleSignOut}
          className="btn"
          style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', color: '#ef4444', background: 'none' }}
        >
          <LogOut size={20} style={{ marginRight: '0.5rem' }} />
          Sign Out
        </button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      borderRadius: '0.375rem',
      marginBottom: '0.5rem',
      textDecoration: 'none',
      color: isActive ? 'white' : '#4b5563',
      backgroundColor: isActive ? '#0066CC' : 'transparent',
    })}
  >
    <span style={{ marginRight: '0.75rem' }}>{icon}</span>
    {label}
  </NavLink>
);

export default DashboardLayout;
