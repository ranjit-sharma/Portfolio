import { useEffect, useState } from 'react';
import api from '../services/api';
import { Spinner } from '../components/ui/index';
import {
  GraduationCap,
  Check,
  Save,
  Award,
  Calendar,
  Building,
  BookOpen,
  School,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';

const DEFAULT_SCHOOLS = [
  {
    institution: 'KD International School',
    location: 'Rajdhanwar, Jharkhand',
    qualification: 'Class XII',
    level: 'Intermediate',
    board: 'CBSE',
    start: '2021',
    end: '2023',
  },
  {
    institution: 'Redwoods English School',
    location: 'Jeypore, Odisha',
    qualification: 'Class X',
    level: 'Matriculation',
    board: 'CBSE',
    start: '2019',
    end: '2021',
  },
];

export default function AdminEducation() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    educationCurrentSemester: 7,
    educationCgpa: '',
    educationTotalSemesters: 8,
    educationDegree: 'B.Tech in Computer Science & IT',
    educationInstitution: 'Trident Academy of Technology',
    educationStartYear: 2023,
    educationEndYear: 2027,
  });

  const [schools, setSchools] = useState(DEFAULT_SCHOOLS);

  useEffect(() => {
    api
      .get('/profile')
      .then((res) => {
        const d = res.data?.data;
        if (d) {
          setForm({
            educationCurrentSemester:
              d.educationCurrentSemester !== undefined && d.educationCurrentSemester !== null
                ? Number(d.educationCurrentSemester)
                : 7,
            educationCgpa:
              d.educationCgpa !== undefined && d.educationCgpa !== null
                ? String(d.educationCgpa)
                : '',
            educationTotalSemesters: Number(d.educationTotalSemesters) || 8,
            educationDegree: d.educationDegree || 'B.Tech in Computer Science & IT',
            educationInstitution: d.educationInstitution || 'Trident Academy of Technology',
            educationStartYear: Number(d.educationStartYear) || 2023,
            educationEndYear: Number(d.educationEndYear) || 2027,
          });

          if (Array.isArray(d.educationSchools) && d.educationSchools.length > 0) {
            setSchools(d.educationSchools);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setSuccess(false);
    setError('');
  };

  const handleSchoolChange = (index, field, val) => {
    setSchools((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
    setSuccess(false);
    setError('');
  };

  const addSchool = () => {
    setSchools((prev) => [
      ...prev,
      {
        institution: '',
        location: '',
        qualification: '',
        level: '',
        board: 'CBSE',
        start: '',
        end: '',
      },
    ]);
  };

  const removeSchool = (index) => {
    setSchools((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await api.put('/admin/profile', {
        educationCurrentSemester: Number(form.educationCurrentSemester),
        educationCgpa: form.educationCgpa ? String(form.educationCgpa).trim() : '',
        educationTotalSemesters: Number(form.educationTotalSemesters) || 8,
        educationDegree: form.educationDegree,
        educationInstitution: form.educationInstitution,
        educationStartYear: Number(form.educationStartYear),
        educationEndYear: Number(form.educationEndYear),
        educationSchools: schools.filter((s) => s && s.institution.trim()),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update education details');
    } finally {
      setSaving(false);
    }
  };

  const currentSem = Number(form.educationCurrentSemester) || 1;
  const totalSems = Number(form.educationTotalSemesters) || 8;
  const numCgpa = parseFloat(form.educationCgpa);
  const hasCgpa = Boolean(
    form.educationCgpa &&
    String(form.educationCgpa).trim() !== '' &&
    !isNaN(numCgpa) &&
    numCgpa > 0
  );
  const cgpaVal = hasCgpa ? numCgpa : 0;
  const completedSems = Math.max(0, currentSem - 1);
  const progressRatio = completedSems / Math.max(1, totalSems - 1);

  const inputStyle = {
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

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.4rem',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3.5rem' }}>
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <GraduationCap size={24} style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Education & Schooling</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Manage your ongoing degree, CGPA, semester tracker, and prior schooling history (Class XII, Class X, etc.).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(320px, 0.95fr)', gap: '1.75rem', alignItems: 'start' }}>
        {/* Left Column: Editable Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Degree Card */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} style={{ color: 'var(--accent)' }} />
              Degree & Academic Progress
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>
                  <Award size={14} style={{ color: 'var(--accent)' }} />
                  Current CGPA <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7.73 (leave empty to hide)"
                  value={form.educationCgpa}
                  onChange={(e) => handleChange('educationCgpa', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <Calendar size={14} style={{ color: 'var(--accent)' }} />
                  Current Semester *
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={form.educationCurrentSemester}
                  onChange={(e) => handleChange('educationCurrentSemester', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Total Semesters</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={form.educationTotalSemesters}
                  onChange={(e) => handleChange('educationTotalSemesters', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Degree Title</label>
                <input
                  type="text"
                  value={form.educationDegree}
                  onChange={(e) => handleChange('educationDegree', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>
                <Building size={14} style={{ color: 'var(--accent)' }} />
                College / Institution Name
              </label>
              <input
                type="text"
                value={form.educationInstitution}
                onChange={(e) => handleChange('educationInstitution', e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Start Year</label>
                <input
                  type="number"
                  value={form.educationStartYear}
                  onChange={(e) => handleChange('educationStartYear', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Completion / End Year</label>
                <input
                  type="number"
                  value={form.educationEndYear}
                  onChange={(e) => handleChange('educationEndYear', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          {/* Schooling / Prior Education Cards (KD International, Redwoods, etc.) */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <School size={18} style={{ color: 'var(--accent)' }} />
                  Prior Schooling History
                </h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  School cards shown below the degree card (Class XII, Class X, etc.)
                </p>
              </div>

              <button
                type="button"
                onClick={addSchool}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Plus size={14} />
                + Add School
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {schools.map((school, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.1rem',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent)' }}>
                      School #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSchool(idx)}
                      title="Remove this school"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>School / Institution Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. KD International School"
                        value={school.institution}
                        onChange={(e) => handleSchoolChange(idx, 'institution', e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Board *</label>
                      <input
                        type="text"
                        placeholder="e.g. CBSE, ICSE, State"
                        value={school.board}
                        onChange={(e) => handleSchoolChange(idx, 'board', e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>Qualification</label>
                      <input
                        type="text"
                        placeholder="e.g. Class XII, Class X"
                        value={school.qualification}
                        onChange={(e) => handleSchoolChange(idx, 'qualification', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Level / Stream</label>
                      <input
                        type="text"
                        placeholder="e.g. Intermediate, Matriculation"
                        value={school.level}
                        onChange={(e) => handleSchoolChange(idx, 'level', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>Location (City, State)</label>
                      <input
                        type="text"
                        placeholder="e.g. Rajdhanwar, Jharkhand"
                        value={school.location}
                        onChange={(e) => handleSchoolChange(idx, 'location', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Start Year</label>
                      <input
                        type="text"
                        placeholder="e.g. 2021"
                        value={school.start}
                        onChange={(e) => handleSchoolChange(idx, 'start', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>End Year</label>
                      <input
                        type="text"
                        placeholder="e.g. 2023"
                        value={school.end}
                        onChange={(e) => handleSchoolChange(idx, 'end', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback messages */}
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={18} />
              All Education and Schooling details saved successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-contrast, #0B0D0C)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              alignSelf: 'flex-start',
            }}
          >
            {saving ? <><Spinner size={16} color="var(--accent-contrast)" /> Saving...</> : <><Save size={16} /> Save All Education Settings</>}
          </button>
        </form>

        {/* Right Column: Live Interactive Preview */}
        <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Degree Card Preview */}
          <div
            style={{
              background: 'linear-gradient(160deg, var(--bg-elevated) 0%, var(--bg-card) 60%)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--accent)',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--accent-border)',
                  borderRadius: '9999px',
                }}
              >
                Live Degree Preview
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {form.educationStartYear} – {form.educationEndYear}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.35rem', color: 'var(--text-primary)', lineHeight: 1.25 }}>
                  {form.educationDegree}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {form.educationInstitution}
                </p>
              </div>

              {/* CGPA Ring Meter Preview */}
              {hasCgpa && (
                <div style={{ width: 72, height: 72, flexShrink: 0, position: 'relative' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      pathLength="1"
                      strokeDasharray="1"
                      strokeDashoffset={Math.max(0, 1 - cgpaVal / 10)}
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}
                  >
                    <strong style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {form.educationCgpa}
                    </strong>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
                      CGPA
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Degree progress bar */}
            <div style={{ background: 'var(--bg-base)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Degree Progress</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                  Semester <span style={{ color: 'var(--accent)' }}>{currentSem}</span> of {totalSems}
                </span>
              </div>

              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(0, progressRatio * 100))}%`,
                    background: 'var(--accent)',
                    boxShadow: '0 0 10px var(--accent-glow)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${totalSems}, 1fr)`, gap: '4px' }}>
                {Array.from({ length: totalSems }, (_, i) => i + 1).map((n) => {
                  const isDone = n <= completedSems;
                  const isCurrent = n === currentSem;

                  return (
                    <div
                      key={n}
                      style={{
                        padding: '0.35rem 0',
                        textAlign: 'center',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        background: isCurrent
                          ? 'var(--accent)'
                          : isDone
                          ? 'var(--accent-dim)'
                          : 'var(--bg-elevated)',
                        color: isCurrent
                          ? 'var(--accent-contrast)'
                          : isDone
                          ? 'var(--accent)'
                          : 'var(--text-muted)',
                        border: isCurrent
                          ? '1px solid var(--accent)'
                          : isDone
                          ? '1px solid var(--accent-border)'
                          : '1px solid transparent',
                      }}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Schooling Cards Live Preview (Matching Image 1) */}
          <div
            style={{
              background: 'linear-gradient(160deg, var(--bg-elevated) 0%, var(--bg-card) 60%)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.6rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--accent)',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                borderRadius: '9999px',
                marginBottom: '1rem',
              }}
            >
              School Cards Live Preview
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {schools.map((school, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      background: 'var(--accent-dim)',
                      border: '1px solid var(--accent-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  >
                    <School size={18} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {school.institution || 'School Name'}
                        </strong>
                        {school.board && (
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                            {school.board}
                          </span>
                        )}
                      </div>

                      {(school.start || school.end) && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'monospace', background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                          {school.start} – {school.end}
                        </span>
                      )}
                    </div>

                    <p style={{ margin: '0.2rem 0 0.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>
                      {school.qualification || 'Qualification'} <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>· {school.level || 'Level'}</span>
                    </p>

                    {school.location && (
                      <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={12} />
                        {school.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
