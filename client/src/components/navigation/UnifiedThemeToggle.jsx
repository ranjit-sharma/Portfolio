import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Moon, Sun, Check, Sparkles, Palette } from 'lucide-react';
import ThemeSwitch from './ThemeSwitch';

export default function UnifiedThemeToggle({ align = 'right' }) {
  const { isDark, colorTheme, setColorTheme, availableColors } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const currentColor = availableColors.find((c) => c.id === colorTheme) || availableColors[0];

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Theme Icon Button */}
      <button
        id="unified-theme-btn"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Theme & Appearance (${isDark ? 'Dark' : 'Light'} mode, ${currentColor.name} theme)`}
        title={`Theme: ${currentColor.name} (${isDark ? 'Dark' : 'Light'})`}
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '50%',
          padding: '0.45rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
          transition: 'all var(--transition-fast)',
          width: 38,
          height: 38,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.boxShadow = '0 0 12px var(--accent-glow)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Palette size={19} />
      </button>

      {/* Unified Popover Menu */}
      {open && (
        <div
          role="dialog"
          aria-label="Theme and Appearance Settings"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            [align === 'left' ? 'left' : 'right']: 0,
            zIndex: 1100,
            width: 250,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            boxShadow: '0 12px 36px var(--shadow-md), 0 0 24px var(--accent-glow)',
            animation: 'fadeInUp 0.15s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.85rem',
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--accent)' }} />
            <span>Theme & Appearance</span>
          </div>

          {/* Section 1: Dark / Light Mode Switch */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
              background: 'var(--bg-elevated)',
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              {isDark ? (
                <Moon size={15} style={{ color: 'var(--accent)' }} />
              ) : (
                <Sun size={15} style={{ color: '#F59E0B' }} />
              )}
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <ThemeSwitch />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', margin: '0.75rem 0' }} />

          {/* Section 2: Accent Colors (6 Modes) */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                }}
              >
                Accent Color
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
                {currentColor.name}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.45rem',
              }}
            >
              {availableColors.map((col) => {
                const isSelected = col.id === colorTheme;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      setColorTheme(col.id);
                    }}
                    title={col.name}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.45rem 0.2rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                      border: `1.5px solid ${isSelected ? col.preview : 'var(--border)'}`,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = col.preview;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 14px ${col.preview}35`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isSelected ? col.preview : 'var(--border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: col.preview,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSelected ? `0 0 10px ${col.preview}` : 'none',
                        color:
                          col.id === 'amber' || col.id === 'lime' || col.id === 'emerald' || col.id === 'cyan'
                            ? '#0B0D0C'
                            : '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                      }}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      {col.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
