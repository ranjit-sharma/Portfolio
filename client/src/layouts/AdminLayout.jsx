import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner, RSLogo } from '../components/ui/index';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '▦' },
  { label: 'Projects', href: '/admin/projects', icon: '◈' },
  { label: 'Experience', href: '/admin/experience', icon: '◎' },
  { label: 'Skills', href: '/admin/skills', icon: '◇' },
  { label: 'Certifications', href: '/admin/certifications', icon: '◉' },
  { label: 'Messages', href: '/admin/messages', icon: '◻' },
  { label: 'Settings', href: '/admin/settings', icon: '◈' },
];

export default function AdminLayout() {
  const { isAuthenticated, loading, admin, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size={36} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 0',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '0 1.25rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1rem' }}>
            <RSLogo size={22} color="var(--accent)" glow />
            <span>Ranjit<span style={{ color: 'var(--accent)' }}>.</span>Admin</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {admin?.email}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 0.75rem' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  marginBottom: '0.15rem',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)' }}>
          <Link
            to="/"
            style={{
              display: 'block',
              padding: '0.5rem 0.75rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '0.25rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
            }}
          >
            ← View Portfolio
          </Link>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textAlign: 'left',
              fontFamily: 'inherit',
              transition: 'all var(--transition-fast)',
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
}
