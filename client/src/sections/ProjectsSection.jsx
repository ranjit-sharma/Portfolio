import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkeletonCard, Badge } from '../components/ui/index';
import api from '../services/api';
import { getAssetUrl } from '../utils/assetUrl';

const FALLBACK_PROJECTS = [
  {
    _id: '1',
    title: 'WonderLust',
    slug: 'wonderlust',
    shortDescription:
      'A full-stack property-listing web application with listing management, RESTful routes, server-side rendering, database integration, input validation, reusable middleware, session-based functionality, and asynchronous error handling.',
    technologies: ['Node.js', 'Express.js', 'EJS', 'MongoDB', 'Mongoose', 'Joi', 'Bootstrap'],
    features: [
      'Property listing CRUD',
      'User authentication & authorization',
      'Form and schema validation',
      'Reusable middleware',
      'Responsive user interface',
      'Database-backed listing management',
    ],
    githubUrl: '',
    liveDemoUrl: '',
    featured: true,
    status: 'active',
  },
  {
    _id: '2',
    title: 'DRDO UASS Monitoring & Visualization',
    slug: 'drdo-uass',
    shortDescription:
      'Real-time monitoring and visualization system for upper-air sounding and meteorological telemetry, featuring sensor data processing and interactive graphical visualization.',
    technologies: ['JavaScript', 'Node.js', 'React', 'TCP/UDP', 'Binary Telemetry', 'Data Visualization'],
    features: [
      'Real-time telemetry data processing',
      'Binary frame decoding',
      'Interactive atmospheric data charts',
      'GPS and sensor data display',
      'LAN-based ground station communication',
    ],
    githubUrl: '',
    liveDemoUrl: '',
    featured: true,
    status: 'active',
  },
];

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
    <section id="projects" className="section-padding" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <SectionHeading
          eyebrow="Projects"
          title="Featured Work"
          subtitle="Applications I've designed, built, and deployed"
        />

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {[...Array(2)].map((_, i) => <SkeletonCard key={i} height={340} />)}
          </div>
        ) : (
          <div
            ref={ref}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {items.map((proj, i) => (
              <motion.article
                key={proj._id}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-ambient"
                style={{
                  background: 'radial-gradient(circle at 12% 10%, var(--accent-dim) 0%, transparent 48%), var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 16px 44px -8px var(--accent-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                {/* Image area */}
                <div
                  style={{
                    height: 180,
                    background: proj.image
                      ? `url(${getAssetUrl(proj.image)}) center/cover`
                      : 'linear-gradient(135deg, var(--bg-hover) 0%, var(--bg-elevated) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--border)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {!proj.image && (
                    <span
                      style={{
                        fontSize: '2.5rem',
                        opacity: 0.3,
                      }}
                    >
                      ◈
                    </span>
                  )}
                  {proj.featured && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        background: 'var(--accent)',
                        color: 'var(--accent-contrast)',
                        boxShadow: '0 2px 8px var(--accent-glow)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '9999px',
                      }}
                    >
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3 }}>
                    {proj.title}
                  </h3>

                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {proj.shortDescription}
                  </p>

                  {/* Features */}
                  {proj.features?.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>
                        Key Features
                      </p>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {proj.features.slice(0, 4).map((f) => (
                          <li key={f} style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', display: 'flex', gap: '0.4rem' }}>
                            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>▸</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {proj.technologies?.map((tech) => (
                      <Badge key={tech} variant="accent">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {proj.githubUrl ? (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          transition: 'all var(--transition-fast)',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        GitHub
                      </a>
                    ) : (
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          fontSize: '0.82rem',
                          color: 'var(--text-muted)',
                          cursor: 'default',
                        }}
                      >
                        Private Repo
                      </span>
                    )}
                    {proj.liveDemoUrl ? (
                      <a
                        href={proj.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--accent)',
                          color: 'var(--accent-contrast)',
                          border: '1px solid var(--accent)',
                          boxShadow: '0 2px 8px var(--accent-glow)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          transition: 'all var(--transition-fast)',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--accent-hover)';
                          e.currentTarget.style.boxShadow = '0 0 16px var(--accent-glow)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--accent)';
                          e.currentTarget.style.boxShadow = '0 2px 8px var(--accent-glow)';
                        }}
                      >
                        Live Demo
                      </a>
                    ) : (
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          fontSize: '0.82rem',
                          color: 'var(--text-muted)',
                          cursor: 'default',
                        }}
                      >
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
