import { useState, useEffect } from 'react';
import { RSLogo } from '../ui';
import useViews from '../../hooks/useViews';
import api from '../../services/api';

const currentYear = new Date().getFullYear();

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const { views } = useViews();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get('/profile')
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        padding: '3rem 0 2rem',
      }}
      role="contentinfo"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Branding */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontWeight: 800,
                fontSize: '1.2rem',
                marginBottom: '0.75rem',
              }}
            >
              <RSLogo height={34} color="var(--accent)" glow />
              <span>Ranjit Sharma</span>
            </div>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                maxWidth: '28ch',
              }}
            >
              Full-Stack Developer. Building reliable, modern web experiences.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
              }}
            >
              Navigate
            </h3>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        transition: 'color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                      onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
              }}
            >
              Connect
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a
                href={profile?.githubUrl || 'https://github.com/Ranjitsharma76088'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
              >
                GitHub
              </a>
              <a
                href={profile?.linkedinUrl || 'https://linkedin.com/in/ranjit-sharma'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
              >
                LinkedIn
              </a>
              <a
                href={profile?.leetcodeUrl || 'https://leetcode.com/u/ranjitsharma/'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
              >
                LeetCode
              </a>
              <a
                href="https://wa.me/917482869029"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {currentYear} Ranjit Sharma. All rights reserved.
          </p>

          {/* Total Views Badge */}
          <div
            id="footer-views-counter"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 8px var(--accent)',
                display: 'inline-block',
              }}
            />
            <span style={{ color: 'var(--text-muted)' }}>Total Views:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {views != null ? views.toLocaleString() : '...'}
            </span>
          </div>

          <button
            onClick={scrollTop}
            aria-label="Back to top"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.8rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all var(--transition-fast)',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
