import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Trophy, Briefcase, CheckCircle2, ArrowUpRight, X, ExternalLink } from 'lucide-react';
import api from '../services/api';
import { getAssetUrl } from '../utils/assetUrl';

const FALLBACK_CERTS = [
  {
    _id: '1',
    name: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    issuer: 'Oracle University',
    issueDate: '2025-10-01',
    credentialUrl: '',
    image: '/certificates/cert_1_oracle.png',
    description: 'Certification covering AI concepts, OCI AI services, machine learning foundations, and cloud deployment.',
    category: 'Certifications',
    windowTitle: 'Oracle University',
    badge: 'Valid until Oct 2027',
    dateTag: 'Oct 2025',
    displayOrder: 1,
  },
  {
    _id: '2',
    name: 'Programming In Java',
    issuer: 'NPTEL · IIT Kharagpur',
    issueDate: '2025-04-01',
    credentialUrl: '',
    image: '/certificates/cert_2_nptel_java.png',
    description: '12-week course and proctored examination covering core Java, OOP, collections, multithreading, and JVM internals.',
    category: 'Certifications',
    windowTitle: 'NPTEL',
    badge: 'Elite - Silver · 77%',
    dateTag: 'Jan-Apr 2025 · 12 weeks',
    displayOrder: 2,
  },
  {
    _id: '3',
    name: 'Data Base Management System',
    issuer: 'NPTEL · IIT Kharagpur',
    issueDate: '2025-09-01',
    credentialUrl: '',
    image: '/certificates/cert_3_nptel_dbms.png',
    description: '8-week comprehensive course covering relational algebra, SQL, normalization, transactions, indexing, and query optimization.',
    category: 'Certifications',
    windowTitle: 'NPTEL',
    badge: 'Score 57%',
    dateTag: 'Jul-Sep 2025 · 8 weeks',
    displayOrder: 3,
  },
  {
    _id: '4',
    name: 'Data Structure and Algorithms using Java',
    issuer: 'NPTEL · IIT Kharagpur',
    issueDate: '2024-10-01',
    credentialUrl: '',
    image: '/certificates/cert_4_nptel_dsa.png',
    description: '12-week intensive course on algorithmic paradigms, asymptotic analysis, linear and non-linear data structures, and graph algorithms.',
    category: 'Certifications',
    windowTitle: 'NPTEL',
    badge: 'Score 57%',
    dateTag: 'Jul-Oct 2024 · 12 weeks',
    displayOrder: 4,
  },
  {
    _id: '5',
    name: 'Internship Training — Upper Air Sounding Real-Time Monitoring and Visualization Dashboard',
    issuer: 'Proof & Experimental Establishment (PXE), DRDO',
    issueDate: '2026-07-17',
    credentialUrl: '',
    image: '/certificates/cert_5_drdo.png',
    description: 'Certificate of Internship Training at Proof & Experimental Establishment (PXE), Ministry of Defence, Government of India.',
    category: 'Internships',
    windowTitle: 'DRDO',
    badge: 'Certificate No. 249/2026',
    dateTag: '18 Jun – 17 Jul 2026',
    displayOrder: 5,
  },
  {
    _id: '6',
    name: 'Certificate of Internship — Software Development Intern',
    issuer: 'Astro Vedangam Private Limited',
    issueDate: '2026-01-31',
    credentialUrl: '',
    image: '/certificates/cert_6_astro.png',
    description: 'Software Development Internship certification with Astro Vedangam Private Limited for contributions to web applications.',
    category: 'Internships',
    windowTitle: 'Astro Vedangam Private Limited',
    badge: 'Sep 2025 – Jan 2026',
    dateTag: 'Sep 2025 – Jan 2026',
    displayOrder: 6,
  },
  {
    name: "PRAVAAH'25 — Web Hackathon",
    _id: '7',
    issuer: 'Certificate of Participation · IIT Bhubaneswar',
    issueDate: '2025-01-15',
    credentialUrl: '',
    image: '/certificates/cert_7_pravaah.png',
    description: "Participated in the PRAVAAH'25 Annual Cultural and Technology Festival Web Hackathon at Indian Institute of Technology Bhubaneswar.",
    category: 'Competitions',
    windowTitle: 'Certificate of Participation',
    badge: '2025',
    dateTag: '2025',
    displayOrder: 7,
  },
  {
    _id: '8',
    name: 'PixelCraft — The UI Showdown',
    issuer: 'Certificate of Participation · Brain Logic Club, Trident Academy of Technology',
    issueDate: '2024-11-20',
    credentialUrl: '',
    image: '/certificates/cert_8_pixelcraft.png',
    description: 'Certificate of Participation in PixelCraft — The UI Showdown organized by the Brain Logic Club at Trident Academy of Technology.',
    category: 'Competitions',
    windowTitle: 'Certificate of Participation',
    badge: 'Score 57%',
    dateTag: '',
    displayOrder: 8,
  },
];

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
          // Merge API data with rich fallback fields if missing
          const merged = data.map((item, idx) => {
            const fallback = FALLBACK_CERTS[idx] || {};
            return {
              ...fallback,
              ...item,
              category: item.category || fallback.category || 'Certifications',
              windowTitle: item.windowTitle || fallback.windowTitle || item.issuer || 'Certificate',
              badge: item.badge || fallback.badge || '',
              dateTag: item.dateTag || fallback.dateTag || '',
              image: item.image || fallback.image || '',
            };
          });
          setCerts(merged);
        } else {
          setCerts(FALLBACK_CERTS);
        }
      })
      .catch(() => setCerts(FALLBACK_CERTS))
      .finally(() => setLoading(false));
  }, []);

  const items = certs || FALLBACK_CERTS;

  // Counts for tabs
  const certCount = items.filter((c) => (c.category || '').toLowerCase() === 'certifications').length;
  const internCount = items.filter((c) => (c.category || '').toLowerCase() === 'internships').length;
  const compCount = items.filter((c) => (c.category || '').toLowerCase() === 'competitions').length;

  const tabs = [
    { id: 'all', label: 'All', count: items.length },
    { id: 'certifications', label: 'Certifications', count: certCount },
    { id: 'internships', label: 'Internships', count: internCount },
    { id: 'competitions', label: 'Competitions', count: compCount },
  ];

  const filteredItems = items.filter((c) => {
    if (activeTab === 'all') return true;
    return (c.category || '').toLowerCase() === activeTab.toLowerCase();
  });

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('intern')) {
      return <Briefcase size={12} strokeWidth={2.4} style={{ color: 'var(--accent, #EF4444)' }} />;
    }
    if (cat.includes('compet')) {
      return <Trophy size={12} strokeWidth={2.4} style={{ color: 'var(--accent, #EF4444)' }} />;
    }
    return <CheckCircle2 size={12} strokeWidth={2.4} style={{ color: 'var(--accent, #EF4444)' }} />;
  };

  const getCategoryLabel = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('intern')) return 'INTERNSHIP';
    if (cat.includes('compet')) return 'COMPETITION';
    return 'CERTIFICATION';
  };

  return (
    <section id="certifications" className="section-padding" style={{ background: 'var(--bg-base, #09090b)' }}>
      <style>{`
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 1080px) {
          .cert-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 600px) {
          .cert-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .cert-card-interactive {
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.32s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.32s ease,
                      background-color 0.32s ease;
        }
        .cert-card-interactive:hover {
          transform: translateY(-7px) !important;
          border-color: var(--accent, #EF4444) !important;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.75), 0 0 24px -2px var(--accent-glow, rgba(239, 68, 68, 0.32)) !important;
        }
        .cert-card-interactive:hover .cert-preview-img {
          transform: scale(1.06) !important;
        }
        .cert-card-interactive:hover .cert-arrow-icon {
          transform: translate(2px, -2px) !important;
          color: var(--accent, #EF4444) !important;
        }
        .cert-card-interactive:hover .cert-card-title {
          color: var(--accent, #EF4444) !important;
        }
      `}</style>

      <div className="container" ref={ref}>
        {/* Section Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>🏆</span>
            <span
              style={{
                color: 'var(--accent, #EF4444)',
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
              color: 'var(--text-primary, #ffffff)',
              lineHeight: 1.15,
              marginBottom: '0.75rem',
            }}
          >
            Recognition &amp; Credentials
          </h2>

          {/* Subtitle */}
          <p
            style={{
              color: 'var(--text-secondary, #a1a1aa)',
              fontSize: '0.96rem',
              margin: 0,
            }}
          >
            The actual certificates — click any card to view it full size.
          </p>
        </div>

        {/* Filter Pills */}
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
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isActive
                    ? '1px solid rgba(255, 255, 255, 0.16)'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '9999px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary, #ffffff)' : 'var(--text-secondary, #a1a1aa)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.22s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'var(--text-primary, #ffffff)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.color = 'var(--text-secondary, #a1a1aa)';
                  }
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    color: isActive ? 'var(--accent, #EF4444)' : '#71717a',
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

        {/* Loading state skeleton */}
        {loading ? (
          <div className="cert-grid">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 310,
                  borderRadius: '16px',
                  background: 'var(--bg-elevated, #18181b)',
                  border: '1px solid var(--border, #27272a)',
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        ) : (
          /* Cards Grid */
          <motion.div layout className="cert-grid">
            <AnimatePresence>
              {filteredItems.map((cert, i) => (
                <motion.div
                  key={cert._id || i}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="cert-card-interactive"
                  onClick={() => setSelectedCert(cert)}
                  style={{
                    background: 'var(--bg-card, #121214)',
                    border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                    borderRadius: '16px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  {/* Window Mockup Frame */}
                  <div
                    style={{
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: '#18181b',
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
                    }}
                  >
                    {/* Window Header */}
                    <div
                      style={{
                        height: 30,
                        padding: '0 9px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#1a1a1e',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                      }}
                    >
                      {/* Left: 3 macOS dots + windowTitle */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
                        <span
                          style={{
                            fontSize: '0.67rem',
                            color: '#a1a1aa',
                            fontWeight: 500,
                            marginLeft: '0.45rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 140,
                          }}
                        >
                          {cert.windowTitle || cert.issuer}
                        </span>
                      </div>

                      {/* Right: Expand arrow */}
                      <ArrowUpRight
                        size={13}
                        className="cert-arrow-icon"
                        style={{
                          color: '#71717a',
                          transition: 'transform 0.25s ease, color 0.25s ease',
                          flexShrink: 0,
                        }}
                      />
                    </div>

                    {/* Window Image Preview */}
                    <div
                      style={{
                        height: 132,
                        position: 'relative',
                        background: '#09090b',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
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
                          display: 'block',
                          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />

                      {/* Overlay badge (bottom-left) */}
                      {cert.badge && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 7,
                            left: 7,
                            background: 'rgba(15, 15, 18, 0.88)',
                            backdropFilter: 'blur(6px)',
                            border: '1px solid rgba(239, 68, 68, 0.38)',
                            borderRadius: '4px',
                            padding: '2px 7px',
                            fontSize: '0.66rem',
                            fontWeight: 600,
                            color: 'var(--accent, #EF4444)',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.65)',
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
                  <div style={{ padding: '0.75rem 0.25rem 0.25rem 0.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Category Tag + Date Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        marginBottom: '0.42rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      {getCategoryIcon(cert.category)}
                      <span
                        style={{
                          color: 'var(--accent, #EF4444)',
                          fontSize: '0.67rem',
                          fontWeight: 700,
                          letterSpacing: '0.07em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {getCategoryLabel(cert.category)}
                      </span>
                      {cert.dateTag && (
                        <>
                          <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '0.7rem' }}>·</span>
                          <span style={{ color: '#71717a', fontSize: '0.72rem', fontWeight: 500 }}>
                            {cert.dateTag}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="cert-card-title"
                      title={cert.name}
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--text-primary, #ffffff)',
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
                        fontSize: '0.75rem',
                        color: '#a1a1aa',
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
                </motion.div>
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
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem',
              }}
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                style={{
                  background: '#141416',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  maxWidth: 820,
                  width: '100%',
                  maxHeight: '92vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px var(--accent-glow, rgba(239, 68, 68, 0.2))',
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
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    background: '#1a1a1e',
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      {getCategoryIcon(selectedCert.category)}
                      <span
                        style={{
                          color: 'var(--accent, #EF4444)',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          letterSpacing: '0.07em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {getCategoryLabel(selectedCert.category)}
                      </span>
                      {selectedCert.dateTag && (
                        <span style={{ color: '#71717a', fontSize: '0.72rem' }}>
                          · {selectedCert.dateTag}
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {selectedCert.name}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '0.2rem 0 0 0' }}>
                      {selectedCert.issuer}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a1a1aa',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#a1a1aa';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
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
                    background: '#0a0a0c',
                  }}
                >
                  {selectedCert.image ? (
                    <div
                      style={{
                        width: '100%',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        background: '#121214',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
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
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#71717a' }}>
                      No preview image available for this certificate.
                    </div>
                  )}

                  {selectedCert.description && (
                    <p
                      style={{
                        marginTop: '1rem',
                        fontSize: '0.85rem',
                        color: '#a1a1aa',
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
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    background: '#18181b',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {selectedCert.image && (
                      <a
                        href={getAssetUrl(selectedCert.image)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--accent, #EF4444)',
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
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    style={{
                      background: 'var(--accent, #EF4444)',
                      color: 'var(--accent-contrast, #ffffff)',
                      border: 'none',
                      padding: '0.45rem 1.15rem',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px var(--accent-glow, rgba(239, 68, 68, 0.35))',
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
