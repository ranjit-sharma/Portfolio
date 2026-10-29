import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, School, MapPin, CalendarDays, Check } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { SectionHeading } from '../components/ui/index';
import api from '../services/api';

const DEGREE = {
  institution: 'Trident Academy of Technology',
  affiliation: 'BPUT',
  location: 'Bhubaneswar, Odisha',
  qualification: 'B.Tech in Computer Science & IT',
  start: 2023,
  end: 2027,
  cgpa: '',
  totalSemesters: 8,
  // Update each semester
  currentSemester: 7,
};

const SCHOOLS = [
  {
    institution: 'KD International School',
    location: 'Rajdhanwar, Jharkhand',
    qualification: 'Class XII',
    level: 'Intermediate',
    board: 'CBSE',
    start: 2021,
    end: 2023,
  },
  {
    institution: 'Redwoods English School',
    location: 'Jeypore, Odisha',
    qualification: 'Class X',
    level: 'Matriculation',
    board: 'CBSE',
    start: 2019,
    end: 2021,
  },
];

export default function EducationSection() {
  const { ref, inView } = useInView();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/profile')
      .then((res) => setProfile(res.data?.data || null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const currentSemester =
    profile?.educationCurrentSemester !== undefined && profile?.educationCurrentSemester !== null
      ? Number(profile.educationCurrentSemester)
      : DEGREE.currentSemester;
  const rawCgpa =
    profile?.educationCgpa !== undefined && profile?.educationCgpa !== null
      ? String(profile.educationCgpa).trim()
      : (profile ? '' : (DEGREE.cgpa || ''));
  const numCgpa = parseFloat(rawCgpa);
  const hasCgpa = Boolean(rawCgpa && !isNaN(numCgpa) && numCgpa > 0);
  const cgpa = hasCgpa ? rawCgpa : '';
  const totalSemesters = Number(profile?.educationTotalSemesters) || DEGREE.totalSemesters;
  const qualification = profile?.educationDegree || DEGREE.qualification;
  const institution = profile?.educationInstitution || DEGREE.institution;
  const startYear = profile?.educationStartYear || DEGREE.start;
  const endYear = profile?.educationEndYear || DEGREE.end;

  const schools =
    Array.isArray(profile?.educationSchools) && profile.educationSchools.length > 0
      ? profile.educationSchools.filter((s) => s && s.institution)
      : SCHOOLS;

  const semesters = Array.from({ length: totalSemesters }, (_, i) => i + 1);
  const completed = Math.max(0, currentSemester - 1);

  const reveal = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section id="education" className="section-padding">
      <style>{`
        .edu-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }
        .edu-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(160deg, var(--bg-elevated) 0%, var(--bg-card) 60%);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          transition: border-color var(--transition-card), box-shadow var(--transition-card);
        }
        .edu-card:hover {
          border-color: var(--accent-border);
          box-shadow: 0 16px 36px -14px var(--accent-glow), var(--shadow-md);
        }
        .edu-degree {
          grid-column: 1 / -1;
          padding: 1.75rem;
          border-color: var(--accent-border);
          background:
            radial-gradient(circle at 100% 0%, var(--accent-dim) 0%, transparent 45%),
            linear-gradient(160deg, var(--bg-elevated) 0%, var(--bg-card) 60%);
        }
        .edu-watermark {
          position: absolute;
          right: 220px;
          top: -12px;
          color: var(--accent);
          opacity: 0.08;
          pointer-events: none;
        }
        .edu-head {
          display: flex;
          gap: 1.1rem;
          align-items: flex-start;
        }
        .edu-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
        }
        .edu-icon-sm {
          width: 42px;
          height: 42px;
          border-radius: 12px;
        }
        .edu-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-bottom: 0.45rem;
        }
        .edu-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 700;
          border-radius: 9999px;
          padding: 0.2rem 0.65rem;
          color: var(--text-secondary);
          background: var(--bg-hover);
          border: 1px solid var(--border);
        }
        /* CGPA ring on the right of the degree header */
        .edu-score {
          position: relative;
          align-self: center;
          flex-shrink: 0;
          width: 112px;
          height: 112px;
          margin-left: auto;
        }
        .edu-ring {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
          filter: drop-shadow(0 0 10px var(--accent-glow));
        }
        .edu-ring circle {
          fill: none;
          stroke-width: 7;
        }
        .edu-ring-track {
          stroke: var(--border);
        }
        .edu-ring-fill {
          stroke: var(--accent);
          stroke-linecap: round;
        }
        .edu-ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .edu-ring-center strong {
          font-size: 1.6rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }
        .edu-ring-center span {
          margin-top: 0.25rem;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .edu-tag-live {
          color: var(--accent);
          background: var(--accent-dim);
          border-color: var(--accent-border);
        }
        .edu-tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse-glow 2s ease infinite;
        }
        .edu-qualification {
          margin: 0;
          font-size: clamp(1.25rem, 2.4vw, 1.6rem);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }
        .edu-institution {
          margin: 0.3rem 0 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--accent);
        }
        .edu-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem 1.1rem;
          margin-top: 0.6rem;
          font-size: 0.84rem;
          color: var(--text-muted);
        }
        .edu-meta span {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        /* Semester tracker */
        .edu-progress {
          margin-top: 1.6rem;
          padding-top: 1.35rem;
          border-top: 1px solid var(--border);
        }
        .edu-progress-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 0.85rem;
        }
        .edu-progress-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .edu-progress-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .edu-progress-value strong {
          color: var(--accent);
          font-size: 1.2rem;
          font-weight: 900;
        }
        .edu-years-row,
        .edu-steps {
          display: grid;
          grid-template-columns: repeat(${DEGREE.totalSemesters}, minmax(0, 1fr));
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .edu-years-row {
          margin-bottom: 0.9rem;
        }
        .edu-year {
          grid-column: span 2;
          margin: 0 0.4rem;
          padding-top: 0.4rem;
          border-top: 2px solid var(--border);
          text-align: center;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .edu-year-current {
          border-top-color: var(--accent);
          color: var(--accent);
        }
        .edu-steps {
          position: relative;
        }
        /* Track runs from the first dot's centre to the last dot's centre */
        .edu-track,
        .edu-track-fill {
          position: absolute;
          top: 16px;
          left: calc(50% / ${DEGREE.totalSemesters});
          right: calc(50% / ${DEGREE.totalSemesters});
          height: 3px;
          border-radius: 3px;
        }
        .edu-track {
          background: var(--border);
        }
        .edu-track-fill {
          background: linear-gradient(90deg, var(--accent) 0%, var(--accent) 92%, #ffffff 100%);
          box-shadow: 0 0 12px var(--accent-glow), 0 0 6px var(--accent);
          transform-origin: left;
        }
        .edu-track-fill::after {
          content: '';
          position: absolute;
          right: -3px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px #ffffff, 0 0 16px var(--accent);
        }
        .edu-step {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .edu-step-dot {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-muted);
          background: var(--bg-elevated);
          border: 2px solid var(--border);
        }
        .edu-step-done .edu-step-dot {
          color: var(--accent-contrast);
          background: var(--accent);
          border-color: var(--accent);
        }
        .edu-step-current .edu-step-dot {
          color: var(--accent);
          background: var(--bg-base);
          border-color: var(--accent);
          animation: pulse-glow 2s ease infinite;
        }
        .edu-step-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .edu-step-done .edu-step-label {
          color: var(--text-secondary);
        }
        .edu-step-current .edu-step-label {
          color: var(--accent);
        }
        .edu-school {
          padding: 1.35rem;
        }
        .edu-school .edu-head {
          gap: 0.9rem;
        }
        .edu-school-name {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }
        .edu-school-title {
          margin: 0;
          font-size: 1.02rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .edu-school-qualification {
          margin: 0.25rem 0 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent);
        }
        .edu-school-qualification span {
          color: var(--text-secondary);
          font-weight: 500;
        }
        .edu-years {
          margin-left: auto;
          flex-shrink: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: var(--bg-hover);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.25rem 0.55rem;
        }
        @media (max-width: 768px) {
          .edu-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .edu-degree {
            padding: 1.25rem;
          }
          /* Keep watermark background design at right corner in mobile view only */
          .edu-watermark {
            right: -12px;
            top: -12px;
          }
          .edu-head {
            flex-wrap: wrap;
          }
          /* On phones the ring sits on its own row */
          .edu-score {
            width: 88px;
            height: 88px;
            margin-left: 0;
          }
          .edu-ring-center strong {
            font-size: 1.25rem;
          }
          .edu-step-dot {
            width: 26px;
            height: 26px;
            font-size: 0.68rem;
          }
          .edu-track,
          .edu-track-fill {
            top: 12px;
          }
          .edu-step-label span,
          .edu-year span {
            display: none;
          }
          .edu-year {
            margin: 0 0.15rem;
            font-size: 0.62rem;
          }
        }
      `}</style>

      <div className="container">
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <SectionHeading
            icon={GraduationCap}
            eyebrow="Education"
            title="Learning Path"
            subtitle="Where I built my foundations in computer science"
          />

          {loading ? (
            <div style={{ height: 340, background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }} />
          ) : !profile ? (
            <div
              style={{
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                background: 'var(--bg-card)',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
                marginTop: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <GraduationCap size={40} style={{ color: 'var(--accent)', opacity: 0.85, marginBottom: '0.85rem' }} />
              <h4 style={{ margin: '0 0 0.4rem', color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700 }}>
                Education Details Unavailable
              </h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', lineHeight: 1.55 }}>
                Database is currently not connected. Academic progress and records will be shown once connected.
              </p>
            </div>
          ) : (
            <div ref={ref} className="edu-grid">
            {/* Current degree */}
            <motion.article className="edu-card edu-degree card-spotlight" {...reveal(0)}>
              <GraduationCap size={190} strokeWidth={1.1} className="edu-watermark" aria-hidden="true" />
              <div className="edu-head">
                <span className="edu-icon" aria-hidden="true">
                  <GraduationCap size={26} strokeWidth={2} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="edu-tags">
                    <span className="edu-tag edu-tag-live">
                      <span className="edu-tag-dot" />
                      Currently pursuing
                    </span>
                    <span className="edu-tag">{DEGREE.affiliation}</span>
                  </div>
                  <h3 className="edu-qualification">{qualification}</h3>
                  <p className="edu-institution">{institution}</p>
                  <div className="edu-meta">
                    <span>
                      <MapPin size={14} aria-hidden="true" />
                      {DEGREE.location}
                    </span>
                    <span>
                      <CalendarDays size={14} aria-hidden="true" />
                      {startYear} – {endYear}
                    </span>
                  </div>
                </div>

                {hasCgpa && (
                  <div className="edu-score" role="img" aria-label={`CGPA ${cgpa} out of 10`}>
                    <svg viewBox="0 0 100 100" className="edu-ring" aria-hidden="true">
                      <circle cx="50" cy="50" r="44" className="edu-ring-track" />
                      {/* pathLength=1 lets the dash offset be the unfilled share of the ring */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="44"
                        className="edu-ring-fill"
                        pathLength="1"
                        strokeDasharray="1"
                        initial={{ strokeDashoffset: 1 }}
                        animate={{ strokeDashoffset: inView ? Math.max(0, 1 - numCgpa / 10) : 1 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </svg>
                    <div className="edu-ring-center" aria-hidden="true">
                      <strong>{cgpa}</strong>
                      <span>CGPA</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="edu-progress">
                <div className="edu-progress-head">
                  <span className="edu-progress-label">Degree progress</span>
                  <span className="edu-progress-value">
                    Semester <strong>{currentSemester}</strong> of {totalSemesters}
                  </span>
                </div>
                <div
                  role="img"
                  aria-label={`${completed} of ${totalSemesters} semesters completed, currently in semester ${currentSemester}`}
                >
                  <div className="edu-years-row" aria-hidden="true">
                    {Array.from({ length: Math.ceil(totalSemesters / 2) }, (_, y) => (
                      <span
                        key={y}
                        className={`edu-year${y + 1 === Math.ceil(currentSemester / 2) ? ' edu-year-current' : ''}`}
                      >
                        <span>Year </span>
                        {y + 1}
                      </span>
                    ))}
                  </div>

                  <div className="edu-steps" aria-hidden="true">
                    <span className="edu-track" />
                    {/* Fills dynamically from starting semester up to current */}
                    <motion.span
                      className="edu-track-fill"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: inView ? completed / Math.max(1, totalSemesters - 1) : 0 }}
                      transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {semesters.map((n) => {
                      const isDone = n <= completed;
                      const isCurrent = n === currentSemester;
                      const isNext = n > currentSemester;

                      // Staggered timing as the line reaches each semester node
                      const relFrac = currentSemester > 1 ? Math.min(1, (n - 1) / (currentSemester - 1)) : 1;
                      const nodeDelay = 0.4 + Math.pow(relFrac, 0.82) * 1.7;

                      return (
                        <div
                          key={n}
                          className={`edu-step edu-step-${isDone ? 'done' : isCurrent ? 'current' : 'next'}`}
                        >
                          {isDone ? (
                            <motion.span
                              className="edu-step-dot"
                              initial={{
                                scale: 0.8,
                                backgroundColor: 'var(--bg-elevated)',
                                borderColor: 'var(--border)',
                                color: 'var(--text-muted)',
                              }}
                              animate={
                                inView
                                  ? {
                                      scale: [0.8, 1.25, 1],
                                      backgroundColor: 'var(--accent)',
                                      borderColor: 'var(--accent)',
                                      color: 'var(--accent-contrast)',
                                    }
                                  : {
                                      scale: 0.8,
                                      backgroundColor: 'var(--bg-elevated)',
                                      borderColor: 'var(--border)',
                                      color: 'var(--text-muted)',
                                    }
                              }
                              transition={{
                                delay: nodeDelay,
                                duration: 0.42,
                                ease: [0.34, 1.56, 0.64, 1],
                              }}
                            >
                              <motion.span
                                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                animate={
                                  inView
                                    ? { scale: 1, opacity: 1, rotate: 0 }
                                    : { scale: 0, opacity: 0 }
                                }
                                transition={{
                                  delay: nodeDelay + 0.08,
                                  duration: 0.32,
                                  ease: 'easeOut',
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Check size={15} strokeWidth={3} />
                              </motion.span>
                            </motion.span>
                          ) : isCurrent ? (
                            <motion.span
                              className="edu-step-dot"
                              initial={{
                                scale: 0.8,
                                backgroundColor: 'var(--bg-elevated)',
                                borderColor: 'var(--border)',
                                color: 'var(--text-muted)',
                              }}
                              animate={
                                inView
                                  ? {
                                      scale: [0.8, 1.3, 1],
                                      backgroundColor: 'var(--bg-base)',
                                      borderColor: 'var(--accent)',
                                      color: 'var(--accent)',
                                    }
                                  : {
                                      scale: 0.8,
                                      backgroundColor: 'var(--bg-elevated)',
                                      borderColor: 'var(--border)',
                                      color: 'var(--text-muted)',
                                    }
                              }
                              transition={{
                                delay: nodeDelay,
                                duration: 0.48,
                                ease: [0.34, 1.56, 0.64, 1],
                              }}
                            >
                              <span style={{ fontWeight: 800 }}>{n}</span>
                            </motion.span>
                          ) : (
                            <motion.span
                              className="edu-step-dot"
                              initial={{ opacity: 0.5, scale: 0.85 }}
                              animate={inView ? { opacity: 0.75, scale: 1 } : { opacity: 0.5, scale: 0.85 }}
                              transition={{ delay: 0.35, duration: 0.35 }}
                            >
                              <span>{n}</span>
                            </motion.span>
                          )}

                          <motion.span
                            className="edu-step-label"
                            initial={{ opacity: 0.35, y: 3 }}
                            animate={
                              inView
                                ? { opacity: isDone || isCurrent ? 1 : 0.6, y: 0 }
                                : { opacity: 0.35, y: 3 }
                            }
                            transition={{ delay: isNext ? 0.35 : nodeDelay, duration: 0.3 }}
                          >
                            <span>Sem </span>
                            {n}
                          </motion.span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Schooling */}
            {schools.map((school, i) => (
              <motion.article
                key={school._id || school.institution || i}
                className="edu-card edu-school card-spotlight"
                {...reveal(0.15 + i * 0.1)}
                whileHover={{ y: -3 }}
              >
                <div className="edu-head">
                  <span className="edu-icon edu-icon-sm" aria-hidden="true">
                    <School size={20} strokeWidth={2} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="edu-school-name">
                      <h3 className="edu-school-title">{school.institution}</h3>
                      <span className="edu-tag">{school.board}</span>
                    </div>
                    <p className="edu-school-qualification">
                      {school.qualification} <span>· {school.level}</span>
                    </p>
                    <div className="edu-meta">
                      <span>
                        <MapPin size={14} aria-hidden="true" />
                        {school.location}
                      </span>
                    </div>
                  </div>
                  <span className="edu-years">
                    {school.start} – {school.end}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
