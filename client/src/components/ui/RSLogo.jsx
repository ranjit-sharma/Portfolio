import React from 'react';

/**
 * RSLogo — Stylized monogram symbol ("RS" for Ranjit Sharma).
 * Uses CSS mask-image so it dynamically inherits any color, CSS variable,
 * or gradient, perfectly supporting light and dark themes.
 *
 * @param {number} [size=28] - Target width in px (height scales proportionally at 408/580 ratio)
 * @param {number} [height] - Optional explicit height in px
 * @param {string} [color='currentColor'] - Fill color (e.g. 'var(--accent)', 'currentColor', '#fff')
 * @param {boolean} [glow=false] - Whether to apply an accent drop-shadow / glow
 * @param {string} [className=''] - Additional CSS classes
 * @param {object} [style={}] - Additional inline styles
 * @param {'mask'|'img'|'badge'} [variant='mask'] - Display variant
 */
export default function RSLogo({
  size = 28,
  height,
  width,
  color = 'currentColor',
  glow = false,
  className = '',
  style = {},
  variant = 'mask',
  alt = 'Ranjit Sharma monogram',
  ...props
}) {
  const computedWidth = width || (height ? Math.round(height * (580 / 408)) : size);
  const computedHeight = height || (width ? Math.round(width * (408 / 580)) : Math.round(size * (408 / 580)));

  if (variant === 'badge') {
    return (
      <div
        className={`rs-logo-badge ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: computedWidth + 14,
          height: computedHeight + 14,
          borderRadius: 'var(--radius-md, 10px)',
          background: 'var(--accent-dim, rgba(0, 214, 160, 0.1))',
          border: '1px solid var(--accent-border, rgba(0, 214, 160, 0.25))',
          boxShadow: glow ? '0 0 20px var(--accent-glow, rgba(0, 214, 160, 0.2))' : undefined,
          ...style,
        }}
        {...props}
      >
        <span
          role="img"
          aria-label={alt}
          style={{
            display: 'inline-block',
            width: computedWidth,
            height: computedHeight,
            backgroundColor: color === 'currentColor' ? 'var(--accent)' : color,
            WebkitMaskImage: 'url(/logo-rs.png)',
            maskImage: 'url(/logo-rs.png)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            filter: glow ? 'drop-shadow(0 0 8px var(--accent-glow))' : undefined,
          }}
        />
      </div>
    );
  }

  if (variant === 'img') {
    return (
      <img
        src="/logo-rs.png"
        alt={alt}
        width={computedWidth}
        height={computedHeight}
        className={`rs-logo ${className}`}
        style={{
          display: 'inline-block',
          width: computedWidth,
          height: computedHeight,
          objectFit: 'contain',
          verticalAlign: 'middle',
          filter: glow ? 'drop-shadow(0 0 8px var(--accent-glow))' : undefined,
          ...style,
        }}
        {...props}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt}
      className={`rs-logo ${className}`}
      style={{
        display: 'inline-block',
        width: computedWidth,
        height: computedHeight,
        backgroundColor: color,
        WebkitMaskImage: 'url(/logo-rs.png)',
        maskImage: 'url(/logo-rs.png)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        verticalAlign: 'middle',
        flexShrink: 0,
        filter: glow ? 'drop-shadow(0 0 8px var(--accent-glow))' : undefined,
        transition: 'background-color var(--transition-fast, 150ms ease), transform var(--transition-fast, 150ms ease)',
        ...style,
      }}
      {...props}
    />
  );
}
