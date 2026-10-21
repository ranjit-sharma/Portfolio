import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkillIcon, RSLogo } from '../components/ui/index';
import api from '../services/api';

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
    title: 'Debugging & Clean Code',
    desc: 'Writing readable, maintainable code and systematically diagnosing issues at every layer.',
  },
  {
    title: 'Problem Solving & DSA',
    desc: 'Practicing algorithmic thinking and optimized data structures to solve complex computational challenges.',
  },
  {
    title: 'API & Performance',
    desc: 'Engineering high-throughput REST APIs, payload optimization, and seamless client-server state synchronization.',
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
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
              }}
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
                    src={profile.avatarUrl}
                    alt={profile.name || 'Ranjit Sharma'}
                    onError={(e) => {
                      if (!e.currentTarget.src.includes(':5000')) {
                        e.currentTarget.src = `http://localhost:5000${profile.avatarUrl}`;
                      }
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
                    B.Tech in Computer Science · Trident Academy of Technology, Bhubaneswar
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  'Holding a B.Tech in Computer Science, I specialize in building full-stack web applications — from designing user interfaces to architecting backend systems and integrating databases.',
                  'My core interest lies in the MERN stack. I have worked on projects involving REST APIs, JWT authentication, MongoDB schema design, and server-side rendering with EJS.',
                  'I approach engineering problems methodically: understand the requirement, plan the solution, write clean and testable code, and iterate based on feedback.',
                  'Outside coursework, I pursue certifications and contribute to open-source tools to stay current with the technologies that matter most.',
                ].map((para, i) => (
                  <p
                    key={i}
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      lineHeight: 1.75,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Quick facts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  marginTop: '1.5rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border)',
                }}
              >
                {[
                  { label: 'Degree', value: 'B.Tech in Computer Science' },
                  { label: 'Institution', value: 'Trident Academy of Technology' },
                  { label: 'Location', value: profile?.location || 'Bhubaneswar, Odisha' },
                  { label: 'Email', value: profile?.email || 'ranjitsharma76088@gmail.com' },
                ].map((fact) => (
                  <div key={fact.label}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        marginBottom: '0.2rem',
                      }}
                    >
                      {fact.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                        wordBreak: 'break-word',
                      }}
                    >
                      {fact.value}
                    </div>
                  </div>
                ))}
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
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                  e.currentTarget.style.boxShadow = '0 4px 20px var(--accent-glow)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
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
                    background: 'var(--bg-surface)',
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
