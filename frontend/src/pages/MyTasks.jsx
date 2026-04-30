import { useEffect, useState } from 'react';
import api from '../api/axios';

const statusColor = { todo: 'bg-gray-700', in_progress: 'bg-blue-700', review: 'bg-yellow-700', done: 'bg-green-700' };

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const load = () => api.get('/tasks/my').then(r => setTasks(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => { await api.put(`/tasks/${id}`, { status }); load(); };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">My Tasks</h1>
      <div className="space-y-2">
        {tasks.length === 0 && <p className="text-gray-500">No tasks assigned to you.</p>}
        {tasks.map(t => (
          <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{t.title}</p>
              <p className="text-xs text-gray-500 mt-1">{t.project_name} {t.due_date ? `· Due ${new Date(t.due_date).toLocaleDateString()}` : ''}</p>
            </div>
            <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
              className={`text-xs text-white rounded-lg px-3 py-1 border-none ${statusColor[t.status]}`}>
              {['todo','in_progress','review','done'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}