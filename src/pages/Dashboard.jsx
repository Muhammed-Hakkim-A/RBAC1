import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/config';
import { LayoutDashboard, Users, Wrench, Briefcase, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalTools: 0,
    activeEmployees: 0,
    monthlyExpenses: 0,
    completedProjects: 0,
    toolsInUse: 0,
    toolsAvailable: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');
      if (projectsError) throw projectsError;

      const activeProjects = projects.filter(p => p.status === 'in-progress').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      // Simple sum of budgets for active projects
      const projectBudgetSum = projects
        .filter(p => p.status === 'in-progress')
        .reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);

      // Tools
      const { data: tools, error: toolsError } = await supabase
        .from('tools')
        .select('*');
      if (toolsError) throw toolsError;

      const toolsInUse = tools.filter(t => t.status === 'in-use').length;
      const toolsAvailable = tools.filter(t => t.status === 'available').length;

      // Employees
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('*');
      if (employeesError) throw employeesError;

      const activeEmployees = employees.filter(e => e.status === 'active').length;

      setStats({
        activeProjects,
        totalTools: tools.length,
        activeEmployees,
        monthlyExpenses: projectBudgetSum,
        completedProjects,
        toolsInUse,
        toolsAvailable
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading-spinner"></div>;

  if (error) return (
    <div className="card" style={{ textAlign: 'center', color: 'red' }}>
      <p>Error loading dashboard: {error}</p>
      <button onClick={fetchDashboardData} className="btn btn-primary" style={{ marginTop: '1rem' }}>Retry</button>
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Dashboard Overview</h1>

      <div className="grid grid-cols-4">
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<Briefcase size={24} />}
          color="#3b82f6" // blue
        />
        <StatCard
          title="Total Tools"
          value={stats.totalTools}
          icon={<Wrench size={24} />}
          color="#f97316" // orange
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={<Users size={24} />}
          color="#22c55e" // green
        />
        <StatCard
          title="Active Budgets"
          value={`$${stats.monthlyExpenses.toLocaleString()}`}
          icon={<LayoutDashboard size={24} />}
          color="#a855f7" // purple
        />
      </div>

      <div className="grid grid-cols-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Project Status</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Active</span>
            <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{stats.activeProjects}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Completed</span>
            <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{stats.completedProjects}</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Tool Status</h3>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Available</span>
            <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{stats.toolsAvailable}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>In Use</span>
            <span style={{ fontWeight: 'bold', color: '#f97316' }}>{stats.toolsInUse}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{
      padding: '0.75rem',
      borderRadius: '50%',
      marginRight: '1rem',
      backgroundColor: color,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </div>
    <div>
      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{value}</h3>
    </div>
  </div>
);

export default Dashboard;
