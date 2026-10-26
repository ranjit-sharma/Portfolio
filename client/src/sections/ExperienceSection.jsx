import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Award, ExternalLink, X } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkeletonCard } from '../components/ui/index';
import api from '../services/api';
import { getAssetUrl } from '../utils/assetUrl';

const FALLBACK_EXPERIENCE = [
  {
    _id: '1',
    company: 'DRDO PXE',
    companyShort: 'DRDO',
    companySub: 'DRDO — PXE Chandipur',
    role: 'Software Engineering Intern',
    employmentType: 'Internship',
    location: 'Chandipur, Odisha',
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    current: false,
    durationText: '1 month',
    projectTitle: 'Upper Air Sounding System (UASS)',
    repoUrl: 'https://github.com/ranjit-sharma',
    certificateUrl: '/uploads/cert_5_drdo.png',
    stats: [
      { value: '5+', label: 'TELEMETRY STREAMS' },
      { value: '100%', label: 'REAL-TIME SENSORS' },
      { value: 'TCP/UDP', label: 'LAN ARCHITECTURE' },
    ],
    description:
      'Worked on the Upper Air Sounding System (UASS) — a ground station terminal for real-time meteorological data acquisition and visualization.',
    responsibilities: [
      'Owned real-time telemetry processing and data acquisition for the Upper Air Sounding System (UASS) ground station terminal.',
      'Developed functionality for processing and decoding binary telemetry frames from weather sounding equipment.',
      'Built real-time monitoring interfaces for live GPS tracking and meteorological sensor data visualization.',
      'Implemented robust TCP/UDP socket communication for LAN-based data acquisition and verified with telemetry streams.',
    ],
    technologies: ['React', 'Node.js', 'JavaScript', 'TCP/UDP', 'Binary Data Processing', 'Data Visualization'],
  },
  {
    _id: '2',
    company: 'Cognifyz Technologies',
    companyShort: 'CT',
    companySub: 'Cognifyz Technologies — Remote',
    role: 'Java Development Intern',
    employmentType: 'Internship',
    location: 'Remote',
    startDate: '2024-12-15',
    endDate: '2025-01-15',
    current: false,
    durationText: '1 month',
    projectTitle: 'Core Java & OOP Architecture',
    repoUrl: 'https://github.com/ranjit-sharma',
    certificateUrl: '',
    stats: [
      { value: '15+', label: 'PROGRAMS BUILT' },
      { value: '100%', label: 'OOP ARCHITECTURE' },
      { value: 'DSA', label: 'OPTIMIZED CODE' },
    ],
    description:
      'Completed a structured Java development internship, working on programming tasks and strengthening core Java skills.',
    responsibilities: [
      'Implemented robust Java programs covering core object-oriented programming concepts and design patterns.',
      'Developed data structure manipulation logic and practical algorithms for problem-solving exercises.',
      'Applied clean code standards, exception handling, and modular component design.',
    ],
    technologies: ['Java', 'OOP', 'Data Structures', 'Problem Solving'],
  },
];

function formatRailDate(startStr, endStr, isCurrent) {
  const parseMthYr = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  const end = isCurrent ? 'Present' : parseMthYr(endStr) || 'Jul 2026';
  const start = parseMthYr(startStr) || 'Jun 2026';
  return { main: end, sub: `from ${start}` };
}

