import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Trophy, Briefcase, CheckCircle2, X, ExternalLink, Award, FileText } from 'lucide-react';
import { TiltCard } from '../components/ui/index';
import api from '../services/api';
import { getAssetUrl } from '../utils/assetUrl';

const FALLBACK_CERTS = [
  {
    _id: '1',
    name: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    issuer: 'Oracle University',
    issueDate: '2025-01-01',
    credentialUrl: '',
    image: '/uploads/Screenshot_2026-10-21_132422-1792570047406-5572.png',
    description: 'Certification covering generative AI fundamentals, OCI AI services, large language models, and practical AI solution development on Oracle Cloud Infrastructure.',
    category: 'Certifications',
    windowTitle: 'Oracle University',
    badge: 'Certified Professional',
    dateTag: 'Jan 2025',
    displayOrder: 1,
  },
  {
    _id: '2',
    name: 'Technical Communication',
    issuer: 'TCS iON',
    issueDate: '',
    credentialUrl: '',
    image: '',
    description: 'Certification in technical writing, workplace communication, and professional documentation for technology specialists.',
    category: 'Certifications',
    windowTitle: 'TCS iON',
    badge: 'Certified',
    dateTag: '2024',
    displayOrder: 2,
  },
  {
    _id: '3',
    name: 'Geo-data Sharing and Cyber Security',
    issuer: 'ISRO / IIRS',
    issueDate: '',
    credentialUrl: '',
    image: '',
    description: 'Specialized course by ISRO / IIRS covering geospatial data infrastructure, secure data sharing protocols, and cyber security practices.',
    category: 'Certifications',
    windowTitle: 'ISRO / IIRS',
    badge: 'Course Completed',
    dateTag: '2024',
    displayOrder: 3,
  },
  {
    _id: '4',
    name: 'Smart India Hackathon Participant',
    issuer: 'Ministry of Education, Government of India',
    issueDate: '',
    credentialUrl: '',
    image: '',
    description: 'Participant in the nationwide Smart India Hackathon initiative organized by the Ministry of Education and AICTE, Government of India.',
    category: 'Competitions',
    windowTitle: 'Smart India Hackathon',
    badge: 'National Finalist',
    dateTag: '2024',
    displayOrder: 4,
  },
];

/**
 * CertificateDocPreview — Aesthetic credential sheet shown when an image is pending upload.
 * Renders an official certificate canvas with recipient name, institution headers, and seal.
 */
