import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

/**
 * Section heading with animated underline accent.
 */
export function SectionHeading({ eyebrow, title, subtitle, centered = false }) {
  const { ref, inView } = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`mb-16 ${centered ? 'text-center' : ''}`}
    >
      {eyebrow && (
        <span
          style={{
            color: 'var(--accent)',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.5rem',
          }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: subtitle ? '0.75rem' : 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            maxWidth: '48ch',
            margin: centered ? '0 auto' : 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/**
 * Badge / chip component.
 */
export function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem 0.65rem',
    borderRadius: 'var(--radius-pill)',
    fontSize: '0.78rem',
    fontWeight: 500,
    transition: 'all var(--transition-fast)',
    ...(variant === 'accent'
      ? { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
      : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }),
  };

  return (
    <span style={styles} className={className}>
      {children}
    </span>
  );
}

/**
 * Card wrapper.
 */
export function Card({ children, className = '', style = {}, hover = true, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-base)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      className={`${hover ? 'card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Button component.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  target,
  rel,
  type = 'button',
  disabled = false,
  className = '',
  icon,
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--transition-fast)',
    textDecoration: 'none',
    lineHeight: 1,
    fontFamily: 'inherit',
    fontSize: size === 'sm' ? '0.82rem' : size === 'lg' ? '0.98rem' : '0.88rem',
    padding:
      size === 'sm'
        ? '0.45rem 0.95rem'
        : size === 'lg'
        ? '0.85rem 1.75rem'
        : '0.65rem 1.35rem',
  };

  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--accent-contrast)',
      borderColor: 'var(--accent)',
      boxShadow: '0 2px 8px var(--accent-glow)',
    },
    secondary: {
      background: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      borderColor: 'transparent',
    },
    outline: {
      background: 'transparent',
      color: 'var(--accent)',
      borderColor: 'var(--accent)',
    },
  };

  const combined = { ...base, ...variants[variant] };

  const handleMouseEnter = (e) => {
    if (disabled) return;
    if (variant === 'primary') {
      e.currentTarget.style.background = 'var(--accent-hover)';
      e.currentTarget.style.borderColor = 'var(--accent-hover)';
      e.currentTarget.style.boxShadow = '0 0 18px var(--accent-glow)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    } else if (variant === 'secondary') {
      e.currentTarget.style.borderColor = 'var(--border-strong)';
      e.currentTarget.style.background = 'var(--bg-hover)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    } else if (variant === 'outline') {
      e.currentTarget.style.background = 'var(--accent-dim)';
      e.currentTarget.style.boxShadow = '0 0 16px var(--accent-glow)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    } else if (variant === 'ghost') {
      e.currentTarget.style.color = 'var(--text-primary)';
      e.currentTarget.style.background = 'var(--bg-hover)';
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'translateY(0)';
    if (variant === 'primary') {
      e.currentTarget.style.background = 'var(--accent)';
      e.currentTarget.style.borderColor = 'var(--accent)';
      e.currentTarget.style.boxShadow = '0 2px 8px var(--accent-glow)';
    } else if (variant === 'secondary') {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.background = 'var(--bg-elevated)';
    } else if (variant === 'outline') {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.boxShadow = 'none';
    } else if (variant === 'ghost') {
      e.currentTarget.style.color = 'var(--text-secondary)';
      e.currentTarget.style.background = 'transparent';
    }
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        style={combined}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={combined}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon}
      {children}
    </button>
  );
}

/**
 * Spinner.
 */
export function Spinner({ size = 20, color = 'var(--accent)' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: 'spin 0.8s linear infinite' }}
      aria-label="Loading"
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

/**
 * Skeleton loading card.
 */
export function SkeletonCard({ height = 200 }) {
  return (
    <div
      style={{
        height,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

export { default as SkillIcon } from './SkillIcon';
export { default as LeetCodeIcon } from './LeetCodeIcon';
export { default as RSLogo } from './RSLogo';
export { default as AnimatedCursor } from './AnimatedCursor';
export { default as EntryPreloader } from './EntryPreloader';


