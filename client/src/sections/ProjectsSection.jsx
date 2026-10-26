import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, ArrowUpRight, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
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
    categoryText: 'Full-Stack MERN Platform',
    shortDescription:
      'A full-stack property-listing web application featuring listing management, RESTful routes, server-side rendering, database integration, input validation, reusable middleware, session-based functionality, and asynchronous error handling.',
    technologies: [
      'Node.js',
      'Express.js',
      'EJS',
      'MongoDB',
      'Mongoose',
      'Joi',
      'Bootstrap',
      'Passport.js',
    ],
    stats: [
      { value: 'MERN', label: 'FULL-STACK ARCH' },
      { value: 'CRUD', label: 'LISTING WORKFLOW' },
      { value: 'Cloudinary', label: 'MEDIA PIPELINE' },
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
    categoryText: 'Telemetry & SCADA System',
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
    stats: [
      { value: '5+', label: 'TELEMETRY STREAMS' },
      { value: 'TCP/UDP', label: 'SOCKET PIPELINE' },
      { value: 'Real-time', label: 'SENSOR PARSING' },
    ],
    githubUrl: 'https://github.com/ranjit-sharma/UASS-Monitoring-System',
    liveDemoUrl: 'https://uass-monitoring-system.onrender.com/',
    image: '/uploads/Screenshot_2026-10-21_131931-1792568982980-6259.png',
    featured: true,
    status: 'active',
  },
];

function getDisplayUrl(url, fallbackSlug) {
  if (!url) return `${fallbackSlug || 'project'}.onrender.com`;
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
}

function getProjectStats(proj) {
  if (Array.isArray(proj.stats) && proj.stats.length >= 3) {
    return proj.stats.slice(0, 3);
  }
  const slug = (proj.slug || proj.title || '').toLowerCase();
  if (slug.includes('wonderlust')) {
    return [
      { value: 'MERN', label: 'FULL-STACK ARCH' },
      { value: 'CRUD', label: 'LISTING WORKFLOW' },
      { value: 'Cloudinary', label: 'MEDIA PIPELINE' },
    ];
  }
  if (slug.includes('uass') || slug.includes('drdo')) {
    return [
      { value: '5+', label: 'TELEMETRY STREAMS' },
      { value: 'TCP/UDP', label: 'SOCKET PIPELINE' },
      { value: 'Real-time', label: 'SENSOR PARSING' },
    ];
  }
  return [
    { value: `${proj.technologies?.length || 4}+`, label: 'CORE TECHNOLOGIES' },
    { value: `${proj.features?.length || 5}+`, label: 'KEY FEATURES' },
    { value: 'Live', label: 'DEPLOYED STATUS' },
  ];
}

function getProjectMeta(proj) {
  const slug = (proj.slug || proj.title || '').toLowerCase();
  let category = proj.categoryText || proj.category;
  if (!category) {
    if (slug.includes('wonderlust')) {
      category = 'FULL-STACK MERN PLATFORM';
    } else if (slug.includes('uass') || slug.includes('drdo')) {
      category = 'TELEMETRY & SCADA SYSTEM';
    } else {
      category = 'ENGINEERING PROJECT';
    }
  }
  return category.toUpperCase();
}

