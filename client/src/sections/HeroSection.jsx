import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, MapPin } from 'lucide-react';
import api from '../services/api';
import useViews from '../hooks/useViews';
import { getAssetUrl } from '../utils/assetUrl';

const ROLES = [
  'Full-Stack Developer',
  'MERN Stack Engineer',
  'Backend Developer',
  'React Developer',
];

function TypingEffect({ words }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    let timeout;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setIdx((i) => (i + 1) % words.length);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, words]);

  return (
    <span style={{ color: 'var(--accent)' }}>
      {displayed}
      <span className="animate-blink" style={{ borderRight: '2px solid var(--accent)', marginLeft: '2px' }} />
    </span>
  );
}

export default function HeroSection() {
  const [profile, setProfile] = useState(null);
  const { views } = useViews();

  useEffect(() => {
    api
      .get('/profile')
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: 'calc(100vh - var(--navbar-height))',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '5rem 0 4.5rem 0',
      }}
    >
      <style>{`
        @media (max-width: 968px) {
          .hero-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>

      {/* Giant background outline text for breadth and depth */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '3%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(5rem, 15vw, 13.5rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          color: 'transparent',
          WebkitTextStroke: '1px var(--border)',
          opacity: 0.28,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        SOFTWARE ENGINEER
      </div>

      {/* Subtle background glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: 700,
          height: 700,
          background: 'radial-gradient(circle at 60% 40%, var(--accent-glow) 0%, transparent 68%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div
          className="hero-grid-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.95fr',
            gap: '3.75rem',
            alignItems: 'center',
          }}
        >
          {/* Left — Content */}
          <div>
            {/* Availability & Views badges */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.35rem 0.95rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    animation: 'pulse-glow 2s ease infinite',
                  }}
                />
                Open to internships &amp; full-time roles
              </span>

              {views != null && (
                <span
                  id="hero-views-counter"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{views.toLocaleString()}</span> views
                </span>
              )}
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ marginBottom: '0.75rem' }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Hi, I'm
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.6rem, 5.8vw, 4.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: '-0.025em',
                  margin: 0,
                  color: 'var(--accent)',
                }}
              >
                Ranjit Sharma
              </h1>
            </motion.div>

            {/* Subtitle / Roles with typing effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                fontSize: 'clamp(1.15rem, 2.6vw, 1.6rem)',
                fontWeight: 700,
                marginBottom: '1.25rem',
                minHeight: '2em',
                color: 'var(--text-primary)',
              }}
            >
              <TypingEffect words={ROLES} />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                maxWidth: '56ch',
                marginBottom: '2.25rem',
              }}
            >
              I build backends, full-stack web applications, and interactive user interfaces — focused on clean architecture, scalable APIs, and performance.
            </motion.p>

            {/* CTA Pill Buttons (View Projects & Resume) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2.25rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Primary Pill: View Projects */}
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-contrast)',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.95rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 18px var(--accent-glow)',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px var(--accent-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px var(--accent-glow)';
                }}
              >
                <span>View Projects</span>
                <ArrowRight size={18} strokeWidth={2.4} />
              </a>

              {/* Secondary Pill: Resume Download */}
              <a
                href={getAssetUrl(profile?.resumeUrl) || '/resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.85rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px var(--accent-glow)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Download size={18} strokeWidth={2.2} />
                <span>Resume</span>
              </a>
            </motion.div>

            {/* Social Icons Row + Location Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Circular Social Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {[
                  {
                    label: 'GitHub',
                    href: profile?.githubUrl || 'https://github.com/Ranjitsharma76088',
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'LinkedIn',
                    href: profile?.linkedinUrl || 'https://linkedin.com/in/ranjit-sharma',
                    icon: (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Email',
                    href: `mailto:${profile?.email || 'ranjitsharma76088@gmail.com'}`,
                    icon: <Mail size={19} strokeWidth={2.1} />,
                  },
                  {
                    label: 'LeetCode',
                    href: profile?.leetcodeUrl || 'https://leetcode.com/u/ranjitsharma/',
                    icon: (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                      </svg>
                    ),
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    aria-label={social.label}
                    style={{
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      transition: 'all var(--transition-fast)',
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 0 14px var(--accent-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Vertical Separator */}
              <div
                style={{
                  height: 22,
                  width: 1,
                  background: 'var(--border)',
                  margin: '0 0.5rem',
                }}
              />

              {/* Location Tag */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.94rem',
                  fontWeight: 500,
                }}
              >
                <MapPin size={17} strokeWidth={2.2} style={{ color: 'var(--accent)' }} />
                <span>{profile?.location || 'Bhubaneswar, India'}</span>
              </div>
            </motion.div>
          </div>

          {/* Right — Code panel with floating tech badges */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', position: 'relative', width: '100%' }}
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
              {/* Floating Badge Top Left */}
              <div
                style={{
                  position: 'absolute',
                  top: -14,
                  left: 20,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '3px 12px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 3,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                React.js
              </div>

              {/* Floating Badge Top Right */}
              <div
                style={{
                  position: 'absolute',
                  top: 24,
                  right: -14,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '3px 12px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 3,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                Node.js
              </div>

              {/* Floating Badge Bottom Left */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -12,
                  left: 16,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '3px 12px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 3,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                Express.js
              </div>

              {/* Floating Badge Bottom Right */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: -12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '3px 12px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 3,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                MongoDB · Atlas
              </div>

              {/* Code window */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.6rem 1.75rem',
                  fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                  fontSize: '0.85rem',
                  lineHeight: 1.85,
                  color: 'var(--text-secondary)',
                  width: '100%',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Window controls */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {['#ff5f57', '#ffbd2e', '#28c840'].map((c) => (
                    <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
                  ))}
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    developer.js
                  </span>
                </div>

                {[
                  { indent: 0, text: <><span style={{color:'#a855f7'}}>const</span> <span style={{color:'#38bdf8'}}>developer</span> = {'{'}</> },
                  { indent: 2, text: <><span style={{color:'var(--code-key)', fontWeight: 600}}>name</span>: <span style={{color:'var(--accent)', fontWeight: 500}}>"Ranjit Sharma"</span>,</> },
                  { indent: 2, text: <><span style={{color:'var(--code-key)', fontWeight: 600}}>role</span>: <span style={{color:'var(--accent)', fontWeight: 500}}>"Full-Stack Developer"</span>,</> },
                  { indent: 2, text: <><span style={{color:'var(--code-key)', fontWeight: 600}}>stack</span>: [<span style={{color:'var(--accent)', fontWeight: 500}}>"MongoDB"</span>, <span style={{color:'var(--accent)', fontWeight: 500}}>"Express"</span>,</> },
                  { indent: 5, text: <><span style={{color:'var(--accent)', fontWeight: 500}}>"React"</span>, <span style={{color:'var(--accent)', fontWeight: 500}}>"Node.js"</span>],</> },
                  { indent: 2, text: <><span style={{color:'var(--code-key)', fontWeight: 600}}>education</span>: <span style={{color:'var(--accent)', fontWeight: 500}}>"B.Tech in Computer Science"</span>,</> },
                  { indent: 2, text: <><span style={{color:'var(--code-key)', fontWeight: 600}}>leetcode</span>: <span style={{color:'var(--accent)', fontWeight: 500}}>"Problem Solving &amp; DSA"</span>,</> },
                  { indent: 2, text: <><span style={{color:'var(--code-key)', fontWeight: 600}}>available</span>: <span style={{color:'var(--code-boolean)', fontWeight: 600}}>true</span>,</> },
                  { indent: 0, text: '};' },
                  { indent: 0, text: '' },
                  { indent: 0, text: <><span style={{color:'#a855f7'}}>export default</span> <span style={{color:'#38bdf8'}}>developer</span>;</> },
                ].map((line, i) => (
                  <div key={i} style={{ paddingLeft: `${line.indent * 0.55}rem` }}>
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator matching reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: '0.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.45rem',
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: 18,
              height: 28,
              borderRadius: 10,
              border: '1.5px solid var(--border)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 4,
            }}
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              style={{
                width: 3.5,
                height: 7,
                borderRadius: 2,
                background: 'var(--accent)',
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
