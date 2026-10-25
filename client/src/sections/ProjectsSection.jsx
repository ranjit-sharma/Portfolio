import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe, Sparkles } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkeletonCard } from '../components/ui/index';
import api from '../services/api';
import { getAssetUrl } from '../utils/assetUrl';

const FALLBACK_PROJECTS = [
  {
    _id: '1',
    title: 'WonderLust',
    slug: 'wonderlust',
    categoryText: 'Full-Stack MERN',
    shortDescription:
      'A full-stack property-listing web application with listing management, RESTful routes, server-side rendering, database integration, input validation, reusable middleware, session-based functionality, and asynchronous error handling.',
    technologies: ['Node.js', 'Express.js', 'EJS', 'MongoDB', 'Mongoose', 'Joi', 'Bootstrap', 'Passport.js'],
    features: [
      'Property listing CRUD with complete creation, editing, and deletion capabilities',
      'User authentication and authorization with session-based security',
      'Form and schema validation using Joi with robust error handling',
      'Reusable middleware architecture for clean request-response pipelines',
      'Responsive user interface built with Bootstrap and server-side EJS templates',
      'Database-backed listing management with Mongoose schemas and relationships',
    ],
    githubUrl: 'https://github.com/ranjit-sharma/MajorProject',
    liveDemoUrl: 'https://wonderlust-yppn.onrender.com/listings',
    image: '/uploads/Screenshot_2026-10-21_132158-1792569132383-2161.png',
    featured: true,
    status: 'active',
  },
  {
    _id: '2',
    title: 'DRDO UASS Monitoring & Visualization System',
    slug: 'drdo-uass-monitoring-visualization-system',
    categoryText: 'Telemetry & SCADA',
    shortDescription:
      'Real-time monitoring and visualization system for upper-air sounding and meteorological telemetry, featuring sensor data processing and interactive graphical visualization.',
    technologies: [
      'JavaScript',
      'Node.js',
      'React',
      'TCP/UDP Sockets',
      'Binary Protocol Parsing',
      'Chart.js',
      'LAN Networking',
    ],
    features: [
      'Real-time binary telemetry frame decoding from radiosonde equipment',
      'TCP/UDP socket communication for LAN-based ground station data acquisition',
      'Live GPS and meteorological sensor data monitoring and stream parsing',
      'Interactive atmospheric parameter charts and dynamic visualization',
      'Simulated and live telemetry data validation and testing support',
    ],
    githubUrl: 'https://github.com/ranjit-sharma/UASS-Monitoring-System',
    liveDemoUrl: 'https://uass-monitoring-system.onrender.com/',
    image: '/uploads/Screenshot_2026-10-21_131931-1792568982980-6259.png',
    featured: true,
    status: 'active',
  },
];

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

