import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signup(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: '#1f2937', border: '1px solid #374151',
    borderRadius: '8px', padding: '10px 14px', color: '#f9fafb',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px'
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#030712',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#818cf8' }}>TaskFlow</div>
          <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '14px' }}>Team Task Manager</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#111827', border: '1px solid #1f2937',
          borderRadius: '16px', padding: '32px'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f9fafb', marginBottom: '8px' }}>
            Create account
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
            Join your team on TaskFlow
          </p>

          {error && (
            <div style={{
              background: '#450a0a', border: '1px solid #991b1b',
              color: '#fca5a5', borderRadius: '8px', padding: '12px',
              fontSize: '14px', marginBottom: '16px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" value={form.name} placeholder="Khushi Gour"
                onChange={e => setForm({ ...form, name: e.target.value })}
                required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} placeholder="you@example.com"
                onChange={e => setForm({ ...form, email: e.target.value })}
                required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Password</label>
              <input type="password" value={form.password} placeholder="••••••••"
                onChange={e => setForm({ ...form, password: e.target.value })}
                required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={inputStyle}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? '#3730a3' : '#4f46e5',
              color: '#fff', border: 'none', borderRadius: '8px',
              padding: '12px', fontSize: '15px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginTop: '20px' }}>
            Have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '500' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}