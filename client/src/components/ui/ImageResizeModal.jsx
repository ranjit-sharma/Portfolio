import { useState, useEffect, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Check, X, Move, Sparkles } from 'lucide-react';

const CANVAS_SIZE = 512; // High-resolution internal canvas
const DISPLAY_SIZE = 280; // Rendered CSS size on screen

export default function ImageResizeModal({
  isOpen,
  imageFile,
  title = 'Resize & Position Image',
  shape = 'squircle', // 'circle' | 'squircle' | 'square'
  defaultFit = 'contain', // 'contain' (logo) | 'cover' (avatar)
  onClose,
  onConfirm,
  uploading = false,
}) {
  const [imageObj, setImageObj] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 }); // In canvas coords (0 to 512)
  const [bgColor, setBgColor] = useState(defaultFit === 'contain' ? '#ffffff' : 'transparent');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Load image object from File
  useEffect(() => {
    if (!imageFile) {
      setImageObj(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    const img = new Image();
    img.onload = () => {
      setImageObj(img);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setBgColor(defaultFit === 'contain' ? '#ffffff' : 'transparent');
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [imageFile, defaultFit]);

  // Base scale calculation in 512x512 coordinates
  const getBaseScale = useCallback(
    (fitMode) => {
      if (!imageObj) return 1;
      const nw = imageObj.naturalWidth || imageObj.width;
      const nh = imageObj.naturalHeight || imageObj.height;
      if (fitMode === 'contain') {
        // Safe 12% padding inside 512x512 canvas for logos
        return (CANVAS_SIZE * 0.82) / Math.max(nw, nh);
      }
      // Fill the entire 512x512 canvas (cover mode for avatar)
      return Math.max(CANVAS_SIZE / nw, CANVAS_SIZE / nh);
    },
    [imageObj]
  );

  const currentScale = (imageObj ? getBaseScale(defaultFit) : 1) * zoom;

  // Render on internal 512x512 canvas
  useEffect(() => {
    if (!canvasRef.current || !imageObj) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Background fill
    if (bgColor && bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const nw = imageObj.naturalWidth || imageObj.width;
    const nh = imageObj.naturalHeight || imageObj.height;
    const drawW = nw * currentScale;
    const drawH = nh * currentScale;
    const drawX = (CANVAS_SIZE - drawW) / 2 + pan.x;
    const drawY = (CANVAS_SIZE - drawH) / 2 + pan.y;

    ctx.drawImage(imageObj, drawX, drawY, drawW, drawH);
  }, [imageObj, currentScale, pan, bgColor]);

  // Global window listeners for drag so cursor can leave box smoothly
  useEffect(() => {
    if (!isDragging) return;

    const scaleFactor = CANVAS_SIZE / DISPLAY_SIZE;

    const handleMouseMove = (e) => {
      const dx = (e.clientX - dragStartRef.current.x) * scaleFactor;
      const dy = (e.clientY - dragStartRef.current.y) * scaleFactor;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      const dx = (e.touches[0].clientX - dragStartRef.current.x) * scaleFactor;
      const dy = (e.touches[0].clientY - dragStartRef.current.y) * scaleFactor;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    };

    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => Math.max(0.15, Math.min(4.0, +(z + delta).toFixed(2))));
  };

  // Direct export from canvasRef (100% exact match)
  const handleApply = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const fileName = (imageFile?.name || 'image').replace(/\.[^/.]+$/, '') + '-resized.png';
        const file = new File([blob], fileName, { type: 'image/png' });
        onConfirm(file);
      },
      'image/png',
      0.95
    );
  };

  if (!isOpen || !imageFile) return null;

  const borderRadiusCss =
    shape === 'circle' ? '50%' : shape === 'squircle' ? '28px' : '12px';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !uploading) onClose();
      }}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: 440,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fade-scale-in 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: uploading ? 'not-allowed' : 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {/* Interactive Viewport (Displays high-res canvas at 280px) */}
          <div
            style={{
              position: 'relative',
              width: DISPLAY_SIZE,
              height: DISPLAY_SIZE,
              borderRadius: borderRadiusCss,
              overflow: 'hidden',
              boxShadow: '0 0 0 3px var(--accent), 0 12px 36px rgba(0, 0, 0, 0.45)',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              touchAction: 'none',
              background:
                bgColor === 'transparent'
                  ? 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 16px 16px'
                  : bgColor,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onWheel={handleWheel}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />

            {/* Drag hint overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                background: 'rgba(0, 0, 0, 0.65)',
                color: '#fff',
                borderRadius: '6px',
                padding: '4px 7px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                pointerEvents: 'none',
              }}
            >
              <Move size={12} /> Drag to pan
            </div>
          </div>

          {/* Zoom Slider */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span>Zoom &amp; Scale</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{Math.round(zoom * 100)}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.15, +(z - 0.1).toFixed(2)))}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.02"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  accentColor: 'var(--accent)',
                  cursor: 'pointer',
                }}
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3.5, +(z + 0.1).toFixed(2)))}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} /> Center &amp; Reset
            </button>

            <button
              type="button"
              onClick={() => {
                if (!imageObj) return;
                const fitScale = (CANVAS_SIZE * 0.82) / Math.max(imageObj.naturalWidth, imageObj.naturalHeight);
                const base = getBaseScale(defaultFit);
                setZoom(+(fitScale / base).toFixed(2));
                setPan({ x: 0, y: 0 });
              }}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              <Minimize2 size={13} /> Fit Whole Logo
            </button>

            <button
              type="button"
              onClick={() => {
                if (!imageObj) return;
                const coverScale = Math.max(CANVAS_SIZE / imageObj.naturalWidth, CANVAS_SIZE / imageObj.naturalHeight);
                const base = getBaseScale(defaultFit);
                setZoom(+(coverScale / base).toFixed(2));
                setPan({ x: 0, y: 0 });
              }}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              <Maximize2 size={13} /> Fill View
            </button>
          </div>

          {/* Background Options */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span>Tile Background:</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setBgColor('#ffffff')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: bgColor === '#ffffff' ? 'var(--accent)' : 'var(--bg-elevated)',
                  color: bgColor === '#ffffff' ? 'var(--accent-contrast)' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                White
              </button>
              <button
                type="button"
                onClick={() => setBgColor('transparent')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: bgColor === 'transparent' ? 'var(--accent)' : 'var(--bg-elevated)',
                  color: bgColor === 'transparent' ? 'var(--accent-contrast)' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                Transparent
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.65rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            style={{
              padding: '0.55rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={uploading}
            style={{
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: 'var(--accent)',
              color: 'var(--accent-contrast)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px var(--accent-glow)',
            }}
          >
            {uploading ? 'Uploading...' : <><Check size={16} /> Apply &amp; Save Photo</>}
          </button>
        </div>
      </div>
    </div>
  );
}
