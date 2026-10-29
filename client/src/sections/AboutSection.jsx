import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkillIcon, RSLogo } from '../components/ui/index';
import api from '../services/api';
import { getAssetUrl } from '../utils/assetUrl';
import { MapPin, GraduationCap, Languages } from 'lucide-react';

const HIGHLIGHTS = [
  {
    title: 'Full-Stack Development',
    desc: 'Building web applications end-to-end — from responsive frontends to RESTful backend APIs.',
  },
  {
    title: 'Auth & Security',
    desc: 'Implementing JWT authentication, authorization, input validation, and secure middleware patterns.',
  },
  {
    title: 'Database Integration',
    desc: 'Designing MongoDB schemas, writing Mongoose models, and working with SQL databases.',
  },
  {
    title: 'Problem Solving & DSA',
    desc: 'Practicing algorithmic thinking and optimized data structures to solve complex computational challenges.',
  },
];

export default function AboutSection() {
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

  const bioParagraphs = profile?.bio?.trim()
    ? profile.bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  const highlights =
    Array.isArray(profile?.aboutHighlights) && profile.aboutHighlights.length > 0 && profile.aboutHighlights.some((h) => h && h.title)
      ? profile.aboutHighlights.filter((h) => h && (h.title || h.desc))
      : HIGHLIGHTS;

  const facts = [
    { Icon: MapPin, label: 'Location', value: profile?.location || 'Bhubaneswar, India' },
    { Icon: GraduationCap, label: 'Education', value: 'B.Tech CS · 2027' },
    { Icon: Languages, label: 'Languages', value: profile?.languages || 'English, Hindi, Odia' },
  ];

  const reveal = (hidden, delay = 0) => ({
    initial: hidden,
    animate: inView ? { opacity: 1, x: 0, y: 0 } : hidden,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section id="about" className="section-padding">
      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 320px minmax(0, 1fr);
          gap: 1rem;
          align-items: stretch;
        }
        .about-card {
          background: linear-gradient(160deg, var(--bg-elevated) 0%, var(--bg-card) 60%);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }
        /* Profile column (no card surface) */
        .about-profile {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .about-avatar {
          width: 132px;
          height: 132px;
          padding: 4px;
          margin-bottom: 1.1rem;
          border-radius: 28px;
          background: linear-gradient(140deg, var(--accent), var(--accent-border) 60%, transparent);
          box-shadow: 0 0 40px -6px var(--accent-glow);
        }
        .about-avatar img,
        .about-avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: 24px;
          object-fit: cover;
          background: var(--bg-card);
        }
        .about-avatar-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .about-name {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }
        .about-headline {
          margin: 0.3rem 0 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent);
        }
        .about-status {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin-top: 0.9rem;
          padding: 0.3rem 0.8rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          border-radius: 9999px;
        }
        .about-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse-glow 2s ease infinite;
        }
        .about-facts {
          width: 100%;
          margin: 1.4rem 0 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid var(--border);
        }
        .about-facts li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }
        .about-fact-icon {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: var(--accent);
          background: var(--accent-dim);
        }
        .about-fact-label {
          display: block;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .about-fact-value {
          display: block;
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .about-main {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 0;
        }
        .about-bio {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 0.5rem;
        }
        .about-bio p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.85;
          color: var(--text-secondary);
          white-space: pre-line;
        }
        /* Highlights */
        .about-highlights {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .about-highlight {
          position: relative;
          height: 100%;
          padding: 1.15rem 1.2rem;
          transition: border-color var(--transition-card), box-shadow var(--transition-card);
        }
        .about-highlight:hover {
          border-color: var(--accent-border);
          box-shadow: 0 16px 34px -14px var(--accent-glow), var(--shadow-md);
        }
        .about-highlight-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .about-highlight-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }
        .about-highlight-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: var(--bg-hover);
          border: 1px solid var(--border);
        }
        .about-highlight-num {
          flex-shrink: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .about-highlight h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.3;
          color: var(--text-primary);
        }
        .about-highlight p {
          margin: 0;
          font-size: 0.84rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (max-width: 600px) {
          .about-highlights {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>

      <div className="container">
        <SectionHeading
          index="01"
          eyebrow="About"
          title="Building from idea to deployment"
          subtitle="A student developer passionate about the full stack"
        />

        {loading ? (
          <div style={{ height: 320, background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }} />
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
            <RSLogo size={42} color="var(--accent)" glow />
            <h4 style={{ margin: '0.85rem 0 0.4rem', color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700 }}>
              Profile Data Unavailable
            </h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', lineHeight: 1.55 }}>
              Database is currently not connected. Profile information will appear once connection is established.
            </p>
          </div>
        ) : (
          <div ref={ref} className="about-grid">
          {/* Profile card */}
          <motion.aside className="about-profile" {...reveal({ opacity: 0, x: -24 })}>
            <div className="about-avatar">
              {profile?.avatarUrl ? (
                <img
                  src={getAssetUrl(profile.avatarUrl)}
                  alt={profile.name || 'Ranjit Sharma'}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="about-avatar-fallback" aria-label="Ranjit Sharma monogram logo">
                  <RSLogo size={64} color="var(--accent)" glow />
                </div>
              )}
            </div>

            <h3 className="about-name">{profile?.name || 'Ranjit Sharma'}</h3>
            <p className="about-headline">
              {profile?.headline || 'B.Tech in Computer Science · Trident Academy of Technology, Bhubaneswar'}
            </p>
            <span
              className="about-status"
              style={
                (profile?.available ?? true)
                  ? undefined
                  : {
                      color: 'var(--text-muted)',
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--border)',
                    }
              }
            >
              <span
                className="about-status-dot"
                style={
                  (profile?.available ?? true)
                    ? undefined
                    : { background: 'var(--text-muted)', animation: 'none' }
                }
              />
              {profile?.availabilityNote?.trim() ||
                ((profile?.available ?? true)
                  ? 'Open to opportunities'
                  : 'Not currently open to opportunities')}
            </span>

            <ul className="about-facts">
              {facts.map(({ Icon, label, value }) => (
                <li key={label}>
                  <span className="about-fact-icon" aria-hidden="true">
                    <Icon size={15} />
                  </span>
                  <span>
                    <span className="about-fact-label">{label}</span>
                    <span className="about-fact-value">{value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.aside>

          <div className="about-main">
            {bioParagraphs.length > 0 && (
              <motion.div className="about-bio" {...reveal({ opacity: 0, y: 20 }, 0.1)}>
                {bioParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </motion.div>
            )}

            <ul className="about-highlights">
              {highlights.map((item, i) => (
                <motion.li key={item.title || i} {...reveal({ opacity: 0, y: 20 }, 0.2 + i * 0.08)}>
                  <article className="about-card about-highlight card-spotlight">
                    <div className="about-highlight-top">
                      <div className="about-highlight-header">
                        <span className="about-highlight-icon" aria-hidden="true">
                          <SkillIcon name={item.title} size={19} />
                        </span>
                        <h4>{item.title}</h4>
                      </div>
                      <span className="about-highlight-num">0{i + 1}</span>
                    </div>
                    <p>{item.desc}</p>
                  </article>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
