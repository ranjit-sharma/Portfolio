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

  useEffect(() => {
    api
      .get('/profile')
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  const bioParagraphs = profile?.bio?.trim()
    ? profile.bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <section id="about" className="section-padding">
      <div className="container">
        <SectionHeading
          eyebrow="About"
          title="Building from idea to deployment"
          subtitle="A student developer passionate about the full stack"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Bio text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            {/* Header: Avatar on left, Name & Degree on right */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Avatar */}
              {profile?.avatarUrl ? (
                <img
                  src={getAssetUrl(profile.avatarUrl)}
                  alt={profile.name || 'Ranjit Sharma'}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 'var(--radius-xl, 20px)',
                    objectFit: 'cover',
                    border: '2px solid var(--accent)',
                    boxShadow: '0 0 24px var(--accent-glow), 0 4px 12px rgba(0,0,0,0.2)',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 'var(--radius-xl, 20px)',
                    background: 'var(--accent-dim)',
                    border: '2px solid var(--accent)',
                    boxShadow: '0 0 24px var(--accent-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                  aria-label="Ranjit Sharma monogram logo"
                >
                  <RSLogo size={56} color="var(--accent)" glow />
                </div>
              )}

              {/* Right of Avatar: Name & Education */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, minWidth: '220px' }}>
                <h3
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {profile?.name || 'Ranjit Sharma'}
                </h3>
                <p
                  style={{
                    color: 'var(--accent)',
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {profile?.headline || 'B.Tech in Computer Science · Trident Academy of Technology, Bhubaneswar'}
                </p>
              </div>
            </div>

            {bioParagraphs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {bioParagraphs.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      lineHeight: 1.75,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Quick badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.65rem',
                marginTop: bioParagraphs.length > 0 ? '1.5rem' : '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-pill, 9999px)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                }}
              >
                <MapPin size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{profile?.location || 'Bhubaneswar, India'}</span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-pill, 9999px)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                }}
              >
                <GraduationCap size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>B.Tech CS · 2027</span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-pill, 9999px)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                }}
              >
                <Languages size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{profile?.languages || 'English, Hindi, Odia'}</span>
              </div>
            </div>
          </motion.div>

          {/* Highlights grid */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{
                  background: 'radial-gradient(circle at 10% 10%, var(--accent-dim) 0%, transparent 45%), var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color var(--transition-card, 400ms cubic-bezier(0.16, 1, 0.3, 1)), box-shadow var(--transition-card, 400ms cubic-bezier(0.16, 1, 0.3, 1))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                  e.currentTarget.style.boxShadow = '0 10px 28px -6px var(--accent-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '0.15rem',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <SkillIcon name={item.title} size={20} />
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      marginBottom: '0.3rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
