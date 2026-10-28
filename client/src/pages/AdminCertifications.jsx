import { useCallback, useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Spinner } from '../components/ui/index';
import { Upload, Trash2 } from 'lucide-react';
import { getAssetUrl } from '../utils/assetUrl';

const EMPTY = { name: '', issuer: '', issueDate: '', credentialUrl: '', image: '', description: '', category: 'Certifications', windowTitle: '', badge: '', dateTag: '', displayOrder: 0 };

export default function AdminCertifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const certPhotoRef = useRef(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingPhoto(true);
    setError('');
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, image: res.data.data.url }));
    } catch (err) {
      setError(err.message || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const fetchItems = useCallback(() => {
    return api.get('/admin/certifications').then(r => setItems(r.data.data || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openEdit = (c) => {
    setForm({ ...c, issueDate: c.issueDate ? new Date(c.issueDate).toISOString().slice(0, 10) : '' });
    setEditing(c._id); setShowForm(true); setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await api.put(`/admin/certifications/${editing}`, form);
      else await api.post('/admin/certifications', form);
      setShowForm(false); load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await api.delete(`/admin/certifications/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete certification');
    }
  };

  const inputSt = { width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.6rem 0.8rem', color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none' };
  const labelSt = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Certifications & Badges
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Manage certificates, internships, competition awards, credential links, and documents.
          </p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); setError(''); }} className="admin-btn-primary">
          + Add Certification
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.75rem' }}>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '0.85rem' }}>
            <div className="admin-grid-2">
              <div><label style={labelSt}>Name *</label><input style={inputSt} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div><label style={labelSt}>Issuer *</label><input style={inputSt} value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} required /></div>
              <div><label style={labelSt}>Issue Date</label><input type="date" style={inputSt} value={form.issueDate} onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} /></div>
              <div><label style={labelSt}>Display Order</label><input type="number" style={inputSt} value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} /></div>
              <div>
                <label style={labelSt}>Category *</label>
                <select style={inputSt} value={form.category || 'Certifications'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="Certifications">Certifications</option>
                  <option value="Internships">Internships</option>
                  <option value="Competitions">Competitions</option>
                </select>
              </div>
              <div><label style={labelSt}>Window Mockup Title</label><input style={inputSt} value={form.windowTitle || ''} onChange={e => setForm(f => ({ ...f, windowTitle: e.target.value }))} placeholder="e.g. Oracle University, NPTEL, DRDO" /></div>
              <div><label style={labelSt}>Badge / Score</label><input style={inputSt} value={form.badge || ''} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="e.g. Valid until Oct 2027, Elite - Silver · 77%" /></div>
              <div><label style={labelSt}>Date / Duration Tag</label><input style={inputSt} value={form.dateTag || ''} onChange={e => setForm(f => ({ ...f, dateTag: e.target.value }))} placeholder="e.g. Oct 2025, Jan-Apr 2025 · 12 weeks" /></div>
            </div>
            <div><label style={labelSt}>Credential URL</label><input type="url" style={inputSt} value={form.credentialUrl} onChange={e => setForm(f => ({ ...f, credentialUrl: e.target.value }))} placeholder="https://..." /></div>
            <div>
              <label style={labelSt}>Certificate Photo / Document (Image or PDF)</label>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  ref={certPhotoRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,.pdf"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />

                {form.image ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {form.image.toLowerCase().endsWith('.pdf') ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '1.4rem' }}>📄</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>PDF Certificate Document</span>
                          <a href={form.image} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                            View Uploaded PDF ↗
                          </a>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={getAssetUrl(form.image)}
                        alt="Certificate Preview"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        style={{ width: 100, height: 65, objectFit: 'contain', background: 'var(--bg-surface)', padding: 2, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                      />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <button
                        type="button"
                        disabled={uploadingPhoto}
                        onClick={() => certPhotoRef.current?.click()}
                        style={{
                          background: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          width: 'fit-content',
                        }}
                      >
                        {uploadingPhoto ? <Spinner size={12} /> : <Upload size={12} />} Change Certificate File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (form.image) {
                            api.delete('/admin/upload', { data: { url: form.image } }).catch(() => {});
                          }
                          setForm((f) => ({ ...f, image: '' }));
                        }}
                        style={{
                          background: 'transparent',
                          color: '#ef4444',
                          border: 'none',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: 0,
                          width: 'fit-content',
                        }}
                      >
                        <Trash2 size={12} /> Remove Certificate
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      disabled={uploadingPhoto}
                      onClick={() => certPhotoRef.current?.click()}
                      style={{
                        background: 'var(--accent)',
                        color: 'var(--accent-contrast)',
                        border: '1px solid var(--accent)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.5rem 0.9rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: uploadingPhoto ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      {uploadingPhoto ? <Spinner size={14} color="var(--accent-contrast)" /> : <Upload size={14} />} Upload Certificate (Image / PDF)
                    </button>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      PNG, JPG, WebP, PDF up to 10MB
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div><label style={labelSt}>Description</label><textarea style={{ ...inputSt, resize: 'vertical', minHeight: 80 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" disabled={saving} style={{ background: 'var(--accent)', color: '#111', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.55rem 1.1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.55rem 1rem', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner size={32} /></div> : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No certifications yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((cert) => (
            <div
              key={cert._id}
              className="admin-card admin-list-item"
              style={{
                padding: '1.15rem 1.35rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                {/* Certificate preview thumbnail */}
                {cert.image ? (
                  cert.image.toLowerCase().endsWith('.pdf') ? (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--accent-dim)',
                        border: '1px solid var(--accent-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={getAssetUrl(cert.image)}
                      alt={cert.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      style={{
                        width: 56,
                        height: 44,
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'contain',
                        background: 'var(--bg-surface)',
                        padding: 2,
                        border: '1px solid var(--border)',
                        flexShrink: 0,
                      }}
                    />
                  )
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-elevated)',
                      border: '1px dashed var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                    title="No certificate file uploaded"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cert.name}</span>
                    <span style={{ background: 'var(--accent-dim, rgba(239,68,68,0.15))', color: 'var(--accent, #ef4444)', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {cert.category || 'Certifications'}
                    </span>
                    {cert.badge && (
                      <span style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px' }}>
                        {cert.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.2rem' }}>
                    <span>{cert.issuer}</span>
                    {cert.image ? (
                      <a
                        href={cert.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: '0.78rem' }}
                      >
                        ↗ View Uploaded File
                      </a>
                    ) : (
                      <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>• No file uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="admin-list-actions">
                <button
                  onClick={() => openEdit(cert)}
                  className="admin-btn-secondary"
                >
                  {cert.image ? 'Edit' : 'Upload / Edit'}
                </button>
                <button
                  onClick={() => handleDelete(cert._id)}
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
