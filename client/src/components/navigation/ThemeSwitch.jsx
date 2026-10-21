import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/**
 * ThemeSwitch — Sleek, interactive sliding toggle switch for Dark & Light modes.
 */
export default function ThemeSwitch({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-mode-switch"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className={`theme-switch ${className}`}
      style={{
        position: 'relative',
        width: 60,
        height: 32,
        borderRadius: 9999,
        background: isDark ? 'var(--bg-elevated)' : '#E2E8F0',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 7px',
        transition: 'background var(--transition-fast), border-color var(--transition-fast)',
        outline: 'none',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.boxShadow = '0 0 10px var(--accent-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Track Moon Icon */}
      <Moon
        size={13}
        style={{
          color: isDark ? 'transparent' : 'var(--text-muted)',
          transition: 'color var(--transition-fast)',
        }}
      />

      {/* Track Sun Icon */}
      <Sun
        size={13}
        style={{
          color: isDark ? 'var(--text-muted)' : 'transparent',
          transition: 'color var(--transition-fast)',
        }}
      />

      {/* Sliding Thumb Knob */}
      <motion.div
        animate={{ x: isDark ? 0 : 28 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{
          position: 'absolute',
          top: 3,
          left: 4,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: isDark ? 'var(--accent)' : '#FFFFFF',
          color: isDark ? '#0B0D0C' : '#F59E0B',
          boxShadow: isDark
            ? '0 0 10px var(--accent-glow), 0 2px 4px rgba(0,0,0,0.3)'
            : '0 2px 5px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isDark ? <Moon size={13} strokeWidth={2.5} /> : <Sun size={13} strokeWidth={2.5} />}
      </motion.div>
    </button>
  );
}
