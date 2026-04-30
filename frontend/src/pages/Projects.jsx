import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const load = () => api.get('/projects').then(r => setProjects(r.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/projects', form);
    setForm({ name: '', description: '' });
    setShowForm(false);
    load();
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#f9fafb' }}>Projects</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Manage your team projects</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#4f46e5', color: '#fff', border: 'none',
          padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '500'
        }}>
          + New Project
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: '#111827', border: '1px solid #1f2937',
          borderRadius: '12px', padding: '20px', marginBottom: '24px'
        }}>
          <h3 style={{ color: '#f9fafb', marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
            Create New Project
          </h3>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Project name *"
            required
            style={{
              width: '100%', background: '#1f2937', border: '1px solid #374151',
              borderRadius: '8px', padding: '10px 14px', color: '#f9fafb',
              fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box'
            }}
          />
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
            rows={3}
            style={{
              width: '100%', background: '#1f2937', border: '1px solid #374151',
              borderRadius: '8px', padding: '10px 14px', color: '#f9fafb',
              fontSize: '14px', marginBottom: '16px', outline: 'none',
              resize: 'vertical', boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{
              background: '#4f46e5', color: '#fff', border: 'none',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
            }}>
              Create Project
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{
              background: '#374151', color: '#f9fafb', border: 'none',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
            }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px', background: '#111827',
          borderRadius: '12px', border: '1px dashed #374151'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>No projects yet.</p>
          <p style={{ color: '#4b5563', fontSize: '14px', marginTop: '4px' }}>Click "New Project" to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {projects.map(p => (
            <Link to={`/projects/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#111827', border: '1px solid #1f2937',
                borderRadius: '12px', padding: '20px', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4f46e5'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1f2937'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: '#312e81', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '18px'
                  }}>📂</div>
                  <div>
                    <h3 style={{ color: '#f9fafb', fontWeight: '600', fontSize: '16px' }}>{p.name}</h3>
                    <p style={{ color: '#6b7280', fontSize: '12px' }}>by {p.owner_name}</p>
                  </div>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.5' }}>
                  {p.description || 'No description provided'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}