export default function ProjectsSection() {
  const { ref, inView } = useInView();
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/projects')
      .then((res) => {
        const data = res.data.data;
        setProjects(data && data.length > 0 ? data : FALLBACK_PROJECTS);
      })
      .catch(() => setProjects(FALLBACK_PROJECTS))
      .finally(() => setLoading(false));
  }, []);

  const items = projects || FALLBACK_PROJECTS;

  return (
    <section id="projects" className="section-padding">
      <style>{`
        .project-timeline-row {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 2.25rem;
          position: relative;
        }
        .project-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 1.75rem;
          align-items: center;
          margin-bottom: 1.75rem;
        }
        @media (max-width: 968px) {
          .project-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 868px) {
          .project-timeline-row {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .project-rail-desktop {
            display: none !important;
          }
          .project-rail-mobile {
            display: flex !important;
          }
        }
        @media (min-width: 869px) {
          .project-rail-mobile {
            display: none !important;
          }
        }
      `}</style>

      <div className="container">
        <SectionHeading
          eyebrow="Projects"
          title="Featured Work"
          subtitle="Full-stack systems and applications engineered from concept to production"
        />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {[...Array(2)].map((_, i) => (
              <SkeletonCard key={i} height={320} />
            ))}
          </div>
        ) : (
          <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {items.map((proj, i) => {
              const projectNumber = String(i + 1).padStart(2, '0');
              const initials =
                proj.slug === 'wonderlust'
                  ? 'WL'
                  : proj.slug?.includes('uass') || proj.title?.includes('UASS')
                  ? 'UASS'
                  : proj.title
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 4)
                      .toUpperCase() || 'PROJ';

              const categorySub =
                proj.categoryText ||
                (proj.technologies?.includes('React') ? 'React & Node.js Application' : 'Full-Stack MERN Architecture');

              return (
                <motion.article
                  key={proj._id || i}
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="project-timeline-row"
                >
                  {/* Left Rail (Desktop) */}
                  <div
                    className="project-rail-desktop"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      position: 'relative',
                      paddingTop: '0.5rem',
                    }}
                  >
                    {/* Index labels */}
                    <div style={{ textAlign: 'right', width: '100%', paddingRight: '1.25rem' }}>
                      <div
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: 'var(--text-primary)',
                          letterSpacing: '-0.01em',
                          lineHeight: 1.2,
                        }}
                      >
                        PROJECT {projectNumber}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.2rem',
                          fontWeight: 500,
                        }}
                      >
                        {categorySub}
                      </div>
                    </div>

                    {/* Timeline vertical rail line */}
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '0.65rem',
                        bottom: i < items.length - 1 ? '-3rem' : '0.5rem',
                        width: 2,
                        background:
                          'linear-gradient(to bottom, var(--accent) 0%, var(--accent-border) 70%, transparent 100%)',
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

                  {/* Mobile Header */}
                  <div
                    className="project-rail-mobile"
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
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      PROJECT {projectNumber}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ({categorySub})
                    </span>
                  </div>

                  {/* Main Project Card */}
                  <div
                    className="card-ambient"
                    style={{
                      background:
                        'radial-gradient(circle at 12% 10%, var(--accent-dim) 0%, transparent 48%), var(--bg-card)',
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
                    {/* Header Row: Initials Avatar + Project Title + Status Pill */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '1.25rem',
                        flexWrap: 'wrap',
                        marginBottom: '1.5rem',
                      }}
                    >
                      {/* Left: Avatar squircle + Titles */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
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
                          {initials}
                        </div>

                        <div>
                          <h3
                            style={{
                              fontSize: '1.3rem',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              lineHeight: 1.25,
                              marginBottom: '0.25rem',
                            }}
                          >
                            {proj.title}
                          </h3>
                          <div
                            style={{
                              color: 'var(--text-secondary)',
                              fontSize: '0.92rem',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                            }}
                          >
                            <span>{categorySub}</span>
                            {proj.liveDemoUrl && (
                              <>
                                <span style={{ opacity: 0.5 }}>·</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent)', fontSize: '0.82rem' }}>
                                  <Globe size={12} /> Live Deployed
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Pill Badge */}
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
                        {proj.featured ? 'FEATURED PROJECT' : 'PRODUCTION APP'}
                      </div>
                    </div>

                    {/* Project Layout Grid: Overview & Actions (Left) + Browser Mockup Frame (Right) */}
                    <div className="project-hero-grid">
                      {/* Left: Overview description & Quick Action Buttons */}
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
                          PROJECT OVERVIEW
                        </div>
                        <p
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.92rem',
                            lineHeight: 1.7,
                            marginBottom: '1.25rem',
                          }}
                        >
                          {proj.shortDescription}
                        </p>

                        {/* Action buttons matching experience section */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          {/* GitHub Circular Button */}
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
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
                          )}

                          {/* Live Demo Pill Button */}
                          {proj.liveDemoUrl ? (
                            <a
                              href={proj.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.55rem 1.15rem',
                                borderRadius: '9999px',
                                background: 'var(--accent)',
                                color: 'var(--accent-contrast)',
                                border: '1px solid var(--accent)',
                                fontSize: '0.84rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                boxShadow: '0 2px 10px var(--accent-glow)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--accent-hover)';
                                e.currentTarget.style.boxShadow = '0 4px 18px var(--accent-glow)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--accent)';
                                e.currentTarget.style.boxShadow = '0 2px 10px var(--accent-glow)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <Sparkles size={14} />
                              Live Demo
                              <ExternalLink size={13} style={{ opacity: 0.85 }} />
                            </a>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.55rem 1rem',
                                borderRadius: '9999px',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)',
                                fontSize: '0.82rem',
                                fontWeight: 500,
                              }}
                            >
                              Deployment in progress
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: macOS Mockup Frame with Screenshot Preview */}
                      <div
                        style={{
                          borderRadius: '12px',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-elevated)',
                          overflow: 'hidden',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {/* Window Header */}
                        <div
                          style={{
                            height: 30,
                            padding: '0 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--bg-hover)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {['#ff5f57', '#ffbd2e', '#28c840'].map((c) => (
                              <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
                            ))}
                            <span
                              style={{
                                fontSize: '0.72rem',
                                color: 'var(--text-muted)',
                                marginLeft: '0.4rem',
                                fontFamily: 'monospace',
                              }}
                            >
                              {proj.slug || 'app.live'}
                            </span>
                          </div>
                        </div>

                        {/* Image Preview */}
                        <div
                          style={{
                            height: 180,
                            background: proj.image
                              ? `url(${getAssetUrl(proj.image)}) center/cover no-repeat`
                              : 'linear-gradient(135deg, var(--bg-hover) 0%, var(--bg-elevated) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          {!proj.image && (
                            <span style={{ fontSize: '2rem', color: 'var(--text-muted)', opacity: 0.4 }}>
                              ◈
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Key Architecture & Features (Checkmarked list) */}
                    {proj.features?.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          marginBottom: '1.5rem',
                        }}
                      >
                        {proj.features.slice(0, 5).map((feat, fIdx) => (
                          <div
                            key={fIdx}
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
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technology Stack Pill Badges */}
                    {proj.technologies?.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid var(--border)',
                        }}
                      >
                        {proj.technologies.map((tech) => (
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
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
