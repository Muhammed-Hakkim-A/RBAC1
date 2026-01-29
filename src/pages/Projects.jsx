import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import { Plus } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    client: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning',
    assignedTeam: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Field Name Mapping Function (Fixes ISSUE #3)
  const mapFormDataToDb = (data) => ({
    name: data.name,
    location: data.location,
    client: data.client,
    start_date: data.startDate, // Maps camelCase to snake_case
    end_date: data.endDate,     // Maps camelCase to snake_case
    budget: data.budget,
    status: data.status,
    assigned_team: data.assignedTeam, // Maps camelCase to snake_case
    description: data.description,
    progress: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dbData = mapFormDataToDb(formData);

      const { error } = await supabase
        .from('projects')
        .insert([dbData]);

      if (error) throw error;

      setShowForm(false);
      setFormData({
        name: '', location: '', client: '', startDate: '', endDate: '',
        budget: '', status: 'planning', assignedTeam: '', description: ''
      });
      fetchProjects();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Image Validation Function (Fixes ISSUE #4)
  const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Please upload a valid image (JPG, PNG, or WebP)' };
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return { valid: false, error: 'Image size must be less than 10MB' };
    }
    return { valid: true };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateImage(file);
      if (!validation.valid) {
        alert(validation.error);
        e.target.value = ''; // Reset input
        setImageFile(null);
      } else {
        setImageFile(file);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
          New Project
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2">
              <div className="input-group">
                <label className="input-label">Project Name</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} className="input-field" />
              </div>
              <div className="input-group">
                <label className="input-label">Location</label>
                <input required name="location" value={formData.location} onChange={handleInputChange} className="input-field" />
              </div>
              <div className="input-group">
                <label className="input-label">Client</label>
                <input required name="client" value={formData.client} onChange={handleInputChange} className="input-field" />
              </div>
              <div className="input-group">
                <label className="input-label">Budget</label>
                <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} className="input-field" />
              </div>
              <div className="input-group">
                <label className="input-label">Start Date</label>
                <input type="date" required name="startDate" value={formData.startDate} onChange={handleInputChange} className="input-field" />
              </div>
              <div className="input-group">
                <label className="input-label">End Date</label>
                <input type="date" required name="endDate" value={formData.endDate} onChange={handleInputChange} className="input-field" />
              </div>
              <div className="input-group">
                <label className="input-label">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="input-field">
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Assigned Team</label>
                <input name="assignedTeam" value={formData.assignedTeam} onChange={handleInputChange} className="input-field" placeholder="e.g. Team A" />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Project Image (Optional)</label>
              <input type="file" onChange={handleFileChange} className="input-field" accept="image/*" />
            </div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field" rows="3"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Save Project</button>
          </form>
        </div>
      )}

      {loading && !showForm ? <div className="loading-spinner"></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div key={project.id} className="card">
              <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{project.name}</h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>{project.location}</p>

              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  backgroundColor: '#e5e7eb',
                  textTransform: 'capitalize'
                }}>
                  {project.status}
                </span>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#555', marginTop: '1rem' }}>
                <p>Client: {project.client}</p>
                <p>Budget: ${Number(project.budget).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
