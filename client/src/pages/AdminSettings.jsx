import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Spinner, ImageResizeModal } from '../components/ui/index';
import {
  Upload,
  FileText,
  Image,
  Check,
  ExternalLink,
  Trash2,
  Sparkles,
} from 'lucide-react';

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
  const [avatarCropFile, setAvatarCropFile] = useState(null);
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

    if (type === 'avatar') {
      setAvatarCropFile(file);
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setUploadingResume(true);
    setError('');

    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set('resumeUrl', res.data.data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  };

  const handleAvatarCropConfirm = async (croppedFile) => {
    const formData = new FormData();
    formData.append('file', croppedFile);
    setUploadingAvatar(true);
    setError('');
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set('avatarUrl', res.data.data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setAvatarCropFile(null);
    } catch (err) {
      setError(err.message || 'Avatar upload failed');
    } finally {
      setUploadingAvatar(false);
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
            {/* Avatar Upload */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <Image size={17} style={{ color: 'var(--accent)' }} />
                  <span>Profile Avatar</span>
                </div>
                {profile?.avatarUrl && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '0.2rem 0.55rem', borderRadius: '9999px', border: '1px solid var(--accent-border)' }}>
                    Active
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                {profile?.avatarUrl ? (
                  <img
                    src={getAssetUrl(profile.avatarUrl)}
                    alt="Avatar preview"
                    style={{
                      width: 125,
                      height: 125,
                      borderRadius: 'var(--radius-lg)',
                      objectFit: 'cover',
                      border: '2.5px solid var(--accent)',
                      boxShadow: '0 4px 18px var(--accent-glow)',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 125,
                      height: 125,
                      borderRadius: 'var(--radius-lg)',
                      background: 'radial-gradient(circle at 35% 35%, var(--accent-dim) 0%, var(--bg-elevated) 70%)',
                      border: '2px dashed var(--border-strong)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      color: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>RS</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>No photo</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    High-res portrait photo for your Hero section & preview metadata.
                  </p>

                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'avatar')}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-start' }}>
                    <button
                      type="button"
                      disabled={uploadingAvatar}
                      onClick={() => avatarInputRef.current?.click()}
                      style={{
                        background: 'var(--accent)',
                        color: 'var(--accent-contrast)',
                        border: '1px solid var(--accent)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.52rem 0.95rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: uploadingAvatar ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        width: 'fit-content',
                        boxShadow: '0 3px 12px var(--accent-glow)',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {uploadingAvatar ? (
                        <>
                          <Spinner size={14} color="var(--accent-contrast)" /> Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={14} /> {profile?.avatarUrl ? 'Change Photo' : 'Upload Avatar'}
                        </>
                      )}
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
                          gap: '0.3rem',
                          padding: '0.15rem 0',
                          width: 'fit-content',
                          transition: 'color var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        <Trash2 size={13} /> Remove Photo
                      </button>
                    )}
                  </div>
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
            <div><label style={labelSt}>Location</label><input style={inputSt} value={profile?.location || ''} onChange={(e) => set('location', e.target.value)} /></div>
            <div><label style={labelSt}>Languages Known</label><input style={inputSt} value={profile?.languages || ''} onChange={(e) => set('languages', e.target.value)} placeholder="English, Hindi, Odia" /></div>
            <div>
              <label style={labelSt}>About Section Education Text</label>
              <input
                style={inputSt}
                value={profile?.aboutEducation ?? 'B.Tech CS · 2027'}
                onChange={(e) => set('aboutEducation', e.target.value)}
                placeholder="e.g. B.Tech CS · 2027"
              />
            </div>
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
              <input style={inputSt} value={profile?.instagramUrl || ''} onChange={(e) => set('instagramUrl', e.target.value)} placeholder="https://www.instagram.com/..." />
            </div>
            <div>
              <label style={labelSt}>Facebook URL (Footer)</label>
              <input style={inputSt} value={profile?.facebookUrl || ''} onChange={(e) => set('facebookUrl', e.target.value)} placeholder="https://www.facebook.com/..." />
            </div>
            <div>
              <label style={labelSt}>Twitter / X URL (Footer)</label>
              <input style={inputSt} value={profile?.twitterUrl || ''} onChange={(e) => set('twitterUrl', e.target.value)} placeholder="https://x.com/..." />
            </div>
          </div>
        </div>

        {/* Availability & Hero Badge */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Availability Status & Hero Badge</h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Control whether you are marked open for work, and customize the text shown on your Hero badge, About section, Contact section, and Footer.
              </p>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.03em',
                background: (profile?.available ?? true) ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                color: (profile?.available ?? true) ? 'var(--accent)' : 'var(--text-muted)',
                border: `1px solid ${(profile?.available ?? true) ? 'var(--accent-border)' : 'var(--border)'}`,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: (profile?.available ?? true) ? 'var(--accent)' : 'var(--text-muted)',
                  animation: (profile?.available ?? true) ? 'pulse-glow 2s ease infinite' : 'none',
                }}
              />
              {(profile?.available ?? true) ? 'OPEN FOR OPPORTUNITIES' : 'NOT CURRENTLY AVAILABLE'}
            </span>
          </div>

          {/* Toggle Card */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              padding: '0.85rem 1rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--accent)' }}
              checked={profile?.available ?? true}
              onChange={(e) => set('available', e.target.checked)}
            />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Mark as "Open to opportunities / internships"
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                When checked, the pulsing green radar dot is shown, and "available: true" is exported in your code card.
              </div>
            </div>
          </label>

          {/* Hero Badge & Status Text Input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelSt}>
              Hero Badge & Status Text (shown in Hero, About, Contact, and Footer sections)
            </label>
            <input
              style={inputSt}
              value={profile?.availabilityNote || ''}
              onChange={(e) => set('availabilityNote', e.target.value)}
              placeholder="e.g. B.Tech in Computer Science · Open to opportunities"
            />
            <span style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              💡 Leave empty to use default: <em>"{(profile?.available ?? true) ? 'B.Tech in Computer Science · Open to opportunities' : 'Not currently open to opportunities'}"</em>
            </span>
          </div>

          {/* Live Preview of Hero Badge */}
          <div
            style={{
              padding: '1rem',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border)',
            }}
          >
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.6rem' }}>
              Live Hero Badge Preview (as seen by visitors):
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card, var(--bg-surface))',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: (profile?.available ?? true) ? 'var(--text-secondary)' : 'var(--text-muted)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: (profile?.available ?? true) ? 'var(--accent)' : 'var(--text-muted)',
                    animation: (profile?.available ?? true) ? 'pulse-glow 2s ease infinite' : 'none',
                  }}
                />
                {profile?.availabilityNote?.trim() ||
                  ((profile?.available ?? true)
                    ? 'B.Tech in Computer Science · Open to opportunities'
                    : 'Not currently open to opportunities')}
              </span>
            </div>
          </div>
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

      <ImageResizeModal
        isOpen={!!avatarCropFile}
        imageFile={avatarCropFile}
        title="Resize & Adjust Profile Photo"
        shape="squircle"
        defaultFit="cover"
        uploading={uploadingAvatar}
        onClose={() => setAvatarCropFile(null)}
        onConfirm={handleAvatarCropConfirm}
      />
    </div>
  );
}
