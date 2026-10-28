import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TbLayout,
  TbServer,
  TbDatabase,
  TbCode,
  TbBinaryTree,
  TbTools,
  TbCloud,
  TbBrain,
  TbDeviceMobile,
  TbShieldLock,
  TbCpu,
  TbTerminal2,
} from 'react-icons/tb';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkeletonCard, SkillIcon } from '../components/ui/index';
import api from '../services/api';

// Modern developer icon pack for categories with dynamic fallback for custom categories
const CATEGORY_ICONS = {
  Frontend: TbLayout,
  Backend: TbServer,
  Database: TbDatabase,
  Language: TbCode,
  'CS Fundamentals': TbBinaryTree,
  Tools: TbTools,
};

function getCategoryIcon(catName) {
  if (CATEGORY_ICONS[catName]) return CATEGORY_ICONS[catName];
  const c = (catName || '').toLowerCase();
  if (c.includes('cloud') || c.includes('aws') || c.includes('azure') || c.includes('devops')) return TbCloud;
  if (c.includes('ai') || c.includes('ml') || c.includes('machine') || c.includes('data science') || c.includes('deep')) return TbBrain;
  if (c.includes('mob') || c.includes('app') || c.includes('android') || c.includes('ios') || c.includes('flutter')) return TbDeviceMobile;
  if (c.includes('sec') || c.includes('cyber') || c.includes('auth')) return TbShieldLock;
  if (c.includes('sys') || c.includes('os') || c.includes('hardware') || c.includes('iot')) return TbCpu;
  if (c.includes('test') || c.includes('qa') || c.includes('script')) return TbTerminal2;
  return TbCode;
}

// Each scrolling strip needs enough chips to be wider than its row before it can loop
const MIN_CHIPS_PER_COPY = 8;

function SkillChip({ skill }) {
  return (
    <span className="skr-chip">
      <SkillIcon name={skill} size={17} />
      {skill}
    </span>
  );
}

export default function SkillsSection() {
  const { ref, inView } = useInView();
  const [skillsMap, setSkillsMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/skills')
      .then((res) => {
        const raw = res.data?.data;
        if (!raw || raw.length === 0) {
          setSkillsMap({});
          return;
        }
        const grouped = {};
        raw.forEach((s) => {
          if (!grouped[s.category]) grouped[s.category] = [];
          grouped[s.category].push(s.name);
        });
        setSkillsMap(grouped);
      })
      .catch(() => setSkillsMap({}))
      .finally(() => setLoading(false));
  }, []);

  const entries = Object.entries(skillsMap || {});

  return (
    <section id="skills" className="section-padding">
      <style>{`
        .skr-rows {
          display: flex;
          flex-direction: column;
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid var(--border);
        }
        .skr-row {
          display: grid;
          grid-template-columns: 230px minmax(0, 1fr);
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
        }
        .skr-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .skr-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
        }
        .skr-name {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .skr-count {
          display: block;
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        /* Sliding strip: two identical copies move by half the track width, so it loops seamlessly */
        .skr-strip {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .skr-track {
          display: flex;
          width: max-content;
          animation: skrScroll var(--skr-duration, 30s) linear infinite;
        }
        .skr-row-reverse .skr-track {
          animation-direction: reverse;
        }
        .skr-strip:hover .skr-track {
          animation-play-state: paused;
        }
        .skr-copy {
          display: flex;
          gap: 0.6rem;
          padding-right: 0.6rem;
        }
        .skr-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.95rem;
          font-size: 0.86rem;
          font-weight: 600;
          white-space: nowrap;
          color: var(--text-primary);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 9999px;
          transition: border-color var(--transition-fast), color var(--transition-fast);
        }
        .skr-chip:hover {
          border-color: var(--accent-border);
          color: var(--accent);
        }
        @keyframes skrScroll {
          to { transform: translateX(-50%); }
        }
        /* Reduced motion: no sliding, the chips simply wrap */
        .skr-static .skr-track {
          width: auto;
          animation: none;
        }
        .skr-static .skr-copy {
          flex-wrap: wrap;
        }
        .skr-static .skr-strip {
          -webkit-mask-image: none;
          mask-image: none;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        @media (max-width: 720px) {
          .skr-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 0.75rem;
          }
        }
      `}</style>

      <div className="container">
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <SectionHeading
            index="03"
            eyebrow="Skills"
            title="Technical Toolkit"
            subtitle="Technologies and tools I work with regularly"
          />

          {loading ? (
            <SkeletonCard height={420} />
          ) : entries.length === 0 ? (
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
              <TbTools size={38} style={{ color: 'var(--accent)', opacity: 0.85, marginBottom: '0.85rem' }} />
              <h4 style={{ margin: '0 0 0.4rem', color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700 }}>
                No Skills Available
              </h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', lineHeight: 1.55 }}>
                Skills from database are currently unavailable. Ensure the database connection is active.
              </p>
            </div>
          ) : (
            <ul ref={ref} className="skr-rows">
              {entries.map(([category, skills], ci) => {
                const CatIcon = getCategoryIcon(category);
                // Repeat short lists so one copy is wide enough to fill the row
                const copy = Array.from(
                  { length: Math.ceil(MIN_CHIPS_PER_COPY / skills.length) },
                  () => skills
                ).flat();
                return (
                  <motion.li
                    key={category}
                    className={`skr-row${ci % 2 ? ' skr-row-reverse' : ''}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.45, delay: ci * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="skr-label">
                      <span className="skr-icon" aria-hidden="true">
                        <CatIcon size={20} strokeWidth={2.1} />
                      </span>
                      <div>
                        <h3 className="skr-name">{category}</h3>
                        <span className="skr-count">
                          {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
                        </span>
                      </div>
                    </div>

                    {/* Screen readers get the plain list; the moving strip is decorative */}
                    <ul className="sr-only">
                      {skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                    <div className="skr-strip" aria-hidden="true">
                      <div
                        className="skr-track"
                        style={{
                          '--skr-duration': `${copy.length * 3.5}s`,
                          animationDuration: `${copy.length * 3.5}s`,
                        }}
                      >
                        {[copy, copy].map((list, k) => (
                          <div key={k} className="skr-copy">
                            {list.map((skill, j) => (
                              <SkillChip key={`${skill}-${j}`} skill={skill} />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
