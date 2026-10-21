import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Spinner } from '../components/ui/index';
import { Upload, FileText, Image, Check, ExternalLink, Trash2 } from 'lucide-react';

export default function AdminSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const resumeInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    api
      .get('/profile')
      .then((r) => setProfile(r.data.data || {}))
      .catch(() => setProfile({}))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await api.put('/admin/profile', profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (key, val) => setProfile((p) => ({ ...p, [key]: val }));

  // File Upload Handler (Resume & Avatar)
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    if (type === 'resume') setUploadingResume(true);
    if (type === 'avatar') setUploadingAvatar(true);
    setError('');

    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = res.data.data.url;
      if (type === 'resume') {
        set('resumeUrl', fileUrl);
      } else if (type === 'avatar') {
        set('avatarUrl', fileUrl);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'File upload failed');
    } finally {
      if (type === 'resume') setUploadingResume(false);
      if (type === 'avatar') setUploadingAvatar(false);
      e.target.value = ''; // reset file input
    }
  };

  const inputSt = {
    width: '100%',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '0.65rem 0.85rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
  };

  const labelSt = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.35rem',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Profile & Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Manage your personal details, direct file uploads for your resume and avatar, and links.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ maxWidth: 750, display: 'grid', gap: '1.25rem' }}>
        {/* Media & Uploads Section (Avatar & Resume) */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} style={{ color: 'var(--accent)' }} />
            Resume & Avatar Uploads
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Avatar Upload */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                <Image size={16} style={{ color: 'var(--accent)' }} />
                <span>Profile Avatar</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar preview"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      border: '2px solid var(--accent)',
                      boxShadow: '0 0 12px var(--accent-glow)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-dim)',
                      border: '1px solid var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--accent)',
                    }}
                  >
                    RS
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'avatar')}
                  />
                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--accent-contrast)',
                      border: '1px solid var(--accent)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: uploadingAvatar ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      width: 'fit-content',
                    }}
                  >
                    {uploadingAvatar ? <><Spinner size={14} color="var(--accent-contrast)" /> Uploading...</> : <><Upload size={14} /> Upload Avatar</>}
                  </button>
                  {profile?.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => set('avatarUrl', '')}
                      style={{
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        border: 'none',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: 0,
                      }}
                    >
                      <Trash2 size={12} /> Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                <FileText size={16} style={{ color: 'var(--accent)' }} />
                <span>Resume Document (PDF)</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'resume')}
                />
                <button
                  type="button"
                  disabled={uploadingResume}
                  onClick={() => resumeInputRef.current?.click()}
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--accent-contrast)',
                    border: '1px solid var(--accent)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: uploadingResume ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    width: 'fit-content',
                  }}
                >
                  {uploadingResume ? <><Spinner size={14} color="var(--accent-contrast)" /> Uploading...</> : <><Upload size={14} /> Upload Resume PDF</>}
                </button>

                {profile?.resumeUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontWeight: 500,
                      }}
                    >
                      <ExternalLink size={13} /> View Current Resume
                    </a>
                    <button
                      type="button"
                      onClick={() => set('resumeUrl', '')}
                      style={{
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        border: 'none',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: 0,
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label style={{ ...labelSt, fontSize: '0.75rem' }}>Resume URL (or upload above)</label>
                <input
                  style={inputSt}
                  value={profile?.resumeUrl || ''}
                  onChange={(e) => set('resumeUrl', e.target.value)}
                  placeholder="https://... or /uploads/... or upload above"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Personal Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div><label style={labelSt}>Name</label><input style={inputSt} value={profile?.name || ''} onChange={(e) => set('name', e.target.value)} /></div>
            <div><label style={labelSt}>Headline</label><input style={inputSt} value={profile?.headline || ''} onChange={(e) => set('headline', e.target.value)} /></div>
            <div><label style={labelSt}>Email</label><input type="email" style={inputSt} value={profile?.email || ''} onChange={(e) => set('email', e.target.value)} /></div>
            <div><label style={labelSt}>Phone / WhatsApp</label><input style={inputSt} value={profile?.phone || ''} onChange={(e) => set('phone', e.target.value)} placeholder="+91 7482869029" /></div>
            <div><label style={labelSt}>Location</label><input style={inputSt} value={profile?.location || ''} onChange={(e) => set('location', e.target.value)} /></div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label style={labelSt}>Bio</label>
            <textarea style={{ ...inputSt, resize: 'vertical', minHeight: 90 }} value={profile?.bio || ''} onChange={(e) => set('bio', e.target.value)} />
          </div>
        </div>

        {/* Social & Coding Links */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Social & Coding Profiles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={labelSt}>GitHub URL</label>
              <input style={inputSt} value={profile?.githubUrl || ''} onChange={(e) => set('githubUrl', e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div>
              <label style={labelSt}>LinkedIn URL</label>
              <input style={inputSt} value={profile?.linkedinUrl || ''} onChange={(e) => set('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label style={labelSt}>LeetCode URL</label>
              <input style={inputSt} value={profile?.leetcodeUrl || ''} onChange={(e) => set('leetcodeUrl', e.target.value)} placeholder="https://leetcode.com/u/..." />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Availability Status</h2>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            <input type="checkbox" checked={profile?.available || false} onChange={(e) => set('available', e.target.checked)} />
            Currently open to opportunities / internships
          </label>
          <div><label style={labelSt}>Availability Note</label><input style={inputSt} value={profile?.availabilityNote || ''} onChange={(e) => set('availabilityNote', e.target.value)} placeholder="e.g. Open to full-time roles and internships" /></div>
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>}
        {success && <p style={{ color: 'var(--accent)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Check size={16} /> Changes saved successfully!</p>}

        <button
          type="submit"
          disabled={saving}
          style={{
            background: 'var(--accent)',
            color: 'var(--accent-contrast)',
            border: '1px solid var(--accent)',
            boxShadow: '0 2px 10px var(--accent-glow)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.75rem',
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: 'fit-content',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.background = 'var(--accent-hover)';
              e.currentTarget.style.boxShadow = '0 0 16px var(--accent-glow)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!saving) {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 2px 10px var(--accent-glow)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {saving ? <><Spinner size={16} color="var(--accent-contrast)" /> Saving...</> : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
