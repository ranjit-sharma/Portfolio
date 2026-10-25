import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkeletonCard } from '../components/ui/index';
import api from '../services/api';

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
    projectTitle: 'UAS-RTMVD',
    repoUrl: 'https://github.com/ranjit-sharma',
    repoLabel: 'Database repo',
    certificateUrl: '#certifications',
    stats: [
      { value: '6', label: 'TABLES DESIGNED' },
      { value: '65', label: 'SQL STATEMENTS' },
      { value: 'H2', label: 'FULLY TESTED' },
    ],
    responsibilities: [
      'Owned the SQL database layer end to end for UAS-RTMVD, a real-time telemetry SCADA dashboard.',
      'Designed a 6-table relational schema mapped to Spring Data JPA / Hibernate entities.',
      'Enforced integrity with keys, unique and CHECK constraints, cascade deletes and a single-active-frame rule in one transaction.',
      'Wrote all 65 SQL statements — backend queries, seed data, indexes, reporting and validation — tested on H2.',
    ],
    technologies: ['Spring Boot', 'Spring Data JPA', 'Hibernate', 'SQL', 'H2', 'Java'],
  },
  {
    _id: '2',
    company: 'Cognifyz Technologies',
    companyShort: 'COG',
    companySub: 'Cognifyz Technologies',
    role: 'Java Development Intern',
    employmentType: 'Internship',
    location: 'Remote',
    startDate: '2024-12-15',
    endDate: '2025-01-15',
    current: false,
    durationText: '1 month',
    responsibilities: [
      'Implemented Java programs covering core programming concepts and object-oriented architectures.',
      'Applied object-oriented programming principles and modular patterns in practical tasks.',
      'Worked on structured problem-solving exercises and algorithm design.',
    ],
    technologies: ['Java', 'OOP', 'Data Structures'],
  },
];

function getTimelineDates(startDateStr, endDateStr, current) {
  if (!startDateStr) return { top: '', sub: '' };
  const s = new Date(startDateStr);
  const startFmt = s.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (current) {
    return { top: 'Present', sub: `from ${startFmt}` };
  }
  if (!endDateStr) {
    return { top: startFmt, sub: '' };
  }
  const e = new Date(endDateStr);
  const endFmt = e.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return { top: endFmt, sub: `from ${startFmt}` };
}

