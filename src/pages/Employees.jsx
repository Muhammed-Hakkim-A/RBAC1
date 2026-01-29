import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase.from('employees').select('*');
        if (error) throw error;
        setEmployees(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Employees</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {employees.map(employee => (
          <div key={employee.id} className="card">
            <h3 style={{ fontWeight: 'bold' }}>{employee.name}</h3>
            <p>Role: {employee.role}</p>
            <p>Status: {employee.status}</p>
            <p>Email: {employee.email}</p>
          </div>
        ))}
      </div>
      {employees.length === 0 && <p>No employees found.</p>}
    </div>
  );
};

export default Employees;
