import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RSLogo from './RSLogo';

/**
 * EntryPreloader — Cinematic high-tech application entry reveal.
 * - Dynamic 0-100% digital progress counter with smooth quartic acceleration
 * - Ultra-smooth staggered character-by-character letter entrance with blur dissipation
 * - Glowing RSLogo monogram with pulsing ambient neon halo (proportionately enlarged for desktop)
 * - Animated terminal status ticker with crossfading state changes
 * - Hardware-accelerated shutter curtain wipe exit with laser scanner edge
 * - Skip support with [ESC] key or pill button
 */
export default function EntryPreloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Lock body scrolling during intro
    document.body.style.overflow = 'hidden';

    // Smooth digital counter progression over 1.65 seconds
    const startTime = performance.now();
    const duration = 1650;

    let animationFrameId;

    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Smooth custom ease-out curve for energetic launch and fluid landing
      const ease = 1 - Math.pow(1 - t, 3.4);
      const currentVal = Math.min(100, Math.round(ease * 100));

      setProgress(currentVal);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        // Hold on 100% briefly so user can appreciate completion, then trigger curtain wipe
        setTimeout(() => {
          setIsFinished(true);
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }, 380);
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
  const getStatusText = (pct) => {
    if (pct < 28) return 'Initializing environment...';
    if (pct < 65) return 'Loading tech stack & assets...';
    if (pct < 98) return 'Compiling portfolio systems...';
    return 'Ready · Welcome to My Portfolio';
  };

  const statusText = getStatusText(progress);

  // Letter animation variants
  const words = ['Ranjit', 'Sharma'];

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 28,
      scale: 0.85,
      filter: 'blur(10px)',
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        delay: 0.16 + i * 0.042,
        type: 'spring',
        damping: 15,
        stiffness: 115,
        mass: 0.6,
      },
    }),
  };

  const dotVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      filter: 'blur(6px)',
    },
    visible: {
      opacity: 1,
      scale: [0, 1.45, 1],
      filter: 'blur(0px)',
      transition: {
        delay: 0.74,
        duration: 0.42,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
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
              duration: 0.85,
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
          {/* Ambient Breathing Radial Accent Glow */}
          <motion.div
            aria-hidden="true"
            animate={{
              scale: [0.95, 1.08, 0.95],
              opacity: [0.7, 0.95, 0.7],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: 'clamp(460px, 50vw, 820px)',
              height: 'clamp(460px, 50vw, 820px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 68%)',
              pointerEvents: 'none',
              filter: 'blur(45px)',
              willChange: 'transform, opacity',
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
              top: 'clamp(1.25rem, 2.5vh, 2.2rem)',
              right: 'clamp(1.25rem, 3vw, 2.5rem)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.45rem 0.95rem',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all var(--transition-fast)',
              zIndex: 10,
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Skip</span>
            <span style={{ opacity: 0.65, fontSize: '0.68rem', fontFamily: 'monospace' }}>[ESC]</span>
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
              padding: '0 0.85rem',
              maxWidth: '96vw',
              width: '100%',
            }}
          >
            {/* Glowing Monogram Emblem — Enlarged for Desktop */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{
                marginBottom: 'clamp(1.25rem, 2.5vh, 2rem)',
                filter: 'drop-shadow(0 0 28px var(--accent-glow)) drop-shadow(0 0 8px var(--accent))',
                willChange: 'transform, opacity, filter',
              }}
            >
              <RSLogo height={110} color="var(--accent)" glow className="preloader-rs-logo" />
            </motion.div>

            {/* Smooth Staggered Name Reveal */}
            <div style={{ marginBottom: 'clamp(0.2rem, 0.6vh, 0.4rem)' }}>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
                  fontWeight: 850,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.025em',
                  margin: 0,
                  lineHeight: 1.15,
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {words.map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    style={{
                      display: 'inline-flex',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {word.split('').map((char, charIdx) => {
                      const totalIndex = wordIdx === 0 ? charIdx : 6 + charIdx;
                      return (
                        <motion.span
                          key={charIdx}
                          custom={totalIndex}
                          variants={letterVariants}
                          initial="hidden"
                          animate="visible"
                          style={{
                            display: 'inline-block',
                            willChange: 'transform, opacity, filter',
                          }}
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                    {wordIdx < words.length - 1 && (
                      <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
                    )}
                  </span>
                ))}
                <motion.span
                  variants={dotVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: 'inline-block',
                    color: 'var(--accent)',
                    willChange: 'transform, opacity',
                  }}
                >
                  .
                </motion.span>
              </h1>
            </div>

            {/* Animated Tracking Subtitle */}
            <motion.p
              initial={{
                opacity: 0,
                y: 12,
                filter: 'blur(6px)',
                letterSpacing: '0.08em',
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                letterSpacing: 'clamp(0.16em, 0.4vw, 0.26em)',
              }}
              transition={{
                duration: 0.75,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontSize: 'clamp(0.88rem, 1.35vw, 1.15rem)',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                margin: '0 0 clamp(2rem, 3.8vh, 3rem) 0',
                willChange: 'transform, opacity, filter, letter-spacing',
              }}
            >
              Software Engineer
            </motion.p>

            {/* Enlarged Progress Bar Container */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 'min(92vw, clamp(280px, 34vw, 460px))',
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {/* Progress Track */}
              <div
                style={{
                  width: '100%',
                  height: 5,
                  background: 'var(--bg-elevated)',
                  borderRadius: 9999,
                  position: 'relative',
                  border: '1px solid var(--border)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--accent) 0%, #ffffff 100%)',
                    boxShadow: '0 0 16px var(--accent), 0 0 32px var(--accent-glow)',
                    borderRadius: 9999,
                    transition: 'width 0.05s linear',
                    position: 'relative',
                  }}
                />
              </div>

              {/* Status and Percentage Row — Single line fit on all screens */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.4rem',
                  fontSize: 'clamp(0.68rem, 2vw, 0.92rem)',
                  fontFamily: 'monospace',
                  fontVariantNumeric: 'tabular-nums',
                  minHeight: '1.4em',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={statusText}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      style={{
                        color: progress === 100 ? 'var(--accent)' : 'var(--text-muted)',
                        letterSpacing: '0.01em',
                        fontWeight: progress === 100 ? 700 : 500,
                        whiteSpace: 'nowrap',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {statusText}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span
                  style={{
                    color: 'var(--accent)',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textShadow: '0 0 12px var(--accent-glow)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Accent Scanner Line that travels with the curtain wipe */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: 'var(--accent)',
              boxShadow: '0 0 20px var(--accent), 0 0 40px var(--accent-glow)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
