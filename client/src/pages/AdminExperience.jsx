import { useCallback, useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Spinner } from '../components/ui/index';
import { Upload, Trash2, ExternalLink } from 'lucide-react';
import { getAssetUrl } from '../utils/assetUrl';

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
  certificateUrl: '',
  stats: [
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' },
  ],
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
  const [uploadingCert, setUploadingCert] = useState(false);
  const [error, setError] = useState('');
  const certInputRef = useRef(null);

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
    const rawStats = Array.isArray(exp.stats) && exp.stats.length > 0 ? exp.stats : [];
    const filledStats = [
      rawStats[0] || { value: '', label: '' },
      rawStats[1] || { value: '', label: '' },
      rawStats[2] || { value: '', label: '' },
    ];

    setForm({
      ...exp,
      companyShort: exp.companyShort || '',
      companySub: exp.companySub || '',
      durationText: exp.durationText || '',
      projectTitle: exp.projectTitle || '',
      repoUrl: exp.repoUrl || '',
      certificateUrl: exp.certificateUrl || '',
      stats: filledStats,
      startDate: fmtDate(exp.startDate),
      endDate: fmtDate(exp.endDate),
      responsibilities: (exp.responsibilities || []).join('\n'),
      technologies: (exp.technologies || []).join(', '),
    });
    setEditing(exp._id);
    setShowForm(true);
    setError('');
  };

  const handleCertificateUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingCert(true);
    setError('');
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, certificateUrl: res.data.data.url }));
    } catch (err) {
      setError(err.message || 'Certificate upload failed');
    } finally {
      setUploadingCert(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const cleanStats = (form.stats || [])
      .map((s) => ({ value: (s.value || '').trim(), label: (s.label || '').trim() }))
      .filter((s) => s.value || s.label);

    const payload = {
      ...form,
      stats: cleanStats,
      responsibilities: form.responsibilities
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: form.technologies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      displayOrder: parseInt(form.displayOrder) || 0,
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
    try {
      await api.delete(`/admin/experience/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete experience');
    }
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
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Work Experience
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Manage career history, internships, roles, company logos, and verified credentials.
          </p>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY);
            setEditing(null);
            setShowForm(true);
            setError('');
          }}
          className="admin-btn-primary"
        >
          + Add Experience
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.75rem' }}>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '0.85rem' }}>
            <div className="admin-grid-2">
              <div>
                <label style={labelSt}>Company Name *</label>
                <input
                  style={inputSt}
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  placeholder="e.g. DRDO PXE"
                  required
                />
              </div>
              <div>
                <label style={labelSt}>Company Badge / Initials</label>
                <input
                  style={inputSt}
                  value={form.companyShort}
                  onChange={(e) => setForm((f) => ({ ...f, companyShort: e.target.value }))}
                  placeholder="e.g. DRDO"
                />
              </div>
              <div>
                <label style={labelSt}>Company Subtitle / Location details</label>
                <input
                  style={inputSt}
                  value={form.companySub}
                  onChange={(e) => setForm((f) => ({ ...f, companySub: e.target.value }))}
                  placeholder="e.g. DRDO — PXE Chandipur"
                />
              </div>
              <div>
                <label style={labelSt}>Role *</label>
                <input
                  style={inputSt}
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="e.g. Software Engineering Intern"
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
                  placeholder="e.g. Chandipur, Odisha"
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
              <div>
                <label style={labelSt}>Duration Display Text</label>
                <input
                  style={inputSt}
                  value={form.durationText}
                  onChange={(e) => setForm((f) => ({ ...f, durationText: e.target.value }))}
                  placeholder="e.g. 1 month (or auto-calculated if blank)"
                />
              </div>
              <div>
                <label style={labelSt}>Project Title</label>
                <input
                  style={inputSt}
                  value={form.projectTitle}
                  onChange={(e) => setForm((f) => ({ ...f, projectTitle: e.target.value }))}
                  placeholder="e.g. Upper Air Sounding System (UASS)"
                />
              </div>
              <div>
                <label style={labelSt}>GitHub / Repo URL</label>
                <input
                  style={inputSt}
                  value={form.repoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))}
                  placeholder="e.g. https://github.com/ranjit-sharma"
                />
              </div>
              <div>
                <label style={labelSt}>Display Order</label>
                <input
                  type="number"
                  style={inputSt}
                  value={form.displayOrder}
                  onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))}
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

            {/* Certificate Upload Field */}
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <label style={{ ...labelSt, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Internship Certificate (Upload or URL)
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  style={{ ...inputSt, flex: 1, minWidth: '220px' }}
                  value={form.certificateUrl}
                  onChange={(e) => setForm((f) => ({ ...f, certificateUrl: e.target.value }))}
                  placeholder="e.g. /uploads/cert_5_drdo.png or https://..."
                />
                <input
                  type="file"
                  ref={certInputRef}
                  accept="image/*,application/pdf"
                  onChange={handleCertificateUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => certInputRef.current?.click()}
                  disabled={uploadingCert}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 0.9rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <Upload size={14} />
                  {uploadingCert ? 'Uploading...' : 'Upload File'}
                </button>
                {form.certificateUrl && (
                  <>
                    <a
                      href={getAssetUrl(form.certificateUrl)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.82rem',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      <ExternalLink size={14} /> View
                    </a>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, certificateUrl: '' }))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                      title="Remove certificate"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stats Block (3 pairs of value and label) */}
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <label style={{ ...labelSt, marginBottom: '0.6rem' }}>
                Highlight Stats (Up to 3 numeric/metric counters)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0.75rem' }}>
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      background: 'var(--bg-surface)',
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Stat #{idx + 1}
                    </span>
                    <input
                      style={inputSt}
                      value={form.stats?.[idx]?.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm((f) => {
                          const nextStats = [...(f.stats || [])];
                          nextStats[idx] = { ...(nextStats[idx] || {}), value: val };
                          return { ...f, stats: nextStats };
                        });
                      }}
                      placeholder="Value (e.g. 5+ or 100%)"
                    />
                    <input
                      style={inputSt}
                      value={form.stats?.[idx]?.label || ''}
                      onChange={(e) => {
                        const lbl = e.target.value;
                        setForm((f) => {
                          const nextStats = [...(f.stats || [])];
                          nextStats[idx] = { ...(nextStats[idx] || {}), label: lbl };
                          return { ...f, stats: nextStats };
                        });
                      }}
                      placeholder="Label (e.g. TELEMETRY STREAMS)"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={labelSt}>Description / Overview</label>
              <textarea
                style={{ ...inputSt, resize: 'vertical', minHeight: 70 }}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label style={labelSt}>Responsibilities / Key Achievements (one per line with checkmark)</label>
              <textarea
                style={{ ...inputSt, resize: 'vertical', minHeight: 110 }}
                value={form.responsibilities}
                onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value }))}
                placeholder="Owned real-time telemetry processing...&#10;Built real-time monitoring interfaces...&#10;Implemented TCP/UDP socket communication..."
              />
            </div>
            <div>
              <label style={labelSt}>Technologies (comma-separated)</label>
              <input
                style={inputSt}
                value={form.technologies}
                onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
                placeholder="React, Node.js, JavaScript, TCP/UDP, Data Visualization"
              />
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
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
                className="admin-btn-secondary"
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
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No experience entries yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {items.map((exp) => (
            <div
              key={exp._id}
              className="admin-card admin-list-item"
              style={{ padding: '1.15rem 1.35rem' }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  {exp.role} <span style={{ color: 'var(--accent)' }}>@ {exp.company}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                  {exp.employmentType} · {exp.location || 'Location not specified'}
                  {exp.certificateUrl && ' · 📜 Certificate attached'}
                </div>
              </div>
              <div className="admin-list-actions">
                <button
                  onClick={() => openEdit(exp)}
                  className="admin-btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="admin-btn-danger"
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
