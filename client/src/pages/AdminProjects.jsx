import { useCallback, useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Spinner, Badge } from '../components/ui/index';
import { Upload, Trash2 } from 'lucide-react';
import { getAssetUrl } from '../utils/assetUrl';

const EMPTY_FORM = {
  title: '', categoryText: '', shortDescription: '', technologies: '',
  githubUrl: '', liveDemoUrl: '', image: '',
  status: 'active', displayOrder: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const photoInputRef = useRef(null);

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

  const fetchProjects = useCallback(() => {
    return api.get('/admin/projects')
      .then((r) => setProjects(r.data.data?.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(true); setError(''); };
  const openEdit = (p) => {
    setForm({
      title: p.title || '', categoryText: p.categoryText || '', shortDescription: p.shortDescription || '',
      technologies: (p.technologies || []).join(', '),
      githubUrl: p.githubUrl || '',
      liveDemoUrl: p.liveDemoUrl || '', image: p.image || '',
      status: p.status || 'active', displayOrder: p.displayOrder || 0,
    });
    setEditing(p._id);
    setShowForm(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      displayOrder: parseInt(form.displayOrder) || 0,
    };
    try {
      if (editing) {
        await api.put(`/admin/projects/${editing}`, payload);
      } else {
        await api.post('/admin/projects', payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/admin/projects/${id}`).catch(console.error);
    load();
  };

  const inputSt = { width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.6rem 0.8rem', color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none' };
  const labelSt = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Projects</h1>
        <button onClick={openCreate} style={{ background: 'var(--accent)', color: '#111', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.55rem 1.25rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          + Add Project
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>{editing ? 'Edit Project' : 'New Project'}</h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelSt}>Title *</label>
                <input style={inputSt} value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label style={labelSt}>Category / Domain Tag</label>
                <input style={inputSt} value={form.categoryText} onChange={(e) => setForm(f => ({ ...f, categoryText: e.target.value }))} placeholder="e.g. Full-Stack MERN, Telemetry & SCADA" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelSt}>Status</label>
                <select style={{ ...inputSt, cursor: 'pointer' }} value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label style={labelSt}>Display Order</label>
                <input type="number" style={inputSt} value={form.displayOrder} onChange={(e) => setForm(f => ({ ...f, displayOrder: e.target.value }))} />
              </div>
            </div>
            <div>
              <label style={labelSt}>Description *</label>
              <textarea style={{ ...inputSt, resize: 'vertical', minHeight: 80 }} value={form.shortDescription} onChange={(e) => setForm(f => ({ ...f, shortDescription: e.target.value }))} required />
            </div>
            <div>
              <label style={labelSt}>Technologies (comma-separated)</label>
              <input style={inputSt} value={form.technologies} onChange={(e) => setForm(f => ({ ...f, technologies: e.target.value }))} placeholder="React, Node.js, MongoDB" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelSt}>GitHub URL</label>
                <input style={inputSt} type="url" value={form.githubUrl} onChange={(e) => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
              </div>
              <div>
                <label style={labelSt}>Live Demo URL</label>
                <input style={inputSt} type="url" value={form.liveDemoUrl} onChange={(e) => setForm(f => ({ ...f, liveDemoUrl: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
            {/* Project Photo Upload */}
            <div>
              <label style={labelSt}>Project Photo</label>
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />

                {form.image ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        width: 130,
                        height: 75,
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-base)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={getAssetUrl(form.image)}
                        alt="Project preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <button
                        type="button"
                        disabled={uploadingPhoto}
                        onClick={() => photoInputRef.current?.click()}
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
                        {uploadingPhoto ? <Spinner size={12} /> : <Upload size={12} />} Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, image: '' }))}
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
                        <Trash2 size={12} /> Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      disabled={uploadingPhoto}
                      onClick={() => photoInputRef.current?.click()}
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
                      {uploadingPhoto ? <Spinner size={14} color="var(--accent-contrast)" /> : <Upload size={14} />} Upload Photo
                    </button>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      PNG, JPG, WebP up to 5MB
                    </span>
                  </div>
                )}
              </div>
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" disabled={saving} style={{ background: 'var(--accent)', color: '#111', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.55rem 1.4rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {saving ? <><Spinner size={14} color="#111" /> Saving...</> : (editing ? 'Update' : 'Create')}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '0.55rem 1.2rem', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner size={32} /></div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No projects yet. Add your first project above.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {projects.map((p) => (
            <div key={p._id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 260 }}>
                {p.image && (
                  <div
                    style={{
                      width: 80,
                      height: 50,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-base)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={getAssetUrl(p.image)}
                      alt={p.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{p.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{p.shortDescription?.slice(0, 80)}...</div>
                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                    <Badge variant={p.status === 'active' ? 'accent' : 'default'}>{p.status}</Badge>
                    {p.categoryText && <Badge variant="default">{p.categoryText}</Badge>}
                    {p.technologies?.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(p)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '0.4rem 0.95rem', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} style={{ background: 'transparent', border: '1px solid #ef444440', borderRadius: 'var(--radius-pill)', padding: '0.4rem 0.95rem', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem' }}>
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
