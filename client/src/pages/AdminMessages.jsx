import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { Spinner } from '../components/ui/index';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

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
    await api.patch(`/admin/messages/${id}/status`, { status }).catch(console.error);
    load();
  };

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/admin/messages/${id}`).catch(console.error);
    load();
  };

  const statusColors = { unread: 'var(--accent)', read: '#60a5fa', replied: '#a78bfa' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Messages</h1>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['', 'unread', 'read', 'replied'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '0.35rem 0.8rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem',
                border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit',
                background: filter === s ? 'var(--accent)' : 'transparent',
                color: filter === s ? '#111' : 'var(--text-secondary)',
              }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner size={32} /></div>
      ) : messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No messages found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.map((m) => (
            <div key={m._id} style={{ background: 'var(--bg-surface)', border: `1px solid ${m.status === 'unread' ? 'var(--border-strong)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div
                style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === m._id ? null : m._id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: m.status === 'unread' ? 700 : 500, fontSize: '0.9rem' }}>{m.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>&lt;{m.email}&gt;</span>
                    <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.5rem', borderRadius: '9999px', background: `${statusColors[m.status]}22`, color: statusColors[m.status], fontWeight: 600 }}>{m.status}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.subject}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                    {new Date(m.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{expanded === m._id ? '▲' : '▼'}</span>
              </div>

              {expanded === m._id && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', paddingTop: '1rem', marginBottom: '1rem' }}>{m.message}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {m.status !== 'read' && (
                      <button onClick={() => setStatus(m._id, 'read')} style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' }}>
                        Mark Read
                      </button>
                    )}
                    {m.status !== 'replied' && (
                      <button onClick={() => setStatus(m._id, 'replied')} style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' }}>
                        Mark Replied
                      </button>
                    )}
                    <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: '#111', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
                      Reply via Email
                    </a>
                    <button onClick={() => deleteMsg(m._id)} style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #ef444440', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', marginLeft: 'auto' }}>
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
