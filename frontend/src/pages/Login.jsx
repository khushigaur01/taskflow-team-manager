import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
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
            Welcome back
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
            Sign in to your account
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
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%', background: '#1f2937', border: '1px solid #374151',
                  borderRadius: '8px', padding: '10px 14px', color: '#f9fafb',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', background: '#1f2937', border: '1px solid #374151',
                  borderRadius: '8px', padding: '10px 14px', color: '#f9fafb',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#3730a3' : '#4f46e5',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '12px', fontSize: '15px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginTop: '20px' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '500' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}