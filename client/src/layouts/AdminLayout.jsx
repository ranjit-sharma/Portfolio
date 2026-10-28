import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner, RSLogo } from '../components/ui/index';
import UnifiedThemeToggle from '../components/navigation/UnifiedThemeToggle';
import {
  LayoutDashboard,
  FolderGit2,
  GraduationCap,
  Briefcase,
  Cpu,
  Award,
  Mail,
  Sliders,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Terminal,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, code: '01' },
  { label: 'Projects', href: '/admin/projects', icon: FolderGit2, code: '02' },
  { label: 'Education', href: '/admin/education', icon: GraduationCap, code: '03' },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase, code: '04' },
  { label: 'Skills', href: '/admin/skills', icon: Cpu, code: '05' },
  { label: 'Certifications', href: '/admin/certifications', icon: Award, code: '06' },
  { label: 'Messages', href: '/admin/messages', icon: Mail, code: '07' },
  { label: 'Settings', href: '/admin/settings', icon: Sliders, code: '08' },
];

export default function AdminLayout() {
  const { isAuthenticated, loading, admin, logout } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-base)' }}>
        <Spinner size={36} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const currentNav = NAV_ITEMS.find((item) => location.pathname.startsWith(item.href)) || NAV_ITEMS[0];

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1.4rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <RSLogo size={24} color="var(--accent)" glow />
          <div style={{ fontWeight: 800, fontSize: '1.02rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span>Ranjit</span>
            <span style={{ color: 'var(--accent)' }}>.Admin</span>
          </div>
        </div>

        {/* Close button on mobile */}
        {mobileSidebarOpen && (
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close admin menu"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              padding: '0.4rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, padding: '1.25rem 0.85rem', overflowY: 'auto' }}>
        <div
          style={{
            fontSize: '0.68rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0 0.6rem 0.6rem',
            fontWeight: 600,
          }}
        >
          NAVIGATION MODULES
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                  borderLeft: isActive ? '3px solid var(--accent)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isActive ? '0 0 16px -4px var(--accent-glow)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon
                    size={17}
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                      transition: 'color var(--transition-fast)',
                    }}
                  />
                  <span>{item.label}</span>
                </div>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.68rem',
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  [{item.code}]
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile & Footer */}
      <div
        style={{
          padding: '1.1rem 1rem',
          borderTop: '1px solid var(--border)',
          background: 'rgba(0, 0, 0, 0.12)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '0.75rem',
            padding: '0.6rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={admin?.email || 'admin@ranjit.dev'}
            >
              {admin?.email || 'admin@ranjit.dev'}
            </div>
            <div
              style={{
                fontSize: '0.67rem',
                fontFamily: 'JetBrains Mono, monospace',
                color: 'var(--accent)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                marginTop: '1px',
              }}
            >
              SUPER ADMIN
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          aria-label="Sign out of admin console"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.58rem 0.85rem',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.22)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
            e.currentTarget.style.borderColor = '#ef4444';
            e.currentTarget.style.boxShadow = '0 0 14px rgba(239, 68, 68, 0.22)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.22)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-shell">
      {/* Background ambient lighting */}
      <div className="admin-bg-glow" />

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar" style={{ display: 'none' }} id="admin-desktop-sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 270,
          maxWidth: '85vw',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
          zIndex: 999,
          transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-base)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
        id="admin-mobile-drawer"
      >
        {sidebarContent}
      </div>

      {/* Main Workspace Area (Offset by fixed 260px sidebar on desktop) */}
      <div className="admin-main-wrap">
        {/* Top Header Bar */}
        <header className="admin-top-bar">
          {/* Left: Mobile Menu Trigger + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation sidebar"
              className="admin-mobile-btn"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'none',
                flexShrink: 0,
              }}
            >
              <Menu size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, overflow: 'hidden' }}>
              <div
                className="admin-breadcrumb-prefix"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  flexShrink: 0,
                }}
              >
                <Terminal size={14} style={{ color: 'var(--accent)' }} />
                <span>Console</span>
                <ChevronRight size={13} />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentNav.label}
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  color: 'var(--accent)',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--accent-border)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  flexShrink: 0,
                }}
              >
                SYS.{currentNav.code}
              </span>
            </div>
          </div>

          {/* Right: Live Status + THEME TOGGLE (Admin only!) + Live Site */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            {/* Database & System Connection Status */}
            <div className="admin-status-badge" title="Live MongoDB Atlas Connected">
              <span className="admin-status-dot" />
              <span className="admin-status-text">LIVE MONGODB</span>
            </div>

            {/* THEME TOGGLE BUTTON (Placed ONLY in admin side) */}
            <div title="Theme & Color Appearance" style={{ display: 'flex', alignItems: 'center' }}>
              <UnifiedThemeToggle align="right" />
            </div>

            {/* Quick Live Site Link */}
            <Link to="/" target="_blank" rel="noopener noreferrer" className="admin-portal-link" title="View Live Portfolio">
              <span className="admin-portal-text">View Site</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* Page Body Viewport */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          #admin-desktop-sidebar {
            display: flex !important;
          }
          #admin-mobile-drawer {
            display: none !important;
          }
          .admin-mobile-btn {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .admin-mobile-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
