import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { Spinner, SkillIcon } from '../components/ui/index';

const EMPTY = { name: '', category: 'Frontend', displayOrder: 0 };
const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Language', 'CS Fundamentals', 'Tools'];

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSkills = useCallback(() => {
    return api.get('/admin/skills')
      .then((r) => setSkills(r.data.data || []))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const openEdit = (s) => { setForm({ name: s.name, category: s.category, displayOrder: s.displayOrder || 0 }); setEditing(s._id); setShowForm(true); setError(''); };
  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowForm(true); setError(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await api.put(`/admin/skills/${editing}`, form);
      else await api.post('/admin/skills', form);
      setShowForm(false);
      load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    await api.delete(`/admin/skills/${id}`).catch(console.error);
    load();
  };

  const inputSt = { width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.6rem 0.8rem', color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none' };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Skills</h1>
        <button onClick={openCreate} style={{ background: 'var(--accent)', color: '#111', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.55rem 1.1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          + Add Skill
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '0.75rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Skill Name *</label>
              <input style={inputSt} value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Category</label>
              <select style={{ ...inputSt, cursor: 'pointer' }} value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Order</label>
              <input type="number" style={{ ...inputSt, width: 70 }} value={form.displayOrder} onChange={(e) => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} />
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button type="submit" disabled={saving} style={{ background: 'var(--accent)', color: '#111', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {saving ? '...' : editing ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.6rem 0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                ✕
              </button>
            </div>
          </form>
          {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.5rem' }}>{error}</p>}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner size={32} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {CATEGORIES.map((cat) => (
            <div key={cat} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>{cat}</h3>
              {grouped[cat].length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No skills</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {grouped[cat].map((s) => (
                    <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <SkillIcon name={s.name} size={16} />
                        <span style={{ fontSize: '0.875rem' }}>{s.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button onClick={() => openEdit(s)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}>✏</button>
                        <button onClick={() => handleDelete(s._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
