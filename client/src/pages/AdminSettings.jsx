import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Spinner } from '../components/ui/index';
import { Upload, FileText, Image, Check, ExternalLink, Trash2, Sparkles } from 'lucide-react';

const DEFAULT_HIGHLIGHTS = [
  {
    title: 'Full-Stack Development',
    desc: 'Building web applications end-to-end — from responsive frontends to RESTful backend APIs.',
  },
  {
    title: 'Auth & Security',
    desc: 'Implementing JWT authentication, authorization, input validation, and secure middleware patterns.',
  },
  {
    title: 'Database Integration',
    desc: 'Designing MongoDB schemas, writing Mongoose models, and working with SQL databases.',
  },
  {
    title: 'Problem Solving & DSA',
    desc: 'Practicing algorithmic thinking and optimized data structures to solve complex computational challenges.',
  },
];
import { getAssetUrl } from '../utils/assetUrl';

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
      .then((r) => {
        const data = r.data.data || {};
        if (data.instagramUrl === undefined) {
          data.instagramUrl = 'https://www.instagram.com/_ranjitsharma_?rpxt=MXQ5YzF6cXJnbHVjZA==';
        }
        if (data.facebookUrl === undefined) {
          data.facebookUrl = 'https://www.facebook.com/share/BvEjChP99D/';
        }
        setProfile(data);
      })
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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Profile & System Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Configure personal bio, avatar photo, resume document, social handles, and site metadata.
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.25rem' }}>
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
                    src={getAssetUrl(profile.avatarUrl)}
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
                      onClick={() => {
                        if (profile.avatarUrl) {
                          api.delete('/admin/upload', { data: { url: profile.avatarUrl } }).catch(() => {});
                        }
                        set('avatarUrl', '');
                      }}
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
                      href={getAssetUrl(profile.resumeUrl)}
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
                      onClick={() => {
                        if (profile.resumeUrl) {
                          api.delete('/admin/upload', { data: { url: profile.resumeUrl } }).catch(() => {});
                        }
                        set('resumeUrl', '');
                      }}
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
          <div className="admin-grid-2">
            <div><label style={labelSt}>Name</label><input style={inputSt} value={profile?.name || ''} onChange={(e) => set('name', e.target.value)} /></div>
            <div><label style={labelSt}>Headline</label><input style={inputSt} value={profile?.headline || ''} onChange={(e) => set('headline', e.target.value)} /></div>
            <div><label style={labelSt}>Email</label><input type="email" style={inputSt} value={profile?.email || ''} onChange={(e) => set('email', e.target.value)} /></div>
            <div><label style={labelSt}>Phone / WhatsApp</label><input style={inputSt} value={profile?.phone || ''} onChange={(e) => set('phone', e.target.value)} placeholder="+91 7482869029" /></div>
            <div><label style={labelSt}>Location</label><input style={inputSt} value={profile?.location || ''} onChange={(e) => set('location', e.target.value)} /></div>
            <div><label style={labelSt}>Languages Known</label><input style={inputSt} value={profile?.languages || ''} onChange={(e) => set('languages', e.target.value)} placeholder="English, Hindi, Odia" /></div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label style={labelSt}>Bio</label>
            <textarea style={{ ...inputSt, resize: 'vertical', minHeight: 120 }} value={profile?.bio || ''} onChange={(e) => set('bio', e.target.value)} placeholder="Write your bio paragraphs here (separate paragraphs with blank lines)..." />
          </div>
        </div>



        {/* About Highlights / Core Competencies */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: 'var(--accent)' }} />
            About Section Highlights (01 - 04 Competency Cards)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 1rem' }}>
            Customize the 4 core focus / competency cards displayed on your public About section.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
            {[0, 1, 2, 3].map((idx) => {
              const currentHighlights =
                Array.isArray(profile?.aboutHighlights) && profile.aboutHighlights.length === 4
                  ? profile.aboutHighlights
                  : DEFAULT_HIGHLIGHTS;
              const item = currentHighlights[idx] || DEFAULT_HIGHLIGHTS[idx];

              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                      Highlight 0{idx + 1}
                    </span>
                  </div>
                  <div>
                    <label style={{ ...labelSt, fontSize: '0.74rem' }}>Card Title</label>
                    <input
                      style={inputSt}
                      value={item.title}
                      onChange={(e) => {
                        const next = [...currentHighlights];
                        next[idx] = { ...item, title: e.target.value };
                        set('aboutHighlights', next);
                      }}
                      placeholder={`Title 0${idx + 1}`}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelSt, fontSize: '0.74rem' }}>Description</label>
                    <textarea
                      style={{ ...inputSt, resize: 'vertical', minHeight: 70, fontSize: '0.8rem' }}
                      value={item.desc}
                      onChange={(e) => {
                        const next = [...currentHighlights];
                        next[idx] = { ...item, desc: e.target.value };
                        set('aboutHighlights', next);
                      }}
                      placeholder={`Description for highlight 0${idx + 1}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social & Coding Links */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Social & Coding Profiles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0.75rem' }}>
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
            <div>
              <label style={labelSt}>Instagram URL (Footer)</label>
              <input style={inputSt} value={profile?.instagramUrl ?? ''} onChange={(e) => set('instagramUrl', e.target.value)} placeholder="https://www.instagram.com/..." />
            </div>
            <div>
              <label style={labelSt}>Facebook URL (Footer)</label>
              <input style={inputSt} value={profile?.facebookUrl ?? ''} onChange={(e) => set('facebookUrl', e.target.value)} placeholder="https://www.facebook.com/..." />
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
          className="admin-btn-primary"
          style={{ width: 'fit-content' }}
        >
          {saving ? <><Spinner size={16} color="var(--accent-contrast)" /> Saving...</> : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
