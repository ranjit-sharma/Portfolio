import { useEffect, useState } from 'react';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { motion, AnimatePresence } from 'framer-motion';
import UnifiedThemeToggle from './UnifiedThemeToggle';
import { RSLogo } from '../ui';
import api from '../../services/api';
import { getAssetUrl } from '../../utils/assetUrl';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

export default function Navbar() {
  const activeId = useScrollSpy(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('/resume.pdf');

  useEffect(() => {
    api
      .get('/profile')
      .then((r) => {
        if (r.data.data?.resumeUrl) setResumeUrl(getAssetUrl(r.data.data.resumeUrl));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 'var(--navbar-height)',
          background: scrolled ? 'var(--nav-backdrop)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'all var(--transition-base)',
        }}
      >
        <div
          className="container"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Emblem */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              padding: '0.25rem 0',
              transition: 'transform var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            aria-label="Ranjit Sharma — Home"
          >
            <RSLogo height={36} color="var(--accent)" glow />
          </a>

          {/* Desktop nav */}
          <nav role="navigation" aria-label="Main navigation" style={{ display: 'flex', gap: '0.25rem' }}>
            {NAV_LINKS.map((link) => {
              const id = link.href.slice(1);
              const isActive = activeId === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-dim)' : 'transparent',
                    border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)',
                    display: 'none', // shown via CSS @media
                  }}
                  className="nav-link-desktop"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Unified Theme & Mode Toggler */}
            <UnifiedThemeToggle align="right" />

            {/* Resume button - desktop */}
            <a
              id="resume-download"
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-contrast)',
                border: '1px solid var(--accent)',
                boxShadow: '0 2px 8px var(--accent-glow)',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'none',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all var(--transition-fast)',
              }}
              className="btn-resume-desktop"
            >
              Resume
            </a>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                width: 36,
                height: 36,
              }}
              className="mobile-menu-btn"
            >
              <span style={{ width: 16, height: 1.5, background: 'var(--text-secondary)', borderRadius: 2, transition: 'all var(--transition-fast)', transform: mobileOpen ? 'translateY(5.5px) rotate(45deg)' : 'none' }} />
              <span style={{ width: 16, height: 1.5, background: 'var(--text-secondary)', borderRadius: 2, opacity: mobileOpen ? 0 : 1, transition: 'all var(--transition-fast)' }} />
              <span style={{ width: 16, height: 1.5, background: 'var(--text-secondary)', borderRadius: 2, transition: 'all var(--transition-fast)', transform: mobileOpen ? 'translateY(-5.5px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 999,
              }}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              aria-label="Mobile navigation"
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(320px, 85vw)',
                background: 'var(--bg-surface)',
                borderLeft: '1px solid var(--border)',
                zIndex: 1001,
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RSLogo height={34} color="var(--accent)" glow />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UnifiedThemeToggle align="left" />
                </div>
              </div>
              {NAV_LINKS.map((link) => {
                const id = link.href.slice(1);
                const isActive = activeId === id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '1rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                      background: isActive ? 'var(--accent-dim)' : 'transparent',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 'auto',
                  background: 'var(--accent)',
                  color: 'var(--accent-contrast)',
                  border: '1px solid var(--accent)',
                  boxShadow: '0 2px 8px var(--accent-glow)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Download Resume
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .nav-link-desktop { display: inline-flex !important; }
          .btn-resume-desktop { display: inline-flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        .nav-link-desktop:hover {
          color: var(--text-primary) !important;
          background: var(--bg-hover) !important;
        }
        #theme-toggle:hover, #mobile-menu-toggle:hover {
          border-color: var(--accent);
          color: var(--accent);
          box-shadow: 0 0 10px var(--accent-glow);
        }
        #resume-download:hover {
          background: var(--accent-hover);
          border-color: var(--accent-hover);
          box-shadow: 0 0 16px var(--accent-glow);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
