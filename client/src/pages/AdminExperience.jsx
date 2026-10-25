import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { Spinner } from '../components/ui/index';

const EMPTY = {
  company: '',
  companyShort: '',
  companySub: '',
  role: '',
  employmentType: 'Internship',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  durationText: '',
  projectTitle: '',
  repoUrl: '',
  repoLabel: 'Database repo',
  certificateUrl: '',
  stats: '',
  description: '',
  responsibilities: '',
  technologies: '',
  displayOrder: 0,
};

const EMP_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toISOString().slice(0, 10);
}

export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = useCallback(() => {
    return api
      .get('/admin/experience')
      .then((r) => setItems(r.data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openEdit = (exp) => {
    setForm({
      ...EMPTY,
      ...exp,
      startDate: fmtDate(exp.startDate),
      endDate: fmtDate(exp.endDate),
      stats: (exp.stats || []).map((s) => `${s.value}: ${s.label}`).join('\n'),
      responsibilities: (exp.responsibilities || []).join('\n'),
      technologies: (exp.technologies || []).join(', '),
    });
    setEditing(exp._id);
    setShowForm(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const statsParsed = (form.stats || '')
      .split('\n')
      .map((l) => {
        const parts = l.split(':');
        const value = parts[0]?.trim() || '';
        const label = parts.slice(1).join(':').trim() || '';
        return { value, label };
      })
      .filter((s) => s.value || s.label);

    const payload = {
      ...form,
      stats: statsParsed,
      responsibilities: form.responsibilities
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: form.technologies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      displayOrder: parseInt(form.displayOrder, 10) || 0,
    };

    try {
      if (editing) await api.put(`/admin/experience/${editing}`, payload);
      else await api.post('/admin/experience', payload);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return;
    await api.delete(`/admin/experience/${id}`).catch(console.error);
    load();
  };

  const inputSt = {
    width: '100%',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '0.6rem 0.8rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
  };
  const labelSt = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.3rem',
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Experience</h1>
        <button
          onClick={() => {
            setForm(EMPTY);
            setEditing(null);
            setShowForm(true);
            setError('');
          }}
          style={{
            background: 'var(--accent)',
            color: '#111',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.55rem 1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          + Add Experience
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelSt}>Company *</label>
                <input
                  style={inputSt}
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={labelSt}>Logo Tag / Acronym (e.g. DRDO)</label>
                <input
                  style={inputSt}
                  value={form.companyShort || ''}
                  onChange={(e) => setForm((f) => ({ ...f, companyShort: e.target.value }))}
                  placeholder="DRDO"
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelSt}>Company Full Subtitle (e.g. DRDO — PXE Chandipur)</label>
                <input
                  style={inputSt}
                  value={form.companySub || ''}
                  onChange={(e) => setForm((f) => ({ ...f, companySub: e.target.value }))}
                  placeholder="DRDO — PXE Chandipur"
                />
              </div>
              <div>
                <label style={labelSt}>Role *</label>
                <input
                  style={inputSt}
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={labelSt}>Employment Type</label>
                <select
                  style={{ ...inputSt, cursor: 'pointer' }}
                  value={form.employmentType}
                  onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))}
                >
                  {EMP_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelSt}>Location</label>
                <input
                  style={inputSt}
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
              <div>
                <label style={labelSt}>Duration Tag (optional, e.g. 1 month)</label>
                <input
                  style={inputSt}
                  value={form.durationText || ''}
                  onChange={(e) => setForm((f) => ({ ...f, durationText: e.target.value }))}
                  placeholder="1 month"
                />
              </div>
              <div>
                <label style={labelSt}>Start Date *</label>
                <input
                  type="date"
                  style={inputSt}
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={labelSt}>End Date</label>
                <input
                  type="date"
                  style={inputSt}
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  disabled={form.current}
                />
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
              }}
            >
              <input
                type="checkbox"
                checked={form.current}
                onChange={(e) => setForm((f) => ({ ...f, current: e.target.checked, endDate: '' }))}
              />
              Currently working here
            </label>

            <div
              style={{
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                background: 'var(--bg-elevated)',
              }}
            >
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', fontWeight: 700 }}>
                Project & Metrics Showcase (Optional)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelSt}>Project Title</label>
                  <input
                    style={inputSt}
                    value={form.projectTitle || ''}
                    onChange={(e) => setForm((f) => ({ ...f, projectTitle: e.target.value }))}
                    placeholder="e.g. UAS-RTMVD"
                  />
                </div>
                <div>
                  <label style={labelSt}>Repo URL</label>
                  <input
                    style={inputSt}
                    value={form.repoUrl || ''}
                    onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label style={labelSt}>Repo Button Label</label>
                  <input
                    style={inputSt}
                    value={form.repoLabel || ''}
                    onChange={(e) => setForm((f) => ({ ...f, repoLabel: e.target.value }))}
                    placeholder="Database repo"
                  />
                </div>
                <div>
                  <label style={labelSt}>Certificate Link / URL</label>
                  <input
                    style={inputSt}
                    value={form.certificateUrl || ''}
                    onChange={(e) => setForm((f) => ({ ...f, certificateUrl: e.target.value }))}
                    placeholder="#certifications or https://..."
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelSt}>Stat Counters (one per line, format: "Value: Label")</label>
                  <textarea
                    style={{ ...inputSt, resize: 'vertical', minHeight: 65 }}
                    value={form.stats || ''}
                    onChange={(e) => setForm((f) => ({ ...f, stats: e.target.value }))}
                    placeholder="6: TABLES DESIGNED&#10;65: SQL STATEMENTS&#10;H2: FULLY TESTED"
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={labelSt}>Responsibilities (one per line, shown with custom checkmarks)</label>
              <textarea
                style={{ ...inputSt, resize: 'vertical', minHeight: 100 }}
                value={form.responsibilities}
                onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value }))}
              />
            </div>

            <div>
              <label style={labelSt}>Technologies (comma-separated)</label>
              <input
                style={inputSt}
                value={form.technologies}
                onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
              />
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: 'var(--accent)',
                  color: '#111',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 1rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner size={32} />
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No experience entries yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((exp) => (
            <div
              key={exp._id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>
                  {exp.role} @ {exp.company}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {exp.employmentType} · {exp.location}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => openEdit(exp)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.4rem 0.8rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.82rem',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #ef444440',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.4rem 0.8rem',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.82rem',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
