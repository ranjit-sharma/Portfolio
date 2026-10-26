import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Folder, FolderGit2, ExternalLink } from 'lucide-react';
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

function TiltBrowserMockup({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth physical spring physics for swing tilt motion on cursor move
  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 25, mass: 0.5 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 25, mass: 0.5 });

  // 3D swing tilt angles
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8.5deg', '-8.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8.5deg', '8.5deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="project-stack-visual"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="project-browser-frame"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </div>
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
        /* Stacking cards container */
        .projects-stack-container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          padding-bottom: 0;
        }

        /* Each folder-styled card sticks on scroll */
        .project-folder-card {
          position: sticky;
          top: calc(85px + var(--stack-offset, 0px));
          z-index: var(--stack-z, 1);
          display: flex;
          flex-direction: column;
          margin-bottom: min(10vh, 60px);
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .project-folder-card:last-child {
          margin-bottom: 0;
        }

        /* Protruding Folder Tab */
        .folder-tab-hanger {
          display: flex;
          align-items: flex-end;
          position: relative;
          z-index: 3;
          margin-bottom: -1px;
        }

        .folder-tab {
          width: 220px;
          min-width: 220px;
          max-width: 220px;
          height: 36px;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.6rem;
          padding: 0 1rem;
          background: var(--bg-card);
          border-top: 1px solid var(--border);
          border-left: 1px solid var(--border);
          border-right: none;
          border-bottom: none;
          border-top-left-radius: 14px;
          border-top-right-radius: 0;
          font-family: monospace;
          font-size: 0.77rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-left: 0;
          transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .project-folder-card:hover .folder-tab {
          border-color: var(--accent-border);
        }

        .folder-tab-slant {
          width: 34px;
          min-width: 34px;
          height: 36px;
          position: relative;
          margin-left: -1px;
          display: flex;
          align-items: flex-start;
          flex-shrink: 0;
        }

        .folder-slant-stroke {
          transition: stroke 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-folder-card:hover .folder-slant-stroke {
          stroke: var(--accent-border);
        }

        .folder-tab-num {
          color: var(--accent);
          font-weight: 800;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        .folder-tab-slug {
          flex: 1;
          min-width: 0;
          color: var(--text-secondary);
          font-size: 0.75rem;
          letter-spacing: 0.03em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .folder-tab-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
          margin-left: 0.25rem;
          flex-shrink: 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .project-folder-card:hover .folder-tab-dot {
          transform: scale(1.2);
          box-shadow: 0 0 9px var(--accent);
        }

        /* Main Folder Body */
        .folder-body {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-top-left-radius: 0;
          border-top-right-radius: 16px;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          padding: 2.25rem 2.5rem;
          box-shadow: var(--shadow-md);
          transition: border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          position: relative;
          z-index: 2;
        }

        .project-folder-card:hover .folder-body {
          border-color: var(--accent-border);
          box-shadow: 0 10px 28px -6px var(--accent-glow);
        }

        /* Top Dossier Bar inside Folder */
        .folder-dossier-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px dashed var(--border);
          padding-bottom: 0.95rem;
          margin-bottom: 1.75rem;
          font-size: 0.75rem;
        }

        .folder-dossier-category {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .folder-dossier-file-tag {
          font-family: monospace;
          color: var(--text-muted);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        /* Inner 2-column Grid */
        .project-stack-inner {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 2.75rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .project-stack-content {
          display: flex;
          flex-direction: column;
        }

        .project-stack-title {
          font-size: clamp(1.6rem, 2.4vw, 2.25rem);
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 0.85rem;
        }

        .project-stack-desc {
          font-size: 0.93rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Stats Grid - Recessed Dark Telemetry Console */
        .project-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0;
          margin-bottom: 1.35rem;
          padding: 0.85rem 0.5rem;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0%, rgba(0, 0, 0, 0.3) 100%), var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 8px rgba(0, 0, 0, 0.25);
        }

        .project-stat-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0.15rem 1rem;
          border-right: 1px solid var(--border);
        }

        .project-stat-item:last-child {
          border-right: none;
        }

        .project-stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .project-stat-label {
          font-size: 0.67rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.25rem;
        }

        /* Tech Stack Pills - Sleek Dark Glass Badges */
        .project-tech-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-bottom: 1.35rem;
          max-height: 74px;
          overflow: hidden;
        }

        .project-tech-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius-pill);
          padding: 0.26rem 0.78rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }

        .project-tech-pill:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-dim);
          box-shadow: 0 2px 12px var(--accent-glow);
        }

        .project-stack-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .project-github-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
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
          padding: 0.58rem 1.35rem;
          border-radius: var(--radius-pill);
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
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

        /* Visual Column */
        .project-stack-visual {
          position: relative;
          width: 100%;
        }

        .project-browser-frame {
          position: relative;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: #090d14;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          will-change: transform;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .project-stack-visual:hover .project-browser-frame {
          border-color: var(--accent-border);
          box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.6), 0 0 20px var(--accent-glow);
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
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .project-mockup-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        @media (max-width: 960px) {
          .folder-tab {
            margin-left: 1rem;
            width: min(220px, calc(100% - 2rem));
            min-width: unset;
          }

          .folder-body {
            padding: 1.35rem;
            border-radius: 16px;
          }

          .project-stack-inner {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }

          .project-folder-card {
            top: calc(75px + var(--stack-offset-mob, 0px));
            margin-bottom: 2rem;
          }

          .project-folder-card:last-child {
            margin-bottom: 0;
          }

          .project-stack-visual {
            order: 1;
          }

          .project-stack-content {
            order: 2;
          }

          .project-stats-grid {
            gap: 0.85rem;
          }
        }

        @media (max-width: 580px) {
          .folder-tab {
            width: min(200px, 58vw);
            min-width: min(200px, 58vw);
            max-width: min(200px, 58vw);
            padding: 0 0.75rem;
          }
          .project-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
            padding: 0.85rem 1rem;
          }
          .project-stat-item {
            border-right: none;
            padding: 0;
          }
          .folder-body {
            padding: 1.15rem;
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
              <SkeletonCard key={i} height={320} />
            ))}
          </div>
        ) : (
          <div ref={ref} className="projects-stack-container">
            <AnimatePresence>
              {items.map((proj, i) => {
                const metaText = getProjectMeta(proj);
                const stats = getProjectStats(proj);
                const displayUrl = getDisplayUrl(proj.liveDemoUrl, proj.slug);
                const primaryLink = proj.liveDemoUrl || proj.githubUrl || '#';
                const slugText = proj.slug || proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                return (
                  <article
                    key={proj._id || proj.slug || i}
                    className="project-folder-card"
                    style={{
                      '--stack-offset': `${i * 24}px`,
                      '--stack-offset-mob': `${i * 20}px`,
                      '--stack-z': i + 1,
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                    >
                      {/* Protruding Folder Tab */}
                      <div className="folder-tab-hanger">
                        <div className="folder-tab">
                          <Folder size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                          <span className="folder-tab-num">0{i + 1}</span>
                          <span className="folder-tab-slug">{slugText}</span>
                          <span className="folder-tab-dot" />
                        </div>
                        <div className="folder-tab-slant" aria-hidden="true">
                          <svg
                            viewBox="0 0 34 36"
                            width="34"
                            height="36"
                            preserveAspectRatio="none"
                            style={{ display: 'block', overflow: 'visible' }}
                          >
                            <path
                              d="M 0,0 C 14,0 20,36 34,36 L 34,37 L 0,37 Z"
                              fill="var(--bg-card)"
                            />
                            <path
                              d="M -0.5,0.5 C 14,0.5 20,35.5 34.5,35.5"
                              fill="none"
                              stroke="var(--border)"
                              strokeWidth="1"
                              strokeLinecap="round"
                              className="folder-slant-stroke"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Main Folder Card Body */}
                      <div className="folder-body">
                        {/* Ambient glow overlay */}
                        <div
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            background:
                              'radial-gradient(circle at 10% 12%, var(--accent-dim) 0%, transparent 60%)',
                            zIndex: 0,
                          }}
                        />

                        {/* Top Dossier Header Bar */}
                        <div className="folder-dossier-bar" style={{ position: 'relative', zIndex: 1 }}>
                          <div className="folder-dossier-category">
                            <FolderGit2 size={13} style={{ color: 'var(--accent)' }} />
                            <span>{metaText}</span>
                          </div>
                          <div className="folder-dossier-file-tag">
                            <span>DEPLOYED</span>
                            <span>•</span>
                            <span>{displayUrl}</span>
                          </div>
                        </div>

                        <div className="project-stack-inner">
                          {/* Left Column: Project Content */}
                          <div className="project-stack-content">
                            {/* Title */}
                            <h3 className="project-stack-title">{proj.title}</h3>

                            {/* Description */}
                            <p className="project-stack-desc">
                              {proj.shortDescription || proj.fullDescription}
                            </p>

                            {/* 3 Stats Grid */}
                            {stats.length > 0 && (
                              <div className="project-stats-grid">
                                {stats.map((s, idx) => (
                                  <div key={idx} className="project-stat-item">
                                    <div className="project-stat-value">{s.value}</div>
                                    <div className="project-stat-label">{s.label}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Tech Stack Pills */}
                            {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                              <div className="project-tech-pills">
                                {proj.technologies.map((tech) => (
                                  <span key={tech} className="project-tech-pill">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="project-stack-actions">
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

                          {/* Right Column: Visual Browser Mockup with 3D Cursor Swing */}
                          <TiltBrowserMockup>
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
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                    decoding="async"
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
                          </TiltBrowserMockup>
                        </div>
                      </div>
                    </motion.div>
                  </article>
                );
              })}
            </AnimatePresence>

            {/* Compact runway so the last folder locks smoothly into stack and immediately releases into next section */}
            {items.length > 1 && (
              <div
                aria-hidden="true"
                style={{
                  height: 'min(8vh, 60px)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