function CertificateDocPreview({ cert, isModal = false }) {
  const name = 'Ranjit Sharma';
  const title = cert.name || 'Certificate of Recognition';
  const issuer = cert.issuer || 'Official Credential';
  const lower = (title + ' ' + issuer).toLowerCase();

  const isSIH = lower.includes('hackathon');
  const isISRO = lower.includes('isro') || lower.includes('iirs');
  const isTCS = lower.includes('tcs') || lower.includes('ion');

  let orgName = issuer;
  let subheader = 'CERTIFICATE OF ACHIEVEMENT';
  let accentColor = 'var(--accent, #0284c7)';
  let sealColor = '#b45309'; // gold

  if (isSIH) {
    orgName = 'Ministry of Education · Govt of India';
    subheader = 'SMART INDIA HACKATHON';
    sealColor = '#ea580c';
  } else if (isISRO) {
    orgName = 'ISRO · Indian Institute of Remote Sensing';
    subheader = 'CERTIFICATE OF COMPLETION';
    sealColor = '#0284c7';
  } else if (isTCS) {
    orgName = 'TCS iON · Tata Consultancy Services';
    subheader = 'CERTIFICATE OF EXCELLENCE';
    sealColor = '#d97706';
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#ffffff',
        padding: isModal ? '2.5rem 2rem' : '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Outer ornate border */}
      <div
        style={{
          position: 'absolute',
          inset: isModal ? 8 : 3,
          border: `${isModal ? 2.5 : 1.5}px solid ${accentColor}`,
          borderRadius: isModal ? '8px' : '4px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: isModal ? 13 : 5,
          border: '0.5px solid rgba(0, 0, 0, 0.12)',
          borderRadius: isModal ? '6px' : '3px',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', width: '100%', marginTop: isModal ? 8 : 2 }}>
        <div
          style={{
            fontSize: isModal ? '1.05rem' : '0.52rem',
            fontWeight: 800,
            color: accentColor,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {orgName}
        </div>
        <div
          style={{
            fontSize: isModal ? '0.8rem' : '0.45rem',
            fontWeight: 700,
            color: '#64748b',
            letterSpacing: '0.12em',
            marginTop: isModal ? 5 : 1,
            textTransform: 'uppercase',
          }}
        >
          {subheader}
        </div>
      </div>

      {/* Body */}
      <div style={{ textAlign: 'center', width: '100%', padding: '0 4px', margin: isModal ? '1.5rem 0' : 0 }}>
        <div style={{ fontSize: isModal ? '0.85rem' : '0.42rem', color: '#6b7280', fontStyle: 'italic' }}>
          This is awarded to
        </div>
        <div
          style={{
            fontSize: isModal ? '1.6rem' : '0.68rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            margin: isModal ? '0.35rem 0' : '1px 0',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: isModal ? '1rem' : '0.48rem',
            fontWeight: 700,
            color: accentColor,
            lineHeight: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </div>
      </div>

      {/* Bottom seals / authorization row */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isModal ? '0 2rem' : '0 6px',
          marginBottom: isModal ? 8 : 2,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: isModal ? 75 : 28, height: 1, background: '#94a3b8', margin: '0 auto 2px' }} />
          <div style={{ fontSize: isModal ? '0.7rem' : '0.38rem', color: '#64748b' }}>Verified</div>
        </div>

        {/* Gold Seal */}
        <div
          style={{
            width: isModal ? 40 : 18,
            height: isModal ? 40 : 18,
            borderRadius: '50%',
            background: sealColor,
            border: `${isModal ? 2.5 : 1.5}px solid #ffffff`,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: isModal ? '1rem' : '0.45rem',
            fontWeight: 800,
          }}
        >
          ★
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ width: isModal ? 75 : 28, height: 1, background: '#94a3b8', margin: '0 auto 2px' }} />
          <div style={{ fontSize: isModal ? '0.7rem' : '0.38rem', color: '#64748b' }}>Authorized</div>
        </div>
      </div>
    </div>
  );
}

export default function CertificationsSection() {
  const { ref, inView } = useInView();
  const [certs, setCerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setSelectedCert(null);
    }
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCert]);

  useEffect(() => {
    api
      .get('/certifications')
      .then((res) => {
        const data = res.data.data;
        if (data && data.length > 0) {
          setCerts(data);
        } else {
          setCerts(FALLBACK_CERTS);
        }
      })
      .catch(() => setCerts(FALLBACK_CERTS))
      .finally(() => setLoading(false));
  }, []);

  const items = certs || FALLBACK_CERTS;

  // Build filter pills based on categories present in items
  const tabs = useMemo(() => {
    const list = [{ id: 'all', label: 'All', count: items.length }];
    const categoryMap = new Map();

    items.forEach((item) => {
      const cat = (item.category || 'Certifications').trim();
      const key = cat.toLowerCase();
      categoryMap.set(key, {
        id: key,
        label: cat,
        count: (categoryMap.get(key)?.count || 0) + 1,
      });
    });

    categoryMap.forEach((val) => list.push(val));
    return list;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return items;
    return items.filter(
      (c) => (c.category || 'Certifications').toLowerCase() === activeTab.toLowerCase()
    );
  }, [items, activeTab]);

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('intern')) {
      return <Briefcase size={12} strokeWidth={2.4} style={{ color: 'var(--accent)' }} />;
    }
    if (cat.includes('compet') || cat.includes('hackathon')) {
      return <Trophy size={12} strokeWidth={2.4} style={{ color: 'var(--accent)' }} />;
    }
    return <CheckCircle2 size={12} strokeWidth={2.4} style={{ color: 'var(--accent)' }} />;
  };

  const getCategoryLabel = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('intern')) return 'INTERNSHIP';
    if (cat.includes('compet') || cat.includes('hackathon')) return 'COMPETITION';
    return 'CERTIFICATION';
  };

  return (
    <section id="certifications" className="section-padding" style={{ background: 'var(--bg-base)' }}>
      <style>{`
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.15rem;
        }
        @media (max-width: 1080px) {
          .cert-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        /* Mobile stack flow */
        @media (max-width: 640px) {
          .cert-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 0 !important;
            position: relative !important;
            padding-bottom: 16px !important;
          }

          .cert-grid > div:not(.cert-card-interactive) {
            margin-bottom: 1rem;
          }

          .cert-card-interactive {
            position: sticky !important;
            top: calc(75px + var(--stack-offset-mob, 0px)) !important;
            z-index: var(--stack-z, 1) !important;
            margin-bottom: 24px !important;
            transform: none !important;
            transform-style: flat !important;
            backface-visibility: visible !important;
            background: var(--bg-card) !important;
            background-image: radial-gradient(circle at 12% 10%, var(--accent-dim) 0%, transparent 48%), linear-gradient(var(--bg-card), var(--bg-card)) !important;
            box-shadow: 0 10px 32px -6px rgba(0, 0, 0, 0.6), 0 0 1px var(--border) !important;
          }

          .cert-card-interactive:last-child {
            margin-bottom: 0 !important;
          }
        }

        /* Card transition matching site-wide project and experience cards */
        .cert-card-interactive {
          transition: box-shadow var(--transition-card, 400ms cubic-bezier(0.16, 1, 0.3, 1)),
                      border-color var(--transition-card, 400ms cubic-bezier(0.16, 1, 0.3, 1)),
                      background-color var(--transition-card, 400ms cubic-bezier(0.16, 1, 0.3, 1));
          will-change: transform, box-shadow;
          backface-visibility: hidden;
        }

        .cert-card-interactive:hover {
          border-color: var(--accent-border) !important;
          box-shadow: 0 16px 36px -8px var(--accent-glow) !important;
        }

        /* Title color shift */
        .cert-card-interactive:hover .cert-card-title {
          color: var(--accent) !important;
        }
      `}</style>

      <div className="container" ref={ref}>
        {/* Section Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          {/* Eyebrow — Trophy icon removed per user request */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span
              style={{
                color: 'var(--accent)',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              ACHIEVEMENTS &amp; CERTIFICATIONS
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: 'clamp(2.1rem, 3.8vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              marginBottom: '0.75rem',
            }}
          >
            Recognition &amp; Credentials
          </h2>

          {/* Subtitle */}
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.96rem',
              margin: 0,
            }}
          >
            The actual certificates — click any card to view it full size.
          </p>
        </div>

        {/* Filter Pills */}
        {tabs.length > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? 'var(--accent-dim)' : 'var(--bg-card)',
                    border: isActive
                      ? '1px solid var(--accent-border)'
                      : '1px solid var(--border)',
                    borderRadius: '9999px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.22s ease',
                    boxShadow: isActive ? '0 2px 8px var(--accent-glow)' : 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--bg-card)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Loading state skeleton */}
        {loading ? (
          <div className="cert-grid">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 310,
                  borderRadius: '16px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State */
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              maxWidth: 520,
              margin: '0 auto',
            }}
          >
            <Award size={42} style={{ color: 'var(--accent)', margin: '0 auto 1rem', opacity: 0.85 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              No Credentials In This Category
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              Credentials uploaded in the admin portal will appear right here.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <motion.div layout className="cert-grid">
            <AnimatePresence>
              {filteredItems.map((cert, i) => (
                <TiltCard
                  key={cert._id || i}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="cert-card-interactive card-ambient"
                  onClick={() => setSelectedCert(cert)}
                  maxTilt={8}
                  style={{
                    background: 'radial-gradient(circle at 12% 10%, var(--accent-dim) 0%, transparent 48%), var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    boxShadow: 'var(--shadow-md)',
                    '--stack-offset-mob': `${i * 20}px`,
                    '--stack-z': i + 1,
                  }}
                >
                  {/* macOS Window Mockup Frame */}
                  <div
                    style={{
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-elevated)',
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {/* Window Header */}
                    <div
                      style={{
                        height: 32,
                        padding: '0 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-hover)',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {/* Left: 3 macOS dots + windowTitle */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-secondary)',
                            fontWeight: 500,
                            marginLeft: '0.45rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 160,
                          }}
                        >
                          {cert.windowTitle || cert.issuer}
                        </span>
                      </div>
                    </div>

                    {/* Window Image Preview / Document Viewport */}
                    <div
                      style={{
                        height: 140,
                        position: 'relative',
                        background: 'var(--bg-surface)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {cert.image && !cert.image.toLowerCase().endsWith('.pdf') ? (
                        <img
                          src={getAssetUrl(cert.image)}
                          alt={cert.name}
                          className="cert-preview-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                            display: 'block',
                            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        />
                      ) : cert.image && cert.image.toLowerCase().endsWith('.pdf') ? (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            width: '100%',
                            height: '100%',
                            background: 'var(--accent-dim)',
                            color: 'var(--accent)',
                          }}
                        >
                          <FileText size={32} strokeWidth={1.7} />
                          <span style={{ fontSize: '0.67rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                            PDF DOCUMENT
                          </span>
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '100%' }}>
                          <CertificateDocPreview cert={cert} isModal={false} />
                        </div>
                      )}

                      {/* Overlay badge (bottom-left) */}
                      {cert.badge && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            background: 'var(--bg-surface)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid var(--accent-border)',
                            borderRadius: '6px',
                            padding: '2.5px 8px',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            color: 'var(--accent)',
                            boxShadow: 'var(--shadow-sm)',
                            pointerEvents: 'none',
                            lineHeight: 1.25,
                            zIndex: 2,
                          }}
                        >
                          {cert.badge}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content Details (below window) */}
                  <div style={{ padding: '0.85rem 0.25rem 0.25rem 0.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Category Tag + Date Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginBottom: '0.45rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      {getCategoryIcon(cert.category)}
                      <span
                        style={{
                          color: 'var(--accent)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {getCategoryLabel(cert.category)}
                      </span>
                      {cert.dateTag && (
                        <>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>·</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 500 }}>
                            {cert.dateTag}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title — Uses var(--text-primary) for perfect legibility in both Light & Dark modes */}
                    <h3
                      className="cert-card-title"
                      title={cert.name}
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        lineHeight: 1.35,
                        margin: '0 0 0.35rem 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {cert.name}
                    </h3>

                    {/* Subtitle / Issuer */}
                    <p
                      title={cert.issuer}
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.35,
                        margin: 0,
                        marginTop: 'auto',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {cert.issuer}
                    </p>
                  </div>
                </TiltCard>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Certificate Lightbox Modal */}
        <AnimatePresence>
          {selectedCert && (
            <div
              role="dialog"
              aria-modal="true"
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2000,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem',
              }}
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  maxWidth: 820,
                  width: '100%',
                  maxHeight: '92vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg), 0 0 35px var(--accent-glow)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-elevated)',
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      {getCategoryIcon(selectedCert.category)}
                      <span
                        style={{
                          color: 'var(--accent)',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          letterSpacing: '0.07em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {getCategoryLabel(selectedCert.category)}
                      </span>
                      {selectedCert.dateTag && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                          · {selectedCert.dateTag}
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {selectedCert.name}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                      {selectedCert.issuer}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    style={{
                      background: 'var(--bg-hover)',
                      border: '1px solid var(--border)',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.borderColor = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body */}
                <div
                  style={{
                    padding: '1.25rem',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-base)',
                  }}
                >
                  {selectedCert.image ? (
                    selectedCert.image.toLowerCase().endsWith('.pdf') ? (
                      <iframe
                        src={getAssetUrl(selectedCert.image)}
                        title={selectedCert.name}
                        style={{
                          width: '100%',
                          height: 480,
                          border: 'none',
                          borderRadius: '10px',
                          background: '#fff',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '1px solid var(--border)',
                          background: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-md)',
                        }}
                      >
                        <img
                          src={getAssetUrl(selectedCert.image)}
                          alt={selectedCert.name}
                          style={{
                            width: '100%',
                            maxHeight: '68vh',
                            objectFit: 'contain',
                            display: 'block',
                          }}
                        />
                      </div>
                    )
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 620,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md)',
                      }}
                    >
                      <CertificateDocPreview cert={selectedCert} isModal={true} />
                    </div>
                  )}

                  {selectedCert.description && (
                    <p
                      style={{
                        marginTop: '1rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        textAlign: 'center',
                        maxWidth: '650px',
                      }}
                    >
                      {selectedCert.description}
                    </p>
                  )}
                </div>

                {/* Modal Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.25rem',
                    borderTop: '1px solid var(--border)',
                    background: 'var(--bg-elevated)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {selectedCert.image && (
                      <a
                        href={getAssetUrl(selectedCert.image)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--accent)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <ExternalLink size={14} /> Open Original File
                      </a>
                    )}
                    {selectedCert.credentialUrl && (
                      <a
                        href={selectedCert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <ExternalLink size={14} /> Verify Credential
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--accent-contrast)',
                      border: 'none',
                      padding: '0.45rem 1.35rem',
                      borderRadius: 'var(--radius-pill)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px var(--accent-glow)',
                    }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
