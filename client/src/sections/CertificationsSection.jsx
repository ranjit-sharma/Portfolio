import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkeletonCard } from '../components/ui/index';
import api from '../services/api';

const FALLBACK_CERTS = [
  {
    _id: '1',
    name: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    issuer: 'Oracle',
    issueDate: '2025-01-01',
    credentialUrl: '',
    image: '/uploads/Screenshot_2026-10-21_132422-1792570047406-5572.png',
    description: 'Certification in generative AI fundamentals, OCI AI services, and practical AI solution development.',
  },
  {
    _id: '2',
    name: 'TCS iON Technical Communication',
    issuer: 'TCS iON',
    issueDate: '',
    credentialUrl: '',
    description: 'Technical writing and communication skills for technology professionals.',
  },
  {
    _id: '3',
    name: 'Geo-data Sharing and Cyber Security',
    issuer: 'ISRO / IIRS',
    issueDate: '',
    credentialUrl: '',
    description: 'Online course covering geospatial data handling, sharing protocols, and cyber security practices.',
  },
  {
    _id: '4',
    name: 'Smart India Hackathon',
    issuer: 'Ministry of Education, Government of India',
    issueDate: '',
    credentialUrl: '',
    description: 'Participated in the Smart India Hackathon, a national initiative to foster innovation among students.',
  },
];

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function CertificationsSection() {
  const { ref, inView } = useInView();
  const [certs, setCerts] = useState(null);
  const [loading, setLoading] = useState(true);
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
        setCerts(data && data.length > 0 ? data : FALLBACK_CERTS);
      })
      .catch(() => setCerts(FALLBACK_CERTS))
      .finally(() => setLoading(false));
  }, []);

  const items = certs || FALLBACK_CERTS;

  return (
    <section id="certifications" className="section-padding">
      <div className="container">
        <SectionHeading
          eyebrow="Certifications"
          title="Certifications & Achievements"
          subtitle="Credentials and recognitions earned along the way"
        />

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} height={160} />)}
          </div>
        ) : (
          <div
            ref={ref}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {items.map((cert, i) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                  e.currentTarget.style.boxShadow = '0 8px 24px var(--accent-glow)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    {cert.issuer}
                  </span>
                  {formatDate(cert.issueDate) && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDate(cert.issueDate)}
                    </span>
                  )}
                </div>

                {/* Certificate name */}
                <h3 style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.4, color: 'var(--text-primary)' }}>
                  {cert.name}
                </h3>

                {/* Certificate Preview Image if uploaded */}
                {cert.image && (
                  <div
                    onClick={() => setSelectedCert(cert)}
                    style={{
                      position: 'relative',
                      height: 160,
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-elevated)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                    }}
                    title="Click to view certificate"
                  >
                    {cert.image.toLowerCase().endsWith('.pdf') ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                        <span style={{ fontSize: '2rem' }}>📄</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)' }}>View Certificate PDF</span>
                      </div>
                    ) : (
                      <img
                        src={cert.image}
                        alt={cert.name}
                        onError={(e) => {
                          if (!e.currentTarget.src.includes(':5000')) {
                            e.currentTarget.src = `http://localhost:5000${cert.image}`;
                          }
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                    >
                      <span
                        style={{
                          background: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          padding: '0.35rem 0.85rem',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          border: '1px solid var(--border)',
                        }}
                      >
                        View Certificate
                      </span>
                    </div>
                  </div>
                )}

                {/* Description */}
                {cert.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: 1.6, flex: 1 }}>
                    {cert.description}
                  </p>
                )}

                {/* Action links */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
                  {cert.image && (
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: 0,
                        fontFamily: 'inherit',
                      }}
                    >
                      View Certificate →
                    </button>
                  )}

                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        transition: 'color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      Verify Credential →
                    </a>
                  ) : !cert.image && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Credential not publicly verifiable
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
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
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  maxWidth: 720,
                  width: '100%',
                  maxHeight: '90vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedCert.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {selectedCert.issuer} {selectedCert.issueDate && `· ${formatDate(selectedCert.issueDate)}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCert(null)}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedCert.image ? (
                    selectedCert.image.toLowerCase().endsWith('.pdf') ? (
                      <iframe
                        src={selectedCert.image}
                        title={selectedCert.name}
                        style={{ width: '100%', height: 480, border: 'none', borderRadius: 'var(--radius-md)' }}
                      />
                    ) : (
                      <img
                        src={selectedCert.image}
                        alt={selectedCert.name}
                        onError={(e) => {
                          if (!e.currentTarget.src.includes(':5000')) {
                            e.currentTarget.src = `http://localhost:5000${selectedCert.image}`;
                          }
                        }}
                        style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
                      />
                    )
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No preview image uploaded for this certificate.
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {selectedCert.image && (
                      <a
                        href={selectedCert.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--accent)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        Open Original File ↗
                      </a>
                    )}
                    {selectedCert.credentialUrl && (
                      <a
                        href={selectedCert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}
                      >
                        Verify Credential →
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedCert(null)}
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--accent-contrast)',
                      border: 'none',
                      padding: '0.45rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
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
