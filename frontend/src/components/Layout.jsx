import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#030712', color: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', minWidth: '240px', background: '#111827',
        borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid #1f2937' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#818cf8' }}>TaskFlow</div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Team Task Manager</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/projects', icon: FolderKanban, label: 'Projects' },
            { to: '/my-tasks', icon: CheckSquare, label: 'My Tasks' },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '8px', fontSize: '14px',
              textDecoration: 'none', transition: 'all 0.2s',
              background: isActive ? '#4f46e5' : 'transparent',
              color: isActive ? '#fff' : '#9ca3af',
            })}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px', borderTop: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#4f46e5', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 'bold', fontSize: '14px'
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#f9fafb' }}>{user?.name}</div>
              <div style={{ fontSize: '12px', color: '#818cf8', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '14px', color: '#9ca3af', background: 'none',
            border: 'none', cursor: 'pointer', padding: '4px 0'
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}