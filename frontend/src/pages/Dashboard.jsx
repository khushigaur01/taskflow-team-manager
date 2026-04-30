import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const card = {
  background: '#111827', border: '1px solid #1f2937',
  borderRadius: '12px', padding: '20px'
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/tasks/dashboard').then(r => setData(r.data)).catch(console.error);
  }, []);

  if (!data) return (
    <div style={{ padding: '32px', color: '#9ca3af' }}>Loading dashboard...</div>
  );

  const statusMap = Object.fromEntries(data.byStatus.map(s => [s.status, parseInt(s.count)]));

  const stats = [
    { label: 'Total Tasks', value: data.total, color: '#818cf8', emoji: '📋' },
    { label: 'In Progress', value: statusMap.in_progress || 0, color: '#60a5fa', emoji: '⏳' },
    { label: 'Completed', value: statusMap.done || 0, color: '#34d399', emoji: '✅' },
    { label: 'Overdue', value: data.overdue.length, color: '#f87171', emoji: '🚨' },
  ];

  const statusColor = {
    todo: '#4b5563', in_progress: '#2563eb',
    review: '#d97706', done: '#16a34a'
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#f9fafb' }}>
          Good day, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>
          Here's what's happening with your tasks
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {stats.map(({ label, value, color, emoji }) => (
          <div key={label} style={card}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{emoji}</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>{value}</div>
            <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Overdue */}
        <div style={card}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f9fafb', marginBottom: '16px' }}>
            🚨 Overdue Tasks
          </h2>
          {data.overdue.length === 0
            ? <p style={{ color: '#6b7280', fontSize: '14px' }}>No overdue tasks 🎉</p>
            : data.overdue.map(t => (
              <div key={t.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid #1f2937'
              }}>
                <span style={{ fontSize: '14px', color: '#f9fafb' }}>{t.title}</span>
                <span style={{ fontSize: '12px', color: '#f87171' }}>{t.project_name}</span>
              </div>
            ))}
        </div>

        {/* Recent */}
        <div style={card}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f9fafb', marginBottom: '16px' }}>
            🕐 Recent Tasks
          </h2>
          {data.recent.length === 0
            ? <p style={{ color: '#6b7280', fontSize: '14px' }}>No tasks yet</p>
            : data.recent.map(t => (
              <div key={t.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid #1f2937'
              }}>
                <span style={{ fontSize: '14px', color: '#f9fafb' }}>{t.title}</span>
                <span style={{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                  background: statusColor[t.status] || '#4b5563', color: '#fff'
                }}>
                  {t.status?.replace('_', ' ')}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}