import { useEffect, useState } from 'react';
import api from '../services/api';
import { Spinner } from '../components/ui/index';

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
    { label: 'Total Views', value: stats?.views, icon: '👁', href: '/admin/settings', color: 'var(--accent)' },
    { label: 'Projects', value: stats?.projects, icon: '◈', href: '/admin/projects', color: '#60a5fa' },
    { label: 'Experience', value: stats?.experience, icon: '◎', href: '/admin/experience', color: '#34d399' },
    { label: 'Messages', value: stats?.messages, icon: '◻', href: '/admin/messages', color: '#f472b6' },
    { label: 'Skills', value: stats?.skills, icon: '◇', href: '/admin/skills', color: '#a78bfa' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Welcome back. Here's a quick overview of your portfolio content.
      </p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner size={32} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {cards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span style={{ fontSize: '1.5rem', color: card.color }}>{card.icon}</span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {card.value ?? '—'}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                {card.label}
              </span>
            </a>
          ))}
        </div>
      )}

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { label: 'Add Project', href: '/admin/projects' },
            { label: 'Add Experience', href: '/admin/experience' },
            { label: 'View Messages', href: '/admin/messages' },
            { label: 'Update Settings', href: '/admin/settings' },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