function getDuration(startDateStr, endDateStr, current, customText) {
  if (customText) return customText;
  if (!startDateStr) return '';
  const s = new Date(startDateStr);
  const e = current ? new Date() : endDateStr ? new Date(endDateStr) : new Date();
  const months = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24 * 30.43)));
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${yrs} yr ${rem} mos` : `${yrs} yr${yrs > 1 ? 's' : ''}`;
}

export default function ExperienceSection() {
  const { ref, inView } = useInView();
  const [experiences, setExperiences] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const list = experiences || FALLBACK_EXPERIENCE;

  return (
    <section id="experience" className="section-padding" style={{ position: 'relative' }}>
      <style>{`
        .experience-timeline-grid {
          display: grid;
          grid-template-columns: 105px 28px 1fr;
          gap: 1.25rem;
          position: relative;
        }

        .experience-date-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          padding-top: 1.6rem;
        }

        .experience-mobile-date {
          display: none;
        }

        .experience-project-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 1.35rem 1.6rem;
          margin: 1.5rem 0 1.6rem 0;
        }

        [data-theme='light'] .experience-project-box {
          background: var(--bg-elevated);
          border-color: var(--border);
        }

        .experience-stats-group {
          display: flex;
          align-items: center;
          gap: 2.25rem;
          flex-shrink: 0;
        }

        .experience-tech-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0.35rem 0.8rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }

        [data-theme='light'] .experience-tech-pill {
          background: var(--bg-hover);
          border-color: var(--border);
          color: var(--text-secondary);
        }

        .experience-btn-cert {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--text-primary);
          border-radius: 8px;
          padding: 0.45rem 0.95rem;
          font-size: 0.82rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        [data-theme='light'] .experience-btn-cert {
          background: var(--bg-surface);
          border-color: var(--border);
          color: var(--text-primary);
        }

        .experience-btn-cert:hover {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }

        [data-theme='light'] .experience-btn-cert:hover {
          border-color: var(--accent);
          background: var(--bg-hover);
          transform: translateY(-1px);
        }

        @media (max-width: 860px) {
          .experience-timeline-grid {
            grid-template-columns: 24px 1fr;
            gap: 1rem;
          }
          .experience-date-col {
            display: none;
          }
          .experience-mobile-date {
            display: block;
            margin-bottom: 0.75rem;
          }
          .experience-project-box {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
          .experience-stats-group {
            width: 100%;
            justify-content: space-between;
            gap: 1rem;
            padding-top: 0.75rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
          }
        }
      `}</style>

      <div className="container">
        <SectionHeading
          eyebrow="Experience"
          title="Work & Internships"
          subtitle="Hands-on engineering experience designing and building systems"
        />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[...Array(2)].map((_, i) => (
              <SkeletonCard key={i} height={280} />
            ))}
          </div>
        ) : (
          <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative' }}>
            {list.map((exp, i) => {
              const dates = getTimelineDates(exp.startDate, exp.endDate, exp.current);
              const duration = getDuration(exp.startDate, exp.endDate, exp.current, exp.durationText);
              const logoText = exp.companyShort || (exp.company ? exp.company.split(' ')[0] : 'EXP');
              const companyDisplay = exp.companySub || exp.company;
              const isLast = i === list.length - 1;

              return (
                <motion.div
                  key={exp._id || i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="experience-timeline-grid"
                >
                  {/* Left Column: Date & from Subdate */}
                  <div className="experience-date-col">
                    <span
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                      }}
                    >
                      {dates.top}
                    </span>
                    {dates.sub && (
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.2rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {dates.sub}
                      </span>
                    )}
                  </div>

                  {/* Center Column: Glowing Dot & Timeline Line */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Glowing Red Dot */}
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: '#ef4444',
                        boxShadow: '0 0 16px 3px rgba(239, 68, 68, 0.7)',
                        marginTop: '1.75rem',
                        flexShrink: 0,
                        zIndex: 2,
                        position: 'relative',
                      }}
                    />

                    {/* Vertical Hairline Connecting Bar */}
                    {!isLast && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '2.5rem',
                          bottom: '-2.5rem',
                          width: 1.5,
                          background: 'rgba(239, 68, 68, 0.35)',
                          zIndex: 1,
                        }}
                      />
                    )}
                  </div>

                  {/* Right Column: Experience Card */}
                  <div
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '24px',
                      padding: '2.2rem 2.4rem',
                      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.45)',
                      transition: 'border-color var(--transition-base), box-shadow var(--transition-base)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                      e.currentTarget.style.boxShadow = '0 16px 40px -12px rgba(239, 68, 68, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.45)';
                    }}
                  >
                    {/* Mobile Date Header (shows when left col hidden) */}
                    <div className="experience-mobile-date">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {dates.top}
                        </span>
                        {dates.sub && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            ({dates.sub})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Top: Logo, Titles, Meta & Internship Badge */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                        {/* Company Logo Badge */}
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: '13px',
                            background: 'linear-gradient(135deg, #e11d48 0%, #b91c1c 100%)',
                            boxShadow: '0 6px 20px rgba(225, 29, 72, 0.42)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.92rem',
                            letterSpacing: '0.04em',
                            flexShrink: 0,
                            userSelect: 'none',
                          }}
                        >
                          {logoText}
                        </div>

                        {/* Role, Company Subtitle & Meta */}
                        <div>
                          <h3
                            style={{
                              fontSize: '1.35rem',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              letterSpacing: '-0.015em',
                              margin: '0 0 0.25rem 0',
                              lineHeight: 1.25,
                            }}
                          >
                            {exp.role}
                          </h3>

                          <div
                            style={{
                              fontSize: '0.98rem',
                              fontWeight: 500,
                              color: 'var(--text-secondary)',
                              marginBottom: '0.5rem',
                            }}
                          >
                            {companyDisplay}
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1.25rem',
                              flexWrap: 'wrap',
                              fontSize: '0.84rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {exp.location && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#ef4444"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {exp.location}
                              </span>
                            )}

                            {duration && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Employment Type Pill Badge */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.32)',
                          borderRadius: '9999px',
                          padding: '0.38rem 0.85rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: '#f87171',
                          whiteSpace: 'nowrap',
                          marginTop: '0.15rem',
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#ef4444',
                            boxShadow: '0 0 6px #ef4444',
                          }}
                        />
                        {exp.employmentType || 'INTERNSHIP'}
                      </div>
                    </div>

                    {/* PROJECT Sub-Card (Rendered when projectTitle or stats exist) */}
                    {(exp.projectTitle || (exp.stats && exp.stats.length > 0)) && (
                      <div className="experience-project-box">
                        {/* Project Info & Action Buttons */}
                        <div>
                          <div
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              letterSpacing: '0.14em',
                              textTransform: 'uppercase',
                              color: 'var(--text-muted)',
                              marginBottom: '0.35rem',
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
                              marginBottom: '0.85rem',
                            }}
                          >
                            {exp.projectTitle || 'UAS-RTMVD'}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            {/* Database Repo Button */}
                            <a
                              href={exp.repoUrl || 'https://github.com/ranjit-sharma'}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                background: '#dc2626',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.45rem 0.95rem',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#ef4444';
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(239, 68, 68, 0.45)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#dc2626';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                                <path d="M2 10h20" />
                              </svg>
                              <span>{exp.repoLabel || 'Database repo'}</span>
                              <span style={{ fontSize: '0.85rem' }}>↗</span>
                            </a>

                            {/* Certificate Button */}
                            <a
                              href={exp.certificateUrl || '#certifications'}
                              onClick={(e) => {
                                if (!exp.certificateUrl || exp.certificateUrl === '#' || exp.certificateUrl === '#certifications') {
                                  e.preventDefault();
                                  const el = document.getElementById('certifications');
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              target={exp.certificateUrl && exp.certificateUrl.startsWith('http') ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                              className="experience-btn-cert"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                                <path d="m8.21 13.89-1.21 6.11 5-3 5 3-1.21-6.12" />
                              </svg>
                              <span>Certificate</span>
                              <span style={{ fontSize: '0.85rem' }}>↗</span>
                            </a>
                          </div>
                        </div>

                        {/* Metric Stat Counters */}
                        {exp.stats && exp.stats.length > 0 && (
                          <div className="experience-stats-group">
                            {exp.stats.map((st, sidx) => (
                              <div key={sidx} style={{ textAlign: 'center' }}>
                                <div
                                  style={{
                                    fontSize: '1.65rem',
                                    fontWeight: 800,
                                    color: 'var(--text-primary)',
                                    lineHeight: 1,
                                    letterSpacing: '-0.02em',
                                  }}
                                >
                                  {st.value}
                                </div>
                                <div
                                  style={{
                                    fontSize: '0.64rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    marginTop: '0.35rem',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {st.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bullet List with Custom Red Checkmark Circles */}
                    {exp.responsibilities?.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem',
                          marginBottom: '1.5rem',
                        }}
                      >
                        {exp.responsibilities.map((r, ri) => (
                          <div
                            key={ri}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.85rem',
                            }}
                          >
                            {/* Red Checkmark Icon Circle */}
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                border: '1.5px solid #ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '0.2rem',
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                                <path
                                  d="M2.5 7.5L5.5 10.5L11.5 3.5"
                                  stroke="#ef4444"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>

                            <p
                              style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.92rem',
                                lineHeight: 1.65,
                                margin: 0,
                              }}
                            >
                              {r}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technology Stack Tags */}
                    {exp.technologies?.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          paddingTop: '0.25rem',
                        }}
                      >
                        {exp.technologies.map((tech) => (
                          <span key={tech} className="experience-tech-pill">
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
    </section>
  );
}
