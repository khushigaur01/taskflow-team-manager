import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Trash2, UserPlus } from 'lucide-react';

const STATUSES = ['todo', 'in_progress', 'review', 'done'];
const statusColor = { todo: 'bg-gray-700', in_progress: 'bg-blue-700', review: 'bg-yellow-700', done: 'bg-green-700' };
const priorityColor = { low: 'text-gray-400', medium: 'text-yellow-400', high: 'text-red-400' };

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assigned_to: '', due_date: '', priority: 'medium' });
  const [memberEmail, setMemberEmail] = useState('');

  const load = async () => {
    const [proj, t, u] = await Promise.all([api.get(`/projects/${id}`), api.get(`/tasks/project/${id}`), api.get('/users')]);
    setProject(proj.data); setTasks(t.data); setUsers(u.data);
  };
  useEffect(() => { load(); }, [id]);

  const createTask = async (e) => {
    e.preventDefault();
    await api.post('/tasks', { ...taskForm, project_id: parseInt(id) });
    setTaskForm({ title: '', description: '', assigned_to: '', due_date: '', priority: 'medium' });
    setShowTaskForm(false); load();
  };

  const updateStatus = async (taskId, status) => {
    await api.put(`/tasks/${taskId}`, { status }); load();
  };

  const deleteTask = async (taskId) => {
    if (confirm('Delete this task?')) { await api.delete(`/tasks/${taskId}`); load(); }
  };

  const addMember = async (e) => {
    e.preventDefault();
    await api.post(`/projects/${id}/members`, { email: memberEmail });
    setMemberEmail(''); setShowMemberForm(false); load();
  };

  if (!project) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowMemberForm(!showMemberForm)}
            className="flex items-center gap-2 border border-gray-700 hover:border-indigo-500 text-gray-300 px-3 py-2 rounded-lg text-sm">
            <UserPlus size={16} /> Members
          </button>
          <button onClick={() => setShowTaskForm(!showTaskForm)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {showMemberForm && (
        <form onSubmit={addMember} className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4 flex gap-2">
          <input value={memberEmail} onChange={e => setMemberEmail(e.target.value)} placeholder="Member email"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">Add</button>
        </form>
      )}

      {showTaskForm && (
        <form onSubmit={createTask} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-3">
          <input value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} placeholder="Task title"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" required />
          <div className="grid grid-cols-3 gap-3">
            <select value={taskForm.assigned_to} onChange={e => setTaskForm({...taskForm, assigned_to: e.target.value})}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
              <option value="">Unassigned</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
              {['low','medium','high'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="date" value={taskForm.due_date} onChange={e => setTaskForm({...taskForm, due_date: e.target.value})}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">Create</button>
            <button type="button" onClick={() => setShowTaskForm(false)} className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STATUSES.map(status => (
          <div key={status} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="font-medium text-gray-300 mb-3 capitalize">{status.replace('_', ' ')}</h3>
            <div className="space-y-2">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-white font-medium">{task.title}</span>
                    <button onClick={() => deleteTask(task.id)} className="text-gray-600 hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                  {task.assignee_name && <p className="text-xs text-gray-500 mt-1">→ {task.assignee_name}</p>}
                  {task.due_date && <p className="text-xs text-gray-500">{new Date(task.due_date).toLocaleDateString()}</p>}
                  <span className={`text-xs font-medium ${priorityColor[task.priority]}`}>{task.priority}</span>
                  <select value={task.status} onChange={e => updateStatus(task.id, e.target.value)}
                    className="w-full mt-2 bg-gray-700 text-xs text-white rounded px-2 py-1 border-none">
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-medium text-white mb-3">Team Members</h3>
        <div className="flex flex-wrap gap-2">
          {project.members?.map(m => (
            <div key={m.id} className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1">
              <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-xs">{m.name[0]}</div>
              <span className="text-sm text-gray-300">{m.name}</span>
              <span className="text-xs text-indigo-400">{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}