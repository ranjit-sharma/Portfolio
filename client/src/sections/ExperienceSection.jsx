import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkeletonCard, Badge } from '../components/ui/index';
import api from '../services/api';

const FALLBACK_EXPERIENCE = [
  {
    _id: '1',
    company: 'DRDO PXE',
    role: 'Software Development Intern',
    employmentType: 'Internship',
    location: 'Chandipur, Odisha',
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    current: false,
    description:
      'Worked on the Upper Air Sounding System (UASS) — a ground station terminal for real-time meteorological data acquisition and visualization.',
    responsibilities: [
      'Developed functionality for processing binary telemetry frames from weather sounding equipment',
      'Built real-time monitoring interfaces for live GPS and meteorological sensor data',
      'Worked with TCP/UDP socket communication for LAN-based data acquisition',
      'Implemented interactive graphical visualization for atmospheric parameter data',
      'Tested system with real and simulated telemetry streams',
    ],
    technologies: ['JavaScript', 'Node.js', 'React', 'TCP/UDP', 'Binary Data Processing', 'Data Visualization'],
  },
  {
    _id: '2',
    company: 'Cognifyz Technologies',
    role: 'Java Development Intern',
    employmentType: 'Internship',
    location: 'Remote',
    startDate: '2024-12-15',
    endDate: '2025-01-15',
    current: false,
    description:
      'Completed a structured Java development internship, working on programming tasks and strengthening core Java skills.',
    responsibilities: [
      'Implemented Java programs covering core programming concepts',
      'Applied object-oriented programming principles in practical tasks',
      'Worked on structured problem-solving exercises',
    ],
    technologies: ['Java', 'OOP', 'Data Structures'],
  },
];

function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
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

  return (
    <section id="experience" className="section-padding">
      <div className="container">
        <SectionHeading
          eyebrow="Experience"
          title="Work & Internships"
          subtitle="Hands-on industry experience building real systems"
        />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[...Array(2)].map((_, i) => <SkeletonCard key={i} height={220} />)}
          </div>
        ) : (
          <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
            {/* Timeline line */}
            <div
              style={{
                position: 'absolute',
                left: '1.5rem',
                top: '2rem',
                bottom: '2rem',
                width: 2,
                background: 'var(--border)',
              }}
            />

            {(experiences || FALLBACK_EXPERIENCE).map((exp, i) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3rem 1fr',
                  gap: '1.5rem',
                  paddingBottom: i < (experiences || FALLBACK_EXPERIENCE).length - 1 ? '2.5rem' : 0,
                }}
              >
                {/* Timeline dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      border: '2px solid var(--bg-base)',
                      outline: '2px solid var(--accent)',
                      boxShadow: '0 0 12px var(--accent-glow)',
                      marginTop: '1.5rem',
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  />
                </div>

                {/* Card */}
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-border)';
                    e.currentTarget.style.boxShadow = '0 8px 24px var(--accent-glow)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                        {exp.role}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>
                          {exp.company}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>·</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {exp.employmentType}
                        </span>
                        {exp.location && (
                          <>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>·</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      style={{
                        background: 'var(--bg-hover)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        height: 'fit-content',
                      }}
                    >
                      {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                      {exp.description}
                    </p>
                  )}

                  {/* Responsibilities */}
                  {exp.responsibilities?.length > 0 && (
                    <ul
                      style={{
                        paddingLeft: '1.1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {exp.responsibilities.map((r, ri) => (
                        <li
                          key={ri}
                          style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}
                        >
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  {exp.technologies?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="accent">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
