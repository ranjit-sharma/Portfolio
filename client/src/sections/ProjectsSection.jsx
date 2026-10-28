import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Folder, FolderGit2, ExternalLink, ChevronLeft, ChevronRight, RotateCw, Lock } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkeletonCard, SkillIcon } from '../components/ui/index';
import api from '../services/api';
import { getAssetUrl } from '../utils/assetUrl';

function getDisplayUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
}

function getProjectStats(proj) {
  if (Array.isArray(proj.stats) && proj.stats.length > 0 && proj.stats.some((s) => s && s.value)) {
    return proj.stats.filter((s) => s && (s.value || s.label)).slice(0, 3);
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
        const data = res.data?.data;
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const items = Array.isArray(projects) ? projects : [];

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
          border-top-right-radius: 1rem;
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
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
          gap: 0.75rem;
        }

        .folder-dossier-category {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .folder-dossier-file-tag {
          font-family: monospace;
          color: var(--text-muted);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
          position: relative;
          font-size: clamp(1.4rem, 2.4vw, 2.25rem);
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 1.1rem;
          padding-bottom: 0.75rem;
        }

        /* Short accent bar under the title */
        .project-stack-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 56px;
          height: 3px;
          border-radius: 3px;
          background: linear-gradient(90deg, var(--accent) 55%, var(--accent-border));
        }

        .project-stack-desc {
          font-size: 0.93rem;
          line-height: 1.75;
          color: var(--text-secondary);
          margin-bottom: 1.35rem;
        }

        /* Stats - three separate mini cards */
        .project-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.6rem;
          margin-bottom: 1.35rem;
        }

        .project-stat-item {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0.8rem 0.9rem 0.75rem;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color var(--transition-fast), transform var(--transition-fast);
        }

        .project-stat-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0.9rem;
          right: 0.9rem;
          height: 2px;
          border-radius: 0 0 2px 2px;
          background: var(--accent);
          opacity: 0.7;
        }

        .project-stat-item:hover {
          border-color: var(--accent-border);
          transform: translateY(-2px);
        }

        .project-stat-value {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: -0.01em;
          line-height: 1.2;
          overflow-wrap: anywhere;
        }

        .project-stat-label {
          font-size: 0.64rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.3rem;
        }

        /* Tech stack - labelled chips with logos */
        .project-tech-label {
          margin-bottom: 0.55rem;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .project-tech-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin: 0 0 1.35rem;
          padding: 0;
          list-style: none;
        }

        .project-tech-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.32rem 0.65rem;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-primary);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 8px;
          transition: border-color var(--transition-fast), background var(--transition-fast), transform var(--transition-fast);
        }

        .project-tech-pill:hover {
          border-color: var(--accent-border);
          background: var(--accent-dim);
          transform: translateY(-1px);
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
          padding: 1px;
          border-radius: 16px;
          /* 1px gradient border: accent at the top-left fading into the normal border */
          background: linear-gradient(135deg, var(--accent-border), var(--border) 45%, var(--border));
          box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.75), var(--shadow-md);
          will-change: transform;
          transition: box-shadow 0.3s ease;
        }

        /* Soft accent glow behind the window */
        .project-browser-frame::before {
          content: '';
          position: absolute;
          inset: 12% 8% -6%;
          z-index: -1;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.12;
          filter: blur(48px);
          transition: opacity 0.3s ease;
        }

        .project-stack-visual:hover .project-browser-frame {
          box-shadow: 0 28px 60px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px var(--accent-border);
        }

        .project-stack-visual:hover .project-browser-frame::before {
          opacity: 0.22;
        }

        .project-browser-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          height: 38px;
          padding: 0 0.85rem;
          background: var(--bg-elevated);
          border-bottom: 1px solid var(--border);
          border-radius: 15px 15px 0 0;
        }

        .project-traffic-dots {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .project-traffic-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.25);
        }

        .project-browser-nav {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
          color: var(--text-muted);
        }

        .project-address-pill {
          flex: 1;
          min-width: 0;
          max-width: 360px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          height: 24px;
          padding: 0 0.85rem;
          border-radius: 8px;
          background: var(--bg-base);
          border: 1px solid var(--border);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .project-address-pill svg {
          flex-shrink: 0;
          color: var(--accent);
        }

        .project-address-text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .project-browser-viewport {
          position: relative;
          width: 100%;
          aspect-ratio: 1888 / 924;
          overflow: hidden;
          background: #090d14;
          border-radius: 0 0 15px 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Glass sheen across the top of the screenshot */
        .project-browser-viewport::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 28%);
        }

        .project-mockup-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-stack-visual:hover .project-mockup-img {
          transform: scale(1.04);
        }

        @media (max-width: 580px) {
          .project-browser-nav {
            display: none;
          }
        }

        @media (max-width: 960px) {
          .project-stack-inner {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .project-stack-visual {
            order: 1;
          }

          .project-stack-content {
            order: 2;
          }
        }

        /* Mobile Viewport Refinements (< 768px) */
        @media (max-width: 768px) {
          /* Stack View for Mobile: Cards stick cleanly as you scroll down */
          .project-folder-card {
            position: sticky !important;
            top: calc(75px + var(--stack-offset-mob, 0px)) !important;
            margin-bottom: min(10vh, 50px) !important;
            will-change: transform;
          }

          .project-folder-card:last-child {
            margin-bottom: 0 !important;
          }

          /* Remove stats boxes, short description text, tech stack pills, and 3 traffic dots from mobile view; preserved on desktop */
          .project-stats-grid,
          .project-stack-desc,
          .project-tech-wrapper,
          .project-tech-label,
          .project-tech-pills,
          .project-traffic-dots {
            display: none !important;
          }

          /* Folder tab alignment: flush with left border of folder body */
          .folder-tab {
            margin-left: 0 !important;
            width: min(200px, 58vw);
            min-width: min(200px, 58vw);
            max-width: min(200px, 58vw);
            height: 36px;
            padding: 0 0.85rem;
            font-size: 0.74rem;
          }

          .folder-tab-slant {
            width: 34px;
            min-width: 34px;
            height: 36px;
            margin-left: -1px;
          }

          .folder-body {
            padding: 1.25rem 1rem;
            border-top-left-radius: 0;
            border-top-right-radius: 14px;
            border-bottom-left-radius: 14px;
            border-bottom-right-radius: 14px;
          }

          .folder-dossier-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 0.45rem;
            padding-bottom: 0.75rem;
            margin-bottom: 1rem;
            border-bottom: 1px dashed var(--border);
          }

          .folder-dossier-category {
            font-size: 0.72rem;
            gap: 0.4rem;
            word-break: break-word;
          }

          .folder-dossier-file-tag {
            font-size: 0.7rem;
            max-width: 100%;
          }

          .project-stack-inner {
            gap: 1.15rem;
          }

          .project-stack-title {
            font-size: 1.35rem;
            line-height: 1.25;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
          }

          .project-stack-actions {
            display: flex;
            width: 100%;
            gap: 0.65rem;
            margin-top: 0.15rem;
          }

          .project-action-btn {
            flex: 1;
            justify-content: center;
            padding: 0.65rem 0.85rem;
            font-size: 0.82rem;
          }

          .project-github-btn {
            width: 42px;
            height: 42px;
            flex-shrink: 0;
          }
        }
            justify-content: center;
            padding: 0.65rem 0.85rem;
            font-size: 0.82rem;
          }

          .project-github-btn {
            width: 42px;
            height: 42px;
            flex-shrink: 0;
          }
        }
      `}</style>

      <div className="container">
        <SectionHeading
          index="05"
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
        ) : items.length === 0 ? (
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
            <FolderGit2 size={40} style={{ color: 'var(--accent)', opacity: 0.85, marginBottom: '0.85rem' }} />
            <h4 style={{ margin: '0 0 0.4rem', color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700 }}>
              No Projects Available
            </h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', lineHeight: 1.55 }}>
              Database connection unavailable or no projects published yet. Please ensure the backend is connected to the database.
            </p>
          </div>
        ) : (
          <div ref={ref} className="projects-stack-container">
            <AnimatePresence>
              {items.map((proj, i) => {
                const metaText = getProjectMeta(proj);
                const stats = getProjectStats(proj);
                const displayUrl = getDisplayUrl(proj.liveDemoUrl, proj.slug);
                const slugText = proj.slug || proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                return (
                  <article
                    key={proj._id || proj.slug || i}
                    className="project-folder-card"
                    style={{
                      '--stack-offset': `${i * 24}px`,
                      '--stack-offset-mob': `${i * 16}px`,
                      '--stack-z': i + 1,
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
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
                      <div className="folder-body card-spotlight">
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
                              <div className="project-tech-wrapper">
                                <div className="project-tech-label">Tech stack</div>
                                <ul className="project-tech-pills">
                                  {proj.technologies.map((tech) => (
                                    <li key={tech} className="project-tech-pill">
                                      <SkillIcon name={tech} size={14} />
                                      {tech}
                                    </li>
                                  ))}
                                </ul>
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
                                  <span>View Live Site</span>
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

                              <div className="project-browser-nav" aria-hidden="true">
                                <ChevronLeft size={15} />
                                <ChevronRight size={15} />
                                <RotateCw size={13} />
                              </div>

                              <div className="project-address-pill">
                                <Lock size={11} aria-hidden="true" />
                                <span className="project-address-text">{displayUrl}</span>
                              </div>
                            </div>

                            <div className="project-browser-viewport">
                              {proj.image ? (
                                <img
                                  src={getAssetUrl(proj.image)}
                                  alt={`${proj.title} preview`}
                                  className="project-mockup-img"
                                  loading={i === 0 ? 'eager' : 'lazy'}
                                  decoding="async"
                                />
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