export default function ProjectsSection() {
  const { ref, inView } = useInView();
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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
  const featuredItems = items.slice(0, 3);
  const extraItems = items.slice(3);

  return (
    <section id="projects" className="section-padding">
      <style>{`
        .projects-container {
          width: 100%;
        }

        .project-showcase-row {
          display: grid;
          grid-template-columns: minmax(300px, 480px) 1fr;
          gap: 3rem;
          align-items: center;
        }

        .project-showcase-row.reversed {
          grid-template-columns: 1fr minmax(300px, 480px);
        }

        .project-visual-card {
          position: relative;
          width: 100%;
          max-width: 480px;
          background: radial-gradient(circle at 14% 14%, var(--accent-dim) 0%, transparent 55%), var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1rem 1.15rem;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          overflow: hidden;
        }

        .project-visual-card:hover {
          border-color: var(--accent-border);
          box-shadow: 0 12px 30px -8px var(--accent-glow);
        }

        .project-visual-card:hover .project-mockup-img {
          transform: scale(1.02);
        }

        .project-popout-btn {
          position: absolute;
          top: 0.85rem;
          right: 0.85rem;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          z-index: 5;
          transition: all 0.2s ease;
        }

        .project-popout-btn:hover {
          background: var(--accent-dim);
          border-color: var(--accent-border);
          color: var(--accent);
          transform: scale(1.06);
          box-shadow: 0 3px 12px var(--accent-glow);
        }

        .project-browser-frame {
          border-radius: 9px;
          border: 1px solid var(--border);
          background: #090d14;
          overflow: hidden;
          box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
        }

        .project-browser-header {
          height: 28px;
          background: var(--bg-elevated);
          border-bottom: 1px solid var(--border);
          padding: 0 0.75rem;
          display: flex;
          align-items: center;
          position: relative;
        }

        .project-traffic-dots {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .project-traffic-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .project-address-pill {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          max-width: 65%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.1rem 0.75rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          font-size: 0.68rem;
          font-family: monospace;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .project-browser-viewport {
          position: relative;
          width: 100%;
          aspect-ratio: 1888 / 924;
          overflow: hidden;
          background: #090d14;
        }

        .project-mockup-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 0.35s ease;
        }

        .project-tech-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.85rem;
        }

        .project-tech-pill {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-pill);
          padding: 0.22rem 0.75rem;
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .project-tech-pill:hover {
          border-color: var(--accent-border);
          color: var(--accent);
          background: var(--accent-dim);
        }

        .project-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.35rem;
        }

        .project-stat-value {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .project-stat-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.25rem;
        }

        .project-github-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .project-github-btn:hover {
          border-color: var(--accent-border);
          background: var(--accent-dim);
          color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        .project-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.25rem;
          border-radius: var(--radius-pill);
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 0.84rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .project-action-btn:hover {
          border-color: var(--accent-border);
          background: var(--accent-dim);
          color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        .project-action-btn-demo {
          color: var(--accent);
          border-color: var(--accent-border);
        }

        .project-divider {
          height: 1px;
          background: var(--border);
          margin: 3rem 0;
        }

        /* View more button */
        .project-view-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.75rem 1.85rem;
          border-radius: var(--radius-pill);
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.22s ease;
          box-shadow: var(--shadow-sm);
        }

        .project-view-more-btn:hover {
          background: var(--accent-dim);
          border-color: var(--accent-border);
          color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px var(--accent-glow);
        }

        /* Additional projects card grid */
        .more-projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr));
          gap: 1.5rem;
          width: 100%;
          margin-top: 2.5rem;
        }

        .project-compact-card {
          position: relative;
          background: radial-gradient(circle at 14% 14%, var(--accent-dim) 0%, transparent 55%), var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          overflow: hidden;
        }

        .project-compact-card:hover {
          border-color: var(--accent-border);
          box-shadow: 0 16px 36px -8px var(--accent-glow);
          transform: translateY(-3px);
        }

        .project-compact-card:hover .project-compact-img {
          transform: scale(1.025);
        }

        .project-compact-frame {
          border-radius: 9px;
          border: 1px solid var(--border);
          background: #090d14;
          overflow: hidden;
          box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
        }

        .project-compact-viewport {
          position: relative;
          width: 100%;
          aspect-ratio: 1888 / 924;
          overflow: hidden;
          background: #090d14;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .project-compact-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 0.35s ease;
        }

        @media (max-width: 1024px) {
          .project-showcase-row,
          .project-showcase-row.reversed {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }

          .project-visual-card {
            max-width: 100%;
          }

          .project-visual-col {
            order: 1 !important;
          }

          .project-content-col {
            order: 2 !important;
          }

          .project-divider {
            margin: 2.5rem 0;
          }

          .project-stats-grid {
            gap: 0.85rem;
          }

          .project-stat-value {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 640px) {
          .project-visual-card {
            padding: 0.85rem;
            border-radius: 12px;
          }

          .project-popout-btn {
            top: 0.7rem;
            right: 0.7rem;
            width: 28px;
            height: 28px;
          }

          .project-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem;
          }

          .more-projects-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }
      `}</style>

      <div className="container">
        <SectionHeading
          eyebrow="Projects"
          title="Engineered Systems"
          subtitle="Full-stack systems and applications engineered from concept to production"
        />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[...Array(2)].map((_, i) => (
              <SkeletonCard key={i} height={280} />
            ))}
          </div>
        ) : (
          <div ref={ref} className="projects-container">
            {/* Featured Projects (Top 3) in Flagship Showcase Format */}
            {featuredItems.map((proj, i) => {
              const isEven = i % 2 === 0;
              const metaText = getProjectMeta(proj);
              const stats = getProjectStats(proj);
              const displayUrl = getDisplayUrl(proj.liveDemoUrl, proj.slug);
              const primaryLink = proj.liveDemoUrl || proj.githubUrl || '#';

              // Visual column (compact macOS frame + tech pills)
              const VisualColumn = (
                <div className="project-visual-col">
                  <div className="project-visual-card">
                    {/* Top-right popout link */}
                    {primaryLink !== '#' && (
                      <a
                        href={primaryLink}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${proj.title} in new tab`}
                        title="Open Live Site"
                        className="project-popout-btn"
                      >
                        <ArrowUpRight size={15} />
                      </a>
                    )}

                    {/* Compact macOS Browser Mockup */}
                    <div className="project-browser-frame">
                      <div className="project-browser-header">
                        <div className="project-traffic-dots">
                          <span
                            className="project-traffic-dot"
                            style={{ background: '#ff5f56' }}
                          />
                          <span
                            className="project-traffic-dot"
                            style={{ background: '#ffbd2e' }}
                          />
                          <span
                            className="project-traffic-dot"
                            style={{ background: '#27c93f' }}
                          />
                        </div>

                        <div className="project-address-pill">
                          {displayUrl}
                        </div>
                      </div>

                      <div className="project-browser-viewport">
                        {proj.image ? (
                          <a
                            href={primaryLink}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'block',
                              width: '100%',
                              height: '100%',
                            }}
                          >
                            <img
                              src={getAssetUrl(proj.image)}
                              alt={`${proj.title} preview`}
                              className="project-mockup-img"
                              loading="lazy"
                            />
                          </a>
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'var(--bg-elevated)',
                              color: 'var(--text-muted)',
                              fontSize: '0.85rem',
                            }}
                          >
                            Preview Unavailable
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tech pills beneath browser mockup */}
                    {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                      <div className="project-tech-pills">
                        {proj.technologies.map((tech) => (
                          <span key={tech} className="project-tech-pill">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );

              // Content column (Meta, Title, Description, Stats, Action buttons)
              const ContentColumn = (
                <div className="project-content-col">
                  {/* Meta tag: Icon + Category */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '0.6rem',
                    }}
                  >
                    <FolderGit2 size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span>{metaText}</span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: 'clamp(1.65rem, 2.5vw, 2.25rem)',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                      marginBottom: '0.85rem',
                    }}
                  >
                    {proj.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.94rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {proj.shortDescription || proj.fullDescription}
                  </p>

                  {/* 3 Stats in a row */}
                  <div className="project-stats-grid">
                    {stats.map((s, idx) => (
                      <div key={idx}>
                        <div className="project-stat-value">{s.value}</div>
                        <div className="project-stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons: GitHub icon only & Live Project */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${proj.title} on GitHub`}
                        title="View GitHub Repository"
                        className="project-github-btn"
                      >
                        <SiGithub size={17} />
                      </a>
                    )}

                    {proj.liveDemoUrl && (
                      <a
                        href={proj.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="project-action-btn project-action-btn-demo"
                      >
                        <ExternalLink size={14} />
                        <span>Live Project</span>
                      </a>
                    )}
                  </div>
                </div>
              );

              return (
                <div key={proj._id || i}>
                  <motion.article
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: i * 0.12 }}
                    className={`project-showcase-row ${!isEven ? 'reversed' : ''}`}
                  >
                    {isEven ? (
                      <>
                        {VisualColumn}
                        {ContentColumn}
                      </>
                    ) : (
                      <>
                        {ContentColumn}
                        {VisualColumn}
                      </>
                    )}
                  </motion.article>

                  {/* Divider between showcase projects */}
                  {i < featuredItems.length - 1 && <div className="project-divider" />}
                </div>
              );
            })}

            {/* View More / Additional Projects in Card Format */}
            {extraItems.length > 0 && (
              <div style={{ marginTop: '3.5rem' }}>
                <AnimatePresence>
                  {showAll && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4 }}
                      className="more-projects-grid"
                    >
                      {extraItems.map((proj, idx) => {
                        const metaText = getProjectMeta(proj);
                        const displayUrl = getDisplayUrl(proj.liveDemoUrl, proj.slug);
                        const primaryLink = proj.liveDemoUrl || proj.githubUrl || '#';

                        return (
                          <div key={proj._id || idx} className="project-compact-card">
                            {/* Top-right popout link */}
                            {primaryLink !== '#' && (
                              <a
                                href={primaryLink}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open ${proj.title} in new tab`}
                                title="Open Live Site"
                                className="project-popout-btn"
                                style={{ top: '1.25rem', right: '1.25rem' }}
                              >
                                <ArrowUpRight size={14} />
                              </a>
                            )}

                            {/* Inner Framed macOS Browser Window Mockup */}
                            <div className="project-compact-frame">
                              <div className="project-browser-header">
                                <div className="project-traffic-dots">
                                  <span
                                    className="project-traffic-dot"
                                    style={{ background: '#ff5f56' }}
                                  />
                                  <span
                                    className="project-traffic-dot"
                                    style={{ background: '#ffbd2e' }}
                                  />
                                  <span
                                    className="project-traffic-dot"
                                    style={{ background: '#27c93f' }}
                                  />
                                </div>

                                <div className="project-address-pill">
                                  {displayUrl}
                                </div>
                              </div>

                              <div className="project-compact-viewport">
                                {proj.image ? (
                                  <a
                                    href={primaryLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ display: 'block', width: '100%', height: '100%' }}
                                  >
                                    <img
                                      src={getAssetUrl(proj.image)}
                                      alt={`${proj.title} preview`}
                                      className="project-compact-img"
                                      loading="lazy"
                                    />
                                  </a>
                                ) : (
                                  <div
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: 'var(--bg-elevated)',
                                      color: 'var(--text-muted)',
                                      fontSize: '0.82rem',
                                    }}
                                  >
                                    Preview Unavailable
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Card Body */}
                            <div
                              style={{
                                marginTop: '1.15rem',
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                              }}
                            >
                              {/* Meta Tag */}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.45rem',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: 'var(--accent)',
                                  letterSpacing: '0.08em',
                                  textTransform: 'uppercase',
                                  marginBottom: '0.4rem',
                                }}
                              >
                                <FolderGit2 size={13} style={{ color: 'var(--accent)' }} />
                                <span>{metaText}</span>
                              </div>

                              {/* Title */}
                              <h4
                                style={{
                                  fontSize: '1.25rem',
                                  fontWeight: 800,
                                  color: 'var(--text-primary)',
                                  margin: '0 0 0.55rem 0',
                                  lineHeight: 1.25,
                                }}
                              >
                                {proj.title}
                              </h4>

                              {/* Short Description */}
                              <p
                                style={{
                                  fontSize: '0.88rem',
                                  lineHeight: 1.6,
                                  color: 'var(--text-secondary)',
                                  marginBottom: '1rem',
                                  flex: 1,
                                }}
                              >
                                {proj.shortDescription}
                              </p>

                              {/* Tech Stack Pills */}
                              {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.35rem',
                                    marginBottom: '1.15rem',
                                  }}
                                >
                                  {proj.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="project-tech-pill"
                                      style={{ padding: '0.2rem 0.65rem', fontSize: '0.72rem' }}
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Card Action Footer */}
                              <div
                                style={{
                                  borderTop: '1px solid var(--border)',
                                  paddingTop: '0.9rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                {proj.githubUrl ? (
                                  <a
                                    href={proj.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`View ${proj.title} on GitHub`}
                                    title="View GitHub Repository"
                                    className="project-github-btn"
                                    style={{ width: 34, height: 34 }}
                                  >
                                    <SiGithub size={15} />
                                  </a>
                                ) : <div />}

                                {proj.liveDemoUrl && (
                                  <a
                                    href={proj.liveDemoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="project-action-btn project-action-btn-demo"
                                    style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}
                                  >
                                    <ExternalLink size={13} />
                                    <span>Live Project</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* View More / Show Less Toggle Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAll((prev) => !prev)}
                    className="project-view-more-btn"
                  >
                    <span>
                      {showAll
                        ? 'Show Less'
                        : `View More Projects (${extraItems.length})`}
                    </span>
                    {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
