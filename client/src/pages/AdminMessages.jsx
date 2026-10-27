import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { Spinner } from '../components/ui/index';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState('');

  const fetchMessages = useCallback(() => {
    return api.get(`/admin/messages${filter ? `?status=${filter}` : ''}`)
      .then((r) => setMessages(r.data.data?.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const load = useCallback(() => {
    setLoading(true);
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const setStatus = async (id, status) => {
    try {
      setError('');
      await api.patch(`/admin/messages/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update status');
    }
  };

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      setError('');
      await api.delete(`/admin/messages/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete message');
    }
  };

  const statusColors = { unread: 'var(--accent)', read: '#60a5fa', replied: '#a78bfa' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Inquiries & Messages
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Review feedback, project inquiries, and hire requests submitted from the portfolio.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-elevated)', padding: '0.25rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }}>
          {['', 'unread', 'read', 'replied'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                background: filter === s ? 'var(--accent)' : 'transparent',
                color: filter === s ? 'var(--accent-contrast)' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {s ? s.toUpperCase() : 'ALL'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 'var(--radius-md)', color: '#ef4444', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner size={32} /></div>
      ) : messages.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No messages found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {messages.map((m) => (
            <div key={m._id} className="admin-card" style={{ padding: 0, overflow: 'hidden', borderColor: m.status === 'unread' ? 'var(--accent-border)' : 'var(--border)' }}>
              <div
                style={{ padding: '1.15rem 1.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === m._id ? null : m._id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: m.status === 'unread' ? 700 : 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{m.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }}>&lt;{m.email}&gt;</span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: '9999px', background: `${statusColors[m.status]}22`, color: statusColors[m.status], fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                      {m.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{m.subject}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', marginTop: '0.3rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    {new Date(m.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{expanded === m._id ? '▲' : '▼'}</span>
              </div>

              {expanded === m._id && (
                <div style={{ padding: '0 1.35rem 1.35rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', paddingTop: '1rem', marginBottom: '1.25rem' }}>{m.message}</p>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {m.status !== 'read' && (
                      <button onClick={() => setStatus(m._id, 'read')} className="admin-btn-secondary">
                        Mark Read
                      </button>
                    )}
                    {m.status !== 'replied' && (
                      <button onClick={() => setStatus(m._id, 'replied')} className="admin-btn-secondary">
                        Mark Replied
                      </button>
                    )}
                    <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="admin-btn-primary" style={{ padding: '0.55rem 1rem' }}>
                      Reply via Email
                    </a>
                    <button onClick={() => deleteMsg(m._id)} className="admin-btn-danger" style={{ marginLeft: 'auto' }}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
