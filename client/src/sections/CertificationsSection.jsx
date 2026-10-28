import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Trophy, Briefcase, CheckCircle2, X, ExternalLink, Award, FileText, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/index';
import api from '../services/api';
import { getAssetUrl } from '../utils/assetUrl';

const isPdf = (cert) => !!cert.image && cert.image.toLowerCase().endsWith('.pdf');
const isImage = (cert) => !!cert.image && !isPdf(cert);

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
  const reduceMotion = useReducedMotion();

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
        const data = res.data?.data;
        setCerts(Array.isArray(data) ? data : []);
      })
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  const items = Array.isArray(certs) ? certs : [];

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


  const getCategoryIcon = (category, size = 12) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('intern')) {
      return <Briefcase size={size} strokeWidth={2.4} style={{ color: 'var(--accent)' }} />;
    }
    if (cat.includes('compet') || cat.includes('hackathon')) {
      return <Trophy size={size} strokeWidth={2.4} style={{ color: 'var(--accent)' }} />;
    }
    return <CheckCircle2 size={size} strokeWidth={2.4} style={{ color: 'var(--accent)' }} />;
  };

  const getCategoryLabel = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('intern')) return 'INTERNSHIP';
    if (cat.includes('compet') || cat.includes('hackathon')) return 'COMPETITION';
    return 'CERTIFICATION';
  };

  const formatIssueDate = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const formatFullIssueDate = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <section id="certifications" className="section-padding">
      <style>{`
        /* Credential cards: framed-print style */
        .cert-cards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .cert-card {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          width: 100%;
          height: 100%;
          padding: 0.7rem 0.7rem 1rem;
          font: inherit;
          text-align: left;
          color: inherit;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 1rem;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: border-color var(--transition-card), box-shadow var(--transition-card), transform var(--transition-card);
        }
        .cert-card:hover,
        .cert-card:focus-visible {
          border-color: var(--accent-border);
          box-shadow: 0 20px 40px -18px var(--accent-glow), var(--shadow-md);
          transform: translateY(-4px);
        }
        .cert-card:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        /* Inset frame that shows the whole certificate */
        .cert-card-thumb {
          position: relative;
          aspect-ratio: 4 / 3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.65rem;
          border-radius: 0.75rem;
          background:
            radial-gradient(circle at 50% 40%, var(--accent-dim) 0%, transparent 70%),
            var(--bg-elevated);
          box-shadow: inset 0 0 0 1px var(--border), inset 0 8px 18px -10px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }
        .cert-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          border-radius: 4px;
          box-shadow: 0 10px 22px -10px rgba(0, 0, 0, 0.7);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cert-card:hover .cert-card-thumb img {
          transform: translateY(-3px) scale(1.03);
        }
        .cert-card-doc,
        .cert-card-pdf {
          position: absolute;
          inset: 0.65rem;
        }
        .cert-card-pdf {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--accent);
        }
        .cert-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 2px 8px;
          font-size: 0.64rem;
          font-weight: 700;
          color: var(--accent-contrast);
          background: var(--accent);
          border-radius: 6px;
          box-shadow: 0 4px 12px -4px var(--accent-glow);
        }
        .cert-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          flex: 1;
          min-width: 0;
          padding: 0 0.35rem;
        }
        .cert-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .cert-meta-date {
          font-weight: 500;
          letter-spacing: 0;
          text-transform: none;
          color: var(--text-muted);
        }
        .cert-card-title {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-size: 0.98rem;
          font-weight: 800;
          line-height: 1.35;
          color: var(--text-primary);
        }
        /* Footer row: issuer + round arrow button */
        .cert-card-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px dashed var(--border);
        }
        .cert-card-issuer {
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .cert-card-go {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--accent);
          border: 1px solid var(--accent-border);
          transition: background var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
        }
        .cert-card:hover .cert-card-go {
          color: var(--accent-contrast);
          background: var(--accent);
          transform: rotate(45deg);
        }

        /* Certificate viewer */
        .cert-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(10px);
        }
        .cert-modal {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          width: 100%;
          max-width: 1120px;
          max-height: 92vh;
          overflow: hidden;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 1rem;
          box-shadow: var(--shadow-lg), 0 0 60px -10px var(--accent-glow);
        }
        .cert-modal-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
          padding: 2rem;
          background:
            radial-gradient(circle at 50% 45%, var(--accent-dim) 0%, transparent 65%),
            var(--bg-base);
        }
        .cert-modal-img {
          display: block;
          max-width: 100%;
          max-height: calc(92vh - 4rem);
          object-fit: contain;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06);
        }
        .cert-modal-pdf {
          width: 100%;
          height: calc(92vh - 4rem);
          border: none;
          border-radius: 10px;
          background: #fff;
        }
        .cert-modal-doc {
          width: 100%;
          max-width: 640px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.7);
        }
        .cert-modal-side {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          padding: 1.75rem 1.6rem;
          overflow-y: auto;
          background: linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-surface) 70%);
          border-left: 1px solid var(--border);
        }
        .cert-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--text-secondary);
          background: var(--bg-hover);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
        }
        .cert-modal-close:hover,
        .cert-modal-close:focus-visible {
          color: var(--text-primary);
          border-color: var(--accent);
          transform: rotate(90deg);
        }
        .cert-modal-badge {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.75rem;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          border-radius: 9999px;
        }
        .cert-modal-title {
          margin: 0;
          padding-right: 2.5rem;
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }
        .cert-modal-facts {
          display: flex;
          flex-direction: column;
          margin: 0;
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }
        .cert-modal-facts > div {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.65rem 0.9rem;
          font-size: 0.84rem;
          background: var(--bg-card);
        }
        .cert-modal-facts > div + div {
          border-top: 1px solid var(--border);
        }
        .cert-modal-facts dt {
          color: var(--text-muted);
          font-weight: 600;
        }
        .cert-modal-facts dd {
          margin: 0;
          text-align: right;
          font-weight: 700;
          color: var(--text-primary);
        }
        .cert-modal-about h4 {
          margin: 0 0 0.4rem;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .cert-modal-about p {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.7;
          color: var(--text-secondary);
        }
        .cert-modal-actions {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-top: auto;
        }
        .cert-modal-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none;
          color: var(--text-primary);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 9999px;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
        }
        .cert-modal-btn:hover {
          border-color: var(--accent-border);
          box-shadow: 0 0 16px var(--accent-glow);
        }
        .cert-modal-btn-primary {
          color: var(--accent-contrast);
          background: var(--accent);
          border-color: var(--accent);
        }
        .cert-modal-btn-primary:hover {
          background: var(--accent-hover);
        }
        @media (max-width: 860px) {
          .cert-modal {
            grid-template-columns: minmax(0, 1fr);
            overflow-y: auto;
          }
          .cert-modal-stage {
            padding: 1rem;
          }
          .cert-modal-img {
            max-height: 55vh;
          }
          .cert-modal-pdf {
            height: 55vh;
          }
          .cert-modal-side {
            overflow: visible;
            border-left: none;
            border-top: 1px solid var(--border);
          }
        }
        @media (max-width: 1100px) {
          .cert-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        /* Phones: cards stick under the navbar and stack on top of each other while scrolling */
        @media (max-width: 600px) {
          .cert-cards {
            display: flex;
            flex-direction: column;
            padding-bottom: 1rem;
          }
          .cert-cards > li {
            position: sticky;
            top: calc(var(--navbar-height) + 1rem + var(--stack-i) * 14px);
            margin-bottom: 1.5rem;
          }
          .cert-cards > li:last-child {
            margin-bottom: 0;
          }
          .cert-card {
            box-shadow: 0 -10px 30px -12px rgba(0, 0, 0, 0.7), var(--shadow-md);
          }
        }
      `}</style>

      <div className="container" ref={ref}>
        <SectionHeading
          index="06"
          eyebrow="Achievements & Certifications"
          title="Recognition & Credentials"
          subtitle="The actual certificates — pick one from the list, or click the preview to view it full size."
        />

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
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
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
          <div className="cert-cards">
            {[0, 1, 2, 3].map((h) => (
              <div
                key={h}
                style={{
                  height: 380,
                  borderRadius: 'var(--radius-xl)',
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
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
              background: 'var(--bg-card)',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 520,
              margin: '0 auto',
            }}
          >
            <Award size={40} style={{ color: 'var(--accent)', margin: '0 auto 0.85rem', opacity: 0.85 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              No Credentials Available
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
              Credentials from database are currently unavailable. Ensure the database connection is active.
            </p>
          </div>
        ) : (
          /* Credential cards */
          <ul className="cert-cards">
            {filteredItems.map((cert, i) => (
              <motion.li
                key={cert._id || cert.name}
                style={{ '--stack-i': i, zIndex: i + 1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  className="cert-card card-spotlight"
                  onClick={() => setSelectedCert(cert)}
                  aria-label={`View certificate: ${cert.name}`}
                >
                  <span className="cert-card-thumb">
                    {isImage(cert) ? (
                      <img src={getAssetUrl(cert.image)} alt="" loading="lazy" />
                    ) : isPdf(cert) ? (
                      <span className="cert-card-pdf">
                        <FileText size={34} strokeWidth={1.6} />
                        PDF DOCUMENT
                      </span>
                    ) : (
                      <span className="cert-card-doc">
                        <CertificateDocPreview cert={cert} isModal={false} />
                      </span>
                    )}
                    {cert.badge && <span className="cert-badge">{cert.badge}</span>}
                  </span>

                  <span className="cert-card-body">
                    <span className="cert-meta">
                      {getCategoryIcon(cert.category)}
                      <span>{getCategoryLabel(cert.category)}</span>
                      {(() => {
                        const issueStr = formatIssueDate(cert.issueDate);
                        const tagStr = cert.dateTag || '';
                        if (issueStr && tagStr) {
                          if (tagStr.toLowerCase() === issueStr.toLowerCase() || tagStr === String(new Date(cert.issueDate).getFullYear())) {
                            return <span className="cert-meta-date">· {issueStr}</span>;
                          }
                          return (
                            <>
                              <span className="cert-meta-date">· {issueStr}</span>
                              <span className="cert-meta-date">· {tagStr}</span>
                            </>
                          );
                        }
                        if (issueStr) return <span className="cert-meta-date">· {issueStr}</span>;
                        if (tagStr) return <span className="cert-meta-date">· {tagStr}</span>;
                        return null;
                      })()}
                    </span>
                    <span className="cert-card-title">{cert.name}</span>
                    <span className="cert-card-foot">
                      <span className="cert-card-issuer">{cert.issuer}</span>
                      <span className="cert-card-go" aria-hidden="true">
                        <ArrowUpRight size={15} />
                      </span>
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        )}

        {/* Certificate Lightbox Modal */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cert-modal-title"
              className="cert-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                className="cert-modal"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Certificate stage */}
                <div className="cert-modal-stage">
                  {isPdf(selectedCert) ? (
                    <iframe src={getAssetUrl(selectedCert.image)} title={selectedCert.name} className="cert-modal-pdf" />
                  ) : isImage(selectedCert) ? (
                    <img src={getAssetUrl(selectedCert.image)} alt={selectedCert.name} className="cert-modal-img" />
                  ) : (
                    <div className="cert-modal-doc">
                      <CertificateDocPreview cert={selectedCert} isModal={true} />
                    </div>
                  )}
                </div>

                {/* Details panel */}
                <aside className="cert-modal-side">
                  <button
                    type="button"
                    className="cert-modal-close"
                    onClick={() => setSelectedCert(null)}
                    aria-label="Close certificate viewer"
                  >
                    <X size={17} />
                  </button>

                  <span className="cert-modal-badge">
                    {getCategoryIcon(selectedCert.category, 13)}
                    {getCategoryLabel(selectedCert.category)}
                  </span>
                  <h3 id="cert-modal-title" className="cert-modal-title">
                    {selectedCert.name}
                  </h3>

                  <dl className="cert-modal-facts">
                    <div>
                      <dt>Issued by</dt>
                      <dd>{selectedCert.issuer}</dd>
                    </div>
                    {selectedCert.issueDate && (
                      <div>
                        <dt>Issue Date</dt>
                        <dd>{formatFullIssueDate(selectedCert.issueDate)}</dd>
                      </div>
                    )}
                    {selectedCert.dateTag && (!selectedCert.issueDate || !selectedCert.dateTag.includes(String(new Date(selectedCert.issueDate).getFullYear()))) && (
                      <div>
                        <dt>Duration / Term</dt>
                        <dd>{selectedCert.dateTag}</dd>
                      </div>
                    )}
                    {selectedCert.badge && (
                      <div>
                        <dt>Status</dt>
                        <dd>{selectedCert.badge}</dd>
                      </div>
                    )}
                  </dl>

                  {selectedCert.description && (
                    <div className="cert-modal-about">
                      <h4>About this credential</h4>
                      <p>{selectedCert.description}</p>
                    </div>
                  )}

                  <div className="cert-modal-actions">
                    {selectedCert.image && (
                      <a
                        href={getAssetUrl(selectedCert.image)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-modal-btn cert-modal-btn-primary"
                      >
                        <ExternalLink size={15} aria-hidden="true" /> Open original file
                      </a>
                    )}
                    {selectedCert.credentialUrl && (
                      <a
                        href={selectedCert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-modal-btn"
                      >
                        <CheckCircle2 size={15} aria-hidden="true" /> Verify credential
                      </a>
                    )}
                  </div>
                </aside>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
