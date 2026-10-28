import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ArrowRight, Download, Mail, MapPin } from 'lucide-react';
import api from '../services/api';
import useViews from '../hooks/useViews';
import { getAssetUrl } from '../utils/assetUrl';
import { LeetCodeIcon } from '../components/ui/index';

const ROLES = [
  'Software Developer',
  'Full-Stack Developer',
  'MERN Stack Engineer',
  'Backend Developer',
  'React Developer',
];

const HEADING_WORDS = [
  { text: 'Hi,' },
  { text: "I'm" },
  { text: 'Ranjit', accent: true },
  { text: 'Sharma', accent: true },
];

const HEADING_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.15,
    },
  },
};

const HEADING_WORD_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.88,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 115,
      mass: 0.6,
    },
  },
};

const DOT_VARIANTS = {
  hidden: { opacity: 0, scale: 0, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: [0, 1.5, 1],
    filter: 'blur(0px)',
    transition: {
      delay: 0.72,
      duration: 0.45,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

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
  const { introDone } = useOutletContext() ?? { introDone: true };
  const [profile, setProfile] = useState(null);
  useViews();

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
        padding: '4rem 0',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Left — Content */}
          <div>
            {/* Availability & Views badges */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
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
                  padding: '0.35rem 0.9rem',
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
                B.Tech in Computer Science · Open to opportunities
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              aria-label="Hi, I'm Ranjit Sharma."
              variants={HEADING_CONTAINER_VARIANTS}
              initial="hidden"
              animate={introDone ? 'visible' : 'hidden'}
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
              }}
            >
              {HEADING_WORDS.map((word, i) => (
                <motion.span
                  key={i}
                  variants={HEADING_WORD_VARIANTS}
                  whileHover={{
                    y: -3,
                    scale: 1.04,
                    transition: { type: 'spring', stiffness: 350, damping: 12 },
                  }}
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    marginRight: i < HEADING_WORDS.length - 1 ? '0.28em' : 0,
                    cursor: 'default',
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  <span style={{ color: word.accent ? 'var(--accent)' : undefined }}>
                    {word.text}
                  </span>
                </motion.span>
              ))}
              <motion.span
                variants={DOT_VARIANTS}
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  color: 'var(--text-primary)',
                  cursor: 'default',
                  willChange: 'transform, opacity',
                }}
              >
                .
              </motion.span>
            </motion.h1>

            {/* Typing effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={introDone ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                fontWeight: 700,
                marginBottom: '1.25rem',
                minHeight: '2em',
              }}
            >
              <TypingEffect words={ROLES} />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.7,
                maxWidth: '52ch',
                marginBottom: '2rem',
              }}
            >
              I build backends, full-stack web applications, and interactive user interfaces — focused on clean architecture, scalable APIs, and performance.
            </motion.p>

            {/* CTA Pill Buttons (View Projects & Resume) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
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
              animate={introDone ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.6 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Circular Social Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  profile?.githubUrl?.trim() && {
                    label: 'GitHub',
                    href: profile.githubUrl.trim(),
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    ),
                  },
                  profile?.linkedinUrl?.trim() && {
                    label: 'LinkedIn',
                    href: profile.linkedinUrl.trim(),
                    icon: (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                  },
                  (profile?.email?.trim() || (!profile && 'ctrl.ranjit@gmail.com')) && {
                    label: 'Email',
                    href: `mailto:${profile?.email?.trim() || 'ctrl.ranjit@gmail.com'}`,
                    icon: <Mail size={19} strokeWidth={2.1} />,
                  },
                  profile?.leetcodeUrl?.trim() && {
                    label: 'LeetCode',
                    href: profile.leetcodeUrl.trim(),
                    icon: <LeetCodeIcon size={20} monochrome />,
                  },
                ]
                  .filter(Boolean)
                  .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-border)';
                      e.currentTarget.style.color = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 18px var(--accent-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Vertical Divider */}
              <div
                style={{
                  width: 1,
                  height: 24,
                  background: 'var(--border)',
                  margin: '0 0.25rem',
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

          {/* Right — Code panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={introDone ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div
              className="card-ambient"
              style={{
                background: 'radial-gradient(circle at 12% 10%, var(--accent-dim) 0%, transparent 48%), var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                fontSize: '0.82rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                maxWidth: 420,
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
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: '-3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
          }}
        >
          <span>scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            style={{ fontSize: '0.8rem' }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
