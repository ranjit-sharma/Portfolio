import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RSLogo from './RSLogo';

/**
 * EntryPreloader — Cinematic high-tech application entry reveal.
 * - Dynamic 0-100% digital progress counter
 * - Glowing RSLogo monogram with pulsing neon halo
 * - Terminal status ticker
 * - Hardware-accelerated shutter curtain wipe exit
 * - Skip support with [ESC] key or button
 */
export default function EntryPreloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Lock body scrolling during intro
    document.body.style.overflow = 'hidden';

    // Fast digital counter curve from 0 to 100 in ~1.4 seconds
    const startTime = performance.now();
    const duration = 1400; // 1.4s

    let animationFrameId;

    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Ease-out expo curve for satisfying snappy acceleration
      const ease = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const currentVal = Math.round(ease * 100);

      setProgress(currentVal);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        // Hold on 100% briefly, then trigger exit curtain wipe
        setTimeout(() => {
          setIsFinished(true);
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }, 320);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    // Skip with Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFinished(true);
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  // Terminal status messages based on progress
  const getStatusText = () => {
    if (progress < 28) return 'Initializing environment...';
    if (progress < 65) return 'Loading tech stack & assets...';
    if (progress < 98) return 'Compiling portfolio systems...';
    return 'Ready · Welcome to Portfolio';
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="entry-preloader"
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            transition: {
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000000,
            background: 'var(--bg-base)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Radial Accent Glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
              pointerEvents: 'none',
              filter: 'blur(30px)',
              opacity: 0.8,
            }}
          />

          {/* Skip button top right */}
          <button
            type="button"
            onClick={() => {
              setIsFinished(true);
              document.body.style.overflow = '';
              if (onComplete) onComplete();
            }}
            style={{
              position: 'absolute',
              top: '1.75rem',
              right: '2rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.4rem 0.9rem',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all var(--transition-fast)',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <span>Skip</span>
            <span style={{ opacity: 0.6, fontSize: '0.65rem' }}>[ESC]</span>
          </button>

          {/* Center Card / Monogram */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            {/* Glowing Monogram Emblem */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                marginBottom: '1.25rem',
                filter: 'drop-shadow(0 0 24px var(--accent-glow)) drop-shadow(0 0 6px var(--accent))',
              }}
            >
              <RSLogo height={72} color="var(--accent)" glow />
            </motion.div>

            {/* Name & Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h1
                style={{
                  fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '0.25rem',
                }}
              >
                Ranjit Sharma<span style={{ color: 'var(--accent)' }}>.</span>
              </h1>
              <p
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '1.75rem',
                }}
              >
                Full-Stack Developer
              </p>
            </motion.div>

            {/* Progress Bar Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              style={{
                width: 240,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              {/* Progress Track */}
              <div
                style={{
                  width: '100%',
                  height: 3,
                  background: 'var(--bg-elevated)',
                  borderRadius: 9999,
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--accent)',
                    boxShadow: '0 0 12px var(--accent)',
                    borderRadius: 9999,
                    transition: 'width 0.06s linear',
                  }}
                />
              </div>

              {/* Status and Percentage Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                }}
              >
                <span
                  style={{
                    color: 'var(--text-muted)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {getStatusText()}
                </span>
                <span
                  style={{
                    color: 'var(--accent)',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Accent Scanner Line that travels with the curtain */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'var(--accent)',
              boxShadow: '0 0 16px var(--accent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
