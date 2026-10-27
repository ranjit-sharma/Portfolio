import { useEffect, useState } from 'react';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { motion, AnimatePresence } from 'framer-motion';
import { RSLogo } from '../ui';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

const SECTION_IDS = ['hero', ...NAV_LINKS.map((l) => l.href.slice(1))];

export default function Navbar() {
  const activeId = useScrollSpy(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    return () => {
      document.body.style.overflow = '';
    };
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
          {/* Brand Logo (Left corner) */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              padding: '0.25rem 0',
              transition: 'transform var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Ranjit Sharma — Home"
          >
            <RSLogo height={36} color="var(--accent)" glow />
          </a>

          {/* Right Corner Group: Nav Links */}
          <div
            className="nav-right-group"
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Desktop Navigation Links */}
            <nav
              role="navigation"
              aria-label="Main navigation"
              style={{
                display: 'none', // Shown via media query
                alignItems: 'center',
                gap: '1.85rem',
              }}
              className="nav-desktop-container"
            >
              {NAV_LINKS.map((link) => {
                const id = link.href.slice(1);
                const isActive = activeId === id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      position: 'relative',
                      padding: '0.45rem 0',
                      fontSize: '0.94rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--text-primary, #ffffff)' : 'var(--text-secondary, #9ca3af)',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)',
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                    className="nav-link-desktop"
                  >
                    <span>{link.label}</span>

                    {/* Active underline indicator matching demo */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-indicator"
                        style={{
                          position: 'absolute',
                          bottom: -2,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'var(--accent, #EF4444)',
                          borderRadius: '9999px',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Mobile Menu Trigger (hidden on desktop >=1024px) */}
            <div className="mobile-menu-wrap" style={{ display: 'flex', alignItems: 'center' }}>
              {/* Mobile hamburger */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '50%',
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
                <span
                  style={{
                    width: 16,
                    height: 1.5,
                    background: 'var(--text-secondary)',
                    borderRadius: 2,
                    transition: 'all var(--transition-fast)',
                    transform: mobileOpen ? 'translateY(5.5px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  style={{
                    width: 16,
                    height: 1.5,
                    background: 'var(--text-secondary)',
                    borderRadius: 2,
                    opacity: mobileOpen ? 0 : 1,
                    transition: 'all var(--transition-fast)',
                  }}
                />
                <span
                  style={{
                    width: 16,
                    height: 1.5,
                    background: 'var(--text-secondary)',
                    borderRadius: 2,
                    transition: 'all var(--transition-fast)',
                    transform: mobileOpen ? 'translateY(-5.5px) rotate(-45deg)' : 'none',
                  }}
                />
              </button>
            </div>
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
                position: 'fixed',
                inset: 0,
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
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.75rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RSLogo height={34} color="var(--accent)" glow />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>

              {NAV_LINKS.map((link) => {
                const id = link.href.slice(1);
                const isActive = activeId === id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '1rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                      background: isActive ? 'var(--accent-dim)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <style>{`
        /* 7 links only fit beside the controls from 1024px; below that use the menu button */
        @media (min-width: 1024px) {
          .nav-desktop-container {
            display: flex !important;
          }
          .mobile-menu-wrap,
          .mobile-menu-btn {
            display: none !important;
          }
        }
        .nav-link-desktop:hover {
          color: var(--text-primary, #ffffff) !important;
        }
        #mobile-menu-toggle:hover {
          border-color: var(--accent);
          color: var(--accent);
          box-shadow: 0 0 10px var(--accent-glow);
        }
      `}</style>
    </>
  );
}