function CircledCheckmark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      style={{ flexShrink: 0, marginTop: '2px' }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="1.75" />
      <path
        d="M7.5 12.2l3 3 6-6"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ExperienceSection() {
  const { ref, inView } = useInView();
  const [experiences, setExperiences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCertModal, setActiveCertModal] = useState(null);

  useEffect(() => {
    api
      .get('/experience')
      .then((res) => {
        const data = res.data.data;
        setExperiences(data && data.length > 0 ? data : FALLBACK_EXPERIENCE);
      })
      .catch(() => setExperiences(FALLBACK_EXPERIENCE))
      .finally(() => setLoading(false));
  }, []);

  // Close certificate modal on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setActiveCertModal(null);
  }, []);

  useEffect(() => {
    if (activeCertModal) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeCertModal, handleKeyDown]);

  const items = experiences || FALLBACK_EXPERIENCE;

  return (
    <section id="experience" className="section-padding">
      <style>{`
        .experience-timeline-row {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 2.25rem;
          position: relative;
        }
        .experience-project-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 868px) {
          .experience-timeline-row {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .experience-rail-desktop {
            display: none !important;
          }
          .experience-rail-mobile {
            display: flex !important;
          }
        }
        @media (min-width: 869px) {
          .experience-rail-mobile {
            display: none !important;
          }
        }
      `}</style>

      <div className="container">
        <SectionHeading
          eyebrow="Experience"
          title="Work & Internships"
          subtitle="Hands-on engineering experience building real mission-critical systems"
        />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[...Array(2)].map((_, i) => (
              <SkeletonCard key={i} height={260} />
            ))}
          </div>
        ) : (
          <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '2.75rem' }}>
            {items.map((exp, i) => {
              const dates = formatRailDate(exp.startDate, exp.endDate, exp.current);
              const companyInitials =
                exp.companyShort ||
                exp.company
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 4)
                  .toUpperCase() ||
                'EXP';
              const companySub = exp.companySub || `${exp.company} — ${exp.location || 'India'}`;
              const duration = exp.durationText || '1 month';
              const projectTitle = exp.projectTitle || exp.company;
              const repoUrl = exp.repoUrl || 'https://github.com/ranjit-sharma';
              const certUrl = exp.certificateUrl || '';
              const stats = Array.isArray(exp.stats) && exp.stats.length > 0 ? exp.stats : [];

              return (
                <motion.div
                  key={exp._id || i}
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="experience-timeline-row"
                >
                  {/* Left Timeline Rail (Desktop) */}
                  <div
                    className="experience-rail-desktop"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      position: 'relative',
                      paddingTop: '0.5rem',
                    }}
                  >
                    {/* Date labels */}
                    <div style={{ textAlign: 'right', width: '100%', paddingRight: '1.25rem' }}>
                      <div
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          letterSpacing: '-0.01em',
                          lineHeight: 1.2,
                        }}
                      >
                        {dates.main}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.2rem',
                          fontWeight: 500,
                        }}
                      >
                        {dates.sub}
                      </div>
                    </div>

                    {/* Timeline vertical rail line */}
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '0.65rem',
                        bottom: i < items.length - 1 ? '-2.75rem' : '0.5rem',
                        width: 2,
                        background: 'linear-gradient(to bottom, var(--accent) 0%, var(--accent-border) 70%, transparent 100%)',
                      }}
                    />

                    {/* Timeline dot */}
                    <div
                      style={{
                        position: 'absolute',
                        right: -5,
                        top: '0.6rem',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        boxShadow: '0 0 14px 2px var(--accent-glow)',
                        zIndex: 2,
                      }}
                    />
                  </div>

                  {/* Mobile Date Header */}
                  <div
                    className="experience-rail-mobile"
                    style={{
                      display: 'none',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        boxShadow: '0 0 10px var(--accent-glow)',
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {dates.main}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ({dates.sub})
                    </span>
                  </div>

                  {/* Main Experience Card */}
                  <div
                    style={{
                      background: 'radial-gradient(circle at 12% 10%, var(--accent-dim) 0%, transparent 45%), var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '20px',
                      padding: '2rem 2.25rem',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-border)';
                      e.currentTarget.style.boxShadow = '0 16px 44px -8px var(--accent-glow)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Header Row: Company badge, Role, Subtitle, Meta, and Employment Pill */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '1.25rem',
                        flexWrap: 'wrap',
                        marginBottom: '1.75rem',
                      }}
                    >
                      {/* Left: Avatar + Titles */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
                        {/* Company Badge Squircle */}
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                            boxShadow: '0 8px 24px var(--accent-glow)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            color: 'var(--accent-contrast)',
                            letterSpacing: '0.04em',
                            flexShrink: 0,
                          }}
                        >
                          {companyInitials}
                        </div>

                        <div>
                          <h3
                            style={{
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              lineHeight: 1.25,
                              marginBottom: '0.25rem',
                            }}
                          >
                            {exp.role}
                          </h3>
                          <div
                            style={{
                              color: 'var(--text-secondary)',
                              fontSize: '0.92rem',
                              fontWeight: 500,
                              marginBottom: '0.35rem',
                            }}
                          >
                            {companySub}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              fontSize: '0.82rem',
                              color: 'var(--text-muted)',
                              flexWrap: 'wrap',
                            }}
                          >
                            {exp.location && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <MapPin size={13} style={{ color: 'var(--accent)' }} />
                                {exp.location}
                              </span>
                            )}
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                              {duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Employment Pill Badge */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          background: 'var(--accent-dim)',
                          border: '1px solid var(--accent-border)',
                          color: 'var(--accent)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'var(--accent)',
                            boxShadow: '0 0 8px var(--accent)',
                          }}
                        />
                        {exp.employmentType || 'INTERNSHIP'}
                      </div>
                    </div>

                    {/* PROJECT Sub-Section */}
                    <div className="experience-project-row">
                      {/* Left: Project title & action buttons */}
                      <div>
                        <div
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            marginBottom: '0.4rem',
                          }}
                        >
                          PROJECT
                        </div>
                        <div
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.01em',
                            marginBottom: '0.9rem',
                          }}
                        >
                          {projectTitle}
                        </div>

                        {/* Action buttons: Repo button (ONLY GitHub icon) & Certificate button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          {/* GitHub Icon-only button (round, matching certificate style) */}
                          <a
                            href={repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub Repository"
                            title="View GitHub Repository"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 38,
                              height: 38,
                              borderRadius: '50%',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-primary)',
                              textDecoration: 'none',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--accent-border)';
                              e.currentTarget.style.background = 'var(--accent-dim)';
                              e.currentTarget.style.color = 'var(--accent)';
                              e.currentTarget.style.boxShadow = '0 4px 14px var(--accent-glow)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.background = 'var(--bg-elevated)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <SiGithub size={17} />
                          </a>

                          {/* Certificate Button */}
                          {certUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveCertModal({
                                  title: `${exp.role} · ${exp.company}`,
                                  url: certUrl,
                                })
                              }
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.55rem 1rem',
                                borderRadius: '9999px',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)',
                                fontSize: '0.84rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--accent-border)';
                                e.currentTarget.style.background = 'var(--accent-dim)';
                                e.currentTarget.style.color = 'var(--accent)';
                                e.currentTarget.style.boxShadow = '0 4px 14px var(--accent-glow)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.background = 'var(--bg-elevated)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <Award size={15} style={{ color: 'var(--accent)' }} />
                              Certificate
                              <ExternalLink size={13} style={{ opacity: 0.7 }} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right: Numeric Stats */}
                      {stats.length > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2.25rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          {stats.map((st, sIdx) => (
                            <div key={sIdx} style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  fontSize: '1.45rem',
                                  fontWeight: 900,
                                  color: 'var(--text-primary)',
                                  lineHeight: 1.1,
                                }}
                              >
                                {st.value}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.66rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.08em',
                                  color: 'var(--text-muted)',
                                  marginTop: '0.3rem',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {st.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Responsibilities Bullets with Circled Checkmarks */}
                    {exp.responsibilities?.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          marginBottom: '1.5rem',
                        }}
                      >
                        {exp.responsibilities.map((resp, rIdx) => (
                          <div
                            key={rIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.75rem',
                              color: 'var(--text-secondary)',
                              fontSize: '0.9rem',
                              lineHeight: 1.6,
                            }}
                          >
                            <CircledCheckmark />
                            <span>{resp}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technology Badges */}
                    {exp.technologies?.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid var(--border)',
                        }}
                      >
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            style={{
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-pill)',
                              padding: '0.3rem 0.85rem',
                              fontSize: '0.78rem',
                              color: 'var(--text-secondary)',
                              fontWeight: 500,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate Viewer Modal */}
      <AnimatePresence>
        {activeCertModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCertModal(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '920px',
                width: '100%',
                maxHeight: '90vh',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--bg-elevated)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Award size={18} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {activeCertModal.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <a
                    href={getAssetUrl(activeCertModal.url)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      textDecoration: 'none',
                    }}
                  >
                    Open Original <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => setActiveCertModal(null)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '0.3rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                    }}
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body / Image */}
              <div
                style={{
                  padding: '1.25rem',
                  overflowY: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'var(--bg-base)',
                }}
              >
                <img
                  src={getAssetUrl(activeCertModal.url)}
                  alt={activeCertModal.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '75vh',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      const msg = document.createElement('div');
                      msg.style.padding = '3rem';
                      msg.style.textAlign = 'center';
                      msg.style.color = 'var(--text-muted)';
                      msg.innerText = 'Certificate preview not available. Use the link above to view the original file.';
                      e.currentTarget.parentElement.appendChild(msg);
                    }
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
