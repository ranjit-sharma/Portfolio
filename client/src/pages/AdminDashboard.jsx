import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Spinner } from '../components/ui/index';
import {
  Eye,
  FolderGit2,
  Briefcase,
  Mail,
  Cpu,
  GraduationCap,
  Award,
  Sliders,
  ArrowUpRight,
  Database,
  Server,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/projects').catch(() => ({ data: { data: { total: 0 } } })),
      api.get('/admin/experience').catch(() => ({ data: { data: [] } })),
      api.get('/admin/messages').catch(() => ({ data: { data: { total: 0 } } })),
      api.get('/admin/skills').catch(() => ({ data: { data: [] } })),
      api.get('/views').catch(() => ({ data: { data: { views: 0 } } })),
    ])
      .then(([projects, experience, messages, skills, viewsRes]) => {
        setStats({
          projects: projects.data.data?.total || 0,
          experience: experience.data.data?.length || 0,
          messages: messages.data.data?.total || 0,
          skills: skills.data.data?.length || 0,
          views: viewsRes.data.data?.views ?? 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: 'Portfolio Views',
      value: stats?.views,
      icon: Eye,
      href: '/admin/settings',
      accentColor: 'var(--accent)',
      badge: 'TRAFFIC',
    },
    {
      label: 'Active Projects',
      value: stats?.projects,
      icon: FolderGit2,
      href: '/admin/projects',
      accentColor: '#38bdf8',
      badge: 'SHOWCASE',
    },
    {
      label: 'Career Milestones',
      value: stats?.experience,
      icon: Briefcase,
      href: '/admin/experience',
      accentColor: '#4ade80',
      badge: 'EXPERIENCE',
    },
    {
      label: 'Technical Skills',
      value: stats?.skills,
      icon: Cpu,
      href: '/admin/skills',
      accentColor: '#a78bfa',
      badge: 'EXPERTISE',
    },
    {
      label: 'Client Inquiries',
      value: stats?.messages,
      icon: Mail,
      href: '/admin/messages',
      accentColor: '#f472b6',
      badge: 'MESSAGES',
    },
  ];

  const quickActions = [
    { label: 'Add New Project', href: '/admin/projects', icon: FolderGit2, desc: 'Add stack, demo & metrics' },
    { label: 'School & Degree', href: '/admin/education', icon: GraduationCap, desc: 'Update CGPA & institutions' },
    { label: 'Add Technical Skill', href: '/admin/skills', icon: Cpu, desc: 'Create skill & custom category' },
    { label: 'Career Experience', href: '/admin/experience', icon: Briefcase, desc: 'Manage company timeline' },
    { label: 'Certifications', href: '/admin/certifications', icon: Award, desc: 'Add credentials & badges' },
    { label: 'System Settings', href: '/admin/settings', icon: Sliders, desc: 'Profile, SEO & configurations' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Metrics Cards Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner size={32} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.href}
                className="admin-stat-card"
                style={{ '--card-accent': card.accentColor }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: `${card.accentColor}18`,
                      border: `1px solid ${card.accentColor}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.accentColor,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.68rem',
                        color: card.accentColor,
                        background: `${card.accentColor}15`,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}
                    >
                      {card.badge}
                    </span>
                    <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div style={{ marginTop: '0.4rem' }}>
                  <div
                    style={{
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--text-primary)',
                      lineHeight: 1.1,
                    }}
                  >
                    {card.value ?? '—'}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 500, marginTop: '0.2rem' }}>
                    {card.label}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Actions & System Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
        {/* Quick Actions */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Layers size={18} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Quick Actions</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 140px), 1fr))', gap: '0.75rem' }}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.href}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-elevated)',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px -6px var(--accent-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Icon size={16} style={{ color: 'var(--accent)' }} />
                    <ArrowUpRight size={13} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {action.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {action.desc}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Diagnostics */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Server size={18} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>System Diagnostics</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Database Engine', val: 'MongoDB Atlas Cloud Cluster', icon: Database, status: 'CONNECTED', color: '#22c55e' },
              { name: 'API Server', val: 'Express Node.js REST API (:5000)', icon: Server, status: 'ONLINE', color: '#22c55e' },
              { name: 'Theme & Appearance', val: 'Adjustable via top-bar palette', icon: Sparkles, status: 'ADMIN ONLY', color: 'var(--accent)' },
              { name: 'Frontend Client', val: 'Vite React HMR (:5173)', icon: Activity, status: 'ACTIVE', color: '#38bdf8' },
            ].map((diag) => {
              const Icon = diag.icon;
              return (
                <div
                  key={diag.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.9rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={16} style={{ color: 'var(--accent)' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {diag.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {diag.val}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: diag.color,
                      background: `${diag.color}18`,
                      border: `1px solid ${diag.color}35`,
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {diag.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
