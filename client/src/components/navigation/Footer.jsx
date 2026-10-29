import { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUp,
  User,
  GraduationCap,
  Code2,
  Briefcase,
  FolderGit2,
  Award,
  Mail,
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { FaLinkedinIn, FaInstagram, FaFacebook, FaXTwitter } from 'react-icons/fa6';
import { RSLogo } from '../ui';
import api from '../../services/api';

const currentYear = new Date().getFullYear();

const LINKS = [
  { label: 'About', href: '#about', Icon: User },
  { label: 'Education', href: '#education', Icon: GraduationCap },
  { label: 'Skills', href: '#skills', Icon: Code2 },
  { label: 'Experience', href: '#experience', Icon: Briefcase },
  { label: 'Projects', href: '#projects', Icon: FolderGit2 },
  { label: 'Certifications', href: '#certifications', Icon: Award },
  { label: 'Contact', href: '#contact', Icon: Mail },
];

export default function Footer() {
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


  const isAvailable = profile ? (profile.available ?? true) : true;

  const socials = [
    profile?.githubUrl?.trim() && {
      label: 'GitHub',
      Icon: SiGithub,
      href: profile.githubUrl.trim(),
    },
    profile?.linkedinUrl?.trim() && {
      label: 'LinkedIn',
      Icon: FaLinkedinIn,
      href: profile.linkedinUrl.trim(),
    },
    profile?.instagramUrl?.trim() && {
      label: 'Instagram',
      Icon: FaInstagram,
      href: profile.instagramUrl.trim(),
    },
    profile?.facebookUrl?.trim() && {
      label: 'Facebook',
      Icon: FaFacebook,
      href: profile.facebookUrl.trim(),
    },
    profile?.twitterUrl?.trim() && {
      label: 'Twitter',
      Icon: FaXTwitter,
      href: profile.twitterUrl.trim(),
    },
  ].filter(Boolean);

  return (
    <footer className="site-footer" role="contentinfo">
      <style>{`
        .site-footer {
          position: relative;
          padding: 0 0 1.75rem;
          background: linear-gradient(180deg, transparent, var(--bg-surface) 40%);
          border-top: 1px solid var(--border);
        }
        /* Call-to-action banner (seamless without card style) */
        .ft-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin: 2.75rem 0 3rem;
          padding: 0 0 2.5rem;
          border: none;
          border-bottom: 1px solid var(--border);
          border-radius: 0;
          background: none;
        }
        .ft-cta-title {
          margin: 0;
          font-size: clamp(1.2rem, 2.4vw, 1.6rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.25;
          color: var(--text-primary);
        }
        .ft-cta-title span {
          color: var(--accent);
        }
        .ft-cta-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .ft-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.85rem 1.85rem;
          min-width: 175px;
          font: inherit;
          font-size: 0.95rem;
          font-weight: 700;
          white-space: nowrap;
          color: var(--accent-contrast);
          background: var(--accent);
          border: none;
          border-radius: 9999px;
          box-shadow: 0 6px 20px -6px var(--accent-glow);
          cursor: pointer;
          transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .ft-cta-btn:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px -4px var(--accent-glow);
        }
        .ft-cta-btn svg {
          transition: transform var(--transition-fast);
        }
        .ft-cta-btn:hover svg {
          transform: translateX(3px);
        }
        /* Main columns */
        .ft-main {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: 2.5rem;
          margin-bottom: 2.5rem;
        }
        .ft-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.85rem;
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .ft-tagline {
          margin: 0 0 1rem;
          max-width: 34ch;
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--text-secondary);
        }
        .ft-status {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.3rem 0.8rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          border-radius: 9999px;
        }
        .ft-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse-glow 2s ease infinite;
        }
        .ft-heading {
          margin: 0 0 1rem;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .ft-links {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.6rem 1.25rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .ft-link {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.15rem 0;
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap;
          color: var(--text-secondary);
          text-decoration: none;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color var(--transition-fast), transform var(--transition-fast);
        }
        .ft-link svg {
          color: var(--text-muted);
          transition: color var(--transition-fast);
          flex-shrink: 0;
        }
        .ft-link:hover,
        .ft-link:focus-visible {
          color: var(--accent);
          transform: translateX(4px);
        }
        .ft-link:hover svg,
        .ft-link:focus-visible svg {
          color: var(--accent);
        }
        .ft-socials {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .ft-social {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.15rem 0;
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap;
          color: var(--text-secondary);
          text-decoration: none;
          background: transparent;
          border: none;
          transition: color var(--transition-fast), transform var(--transition-fast);
        }
        .ft-social svg {
          color: var(--text-muted);
          transition: color var(--transition-fast);
          flex-shrink: 0;
        }
        .ft-social:hover,
        .ft-social:focus-visible {
          color: var(--accent);
          transform: translateX(4px);
        }
        .ft-social:hover svg,
        .ft-social:focus-visible svg {
          color: var(--accent);
        }
        /* Bottom bar */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .ft-bottom p {
          margin: 0;
        }
        .ft-top {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 50%;
          cursor: pointer;
          transition: color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
        }
        .ft-top:hover,
        .ft-top:focus-visible {
          color: var(--accent);
          border-color: var(--accent);
          transform: translateY(-3px);
        }
        @media (max-width: 900px) {
          .ft-main {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .ft-main > :first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 640px) {
          .ft-cta {
            padding: 0 0 2rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
          .ft-cta-actions,
          .ft-cta-btn {
            width: 100%;
          }
          .ft-main {
            grid-template-columns: minmax(0, 1fr);
            gap: 2rem;
          }
        }
      `}</style>

      <div className="container">
        {/* Call to action */}
        <div className="ft-cta">
          <h2 className="ft-cta-title">
            Have an idea or an opening? <span>Let&apos;s build it together.</span>
          </h2>
          <div className="ft-cta-actions">
            <button type="button" className="ft-cta-btn" onClick={() => scrollTo('#contact')}>
              Get in touch <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="ft-main">
          {/* Branding */}
          <div>
            <div className="ft-brand">
              <RSLogo height={34} color="var(--accent)" glow />
              <span>{profile?.name || 'Ranjit Sharma'}</span>
            </div>
            <p className="ft-tagline">Full-Stack Developer. Building reliable, modern web experiences.</p>
            <span
              className="ft-status"
              style={
                isAvailable
                  ? undefined
                  : {
                      color: 'var(--text-muted)',
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--border)',
                    }
              }
            >
              <span
                className="ft-status-dot"
                style={
                  isAvailable
                    ? undefined
                    : { background: 'var(--text-muted)', animation: 'none' }
                }
              />
              {profile?.availabilityNote?.trim() ||
                (isAvailable
                  ? 'Open to opportunities'
                  : 'Not currently open to opportunities')}
            </span>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="ft-heading">Navigate</h3>
            <ul className="ft-links">
              {LINKS.map(({ label, href, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="ft-link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(href);
                    }}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          {socials.length > 0 && (
            <div>
              <h3 className="ft-heading">Connect</h3>
              <ul className="ft-socials">
                {socials.map(({ label, Icon, href }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="ft-social">
                      <Icon size={15} aria-hidden="true" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <p>© {currentYear} {profile?.name || 'Ranjit Sharma'}. All rights reserved.</p>
          <button type="button" className="ft-top" onClick={scrollTop} aria-label="Back to top">
            <ArrowUp size={17} />
          </button>
        </div>
      </div>
    </footer>
  );
}
