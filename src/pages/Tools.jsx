import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { data, error } = await supabase.from('tools').select('*');
        if (error) throw error;
        setTools(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Tools Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tools.map(tool => (
          <div key={tool.id} className="card">
            <h3 style={{ fontWeight: 'bold' }}>{tool.name}</h3>
            <p>Type: {tool.type}</p>
            <p>Status: {tool.status}</p>
            <p>Category: {tool.category}</p>
          </div>
        ))}
      </div>
      {tools.length === 0 && <p>No tools found.</p>}
    </div>
  );
};

export default Tools;
