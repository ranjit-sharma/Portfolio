import { useState, useEffect, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Check, X, Move, Sparkles } from 'lucide-react';

const BOX_SIZE = 280;
const OUTPUT_SIZE = 512;

export default function ImageResizeModal({
  isOpen,
  imageFile,
  title = 'Resize & Adjust Image',
  shape = 'circle', // 'circle' | 'squircle' | 'square'
  defaultFit = 'cover', // 'cover' (avatar) | 'contain' (logo)
  onClose,
  onConfirm,
  uploading = false,
}) {
  const [imageObj, setImageObj] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
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

  // Compute base scale to fit or cover
  const getBaseScale = useCallback(
    (fitMode) => {
      if (!imageObj) return 1;
      const nw = imageObj.naturalWidth || imageObj.width;
      const nh = imageObj.naturalHeight || imageObj.height;
      if (fitMode === 'contain') {
        // Fit inside box with a safe 10% inner margin for logos
        return (BOX_SIZE * 0.85) / Math.max(nw, nh);
      }
      // Cover the entire box
      return Math.max(BOX_SIZE / nw, BOX_SIZE / nh);
    },
    [imageObj]
  );

  const currentScale = (imageObj ? getBaseScale(defaultFit) : 1) * zoom;

  // Render on preview canvas
  useEffect(() => {
    if (!canvasRef.current || !imageObj) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, BOX_SIZE, BOX_SIZE);

    // Background fill if specified (e.g., white for logos)
    if (bgColor && bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, BOX_SIZE, BOX_SIZE);
    }

    const nw = imageObj.naturalWidth || imageObj.width;
    const nh = imageObj.naturalHeight || imageObj.height;
    const drawW = nw * currentScale;
    const drawH = nh * currentScale;
    const drawX = (BOX_SIZE - drawW) / 2 + pan.x;
    const drawY = (BOX_SIZE - drawH) / 2 + pan.y;

    ctx.drawImage(imageObj, drawX, drawY, drawW, drawH);
  }, [imageObj, currentScale, pan, bgColor]);

  // Mouse / Touch Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Generate cropped/resized File
  const handleApply = () => {
    if (!imageObj) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = OUTPUT_SIZE;
    exportCanvas.height = OUTPUT_SIZE;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (bgColor && bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    }

    const exportRatio = OUTPUT_SIZE / BOX_SIZE;
    const nw = imageObj.naturalWidth || imageObj.width;
    const nh = imageObj.naturalHeight || imageObj.height;
    const drawW = nw * currentScale * exportRatio;
    const drawH = nh * currentScale * exportRatio;
    const drawX = (OUTPUT_SIZE - drawW) / 2 + pan.x * exportRatio;
    const drawY = (OUTPUT_SIZE - drawH) / 2 + pan.y * exportRatio;

    ctx.drawImage(imageObj, drawX, drawY, drawW, drawH);

    exportCanvas.toBlob(
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

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
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
          {/* Interactive Crop Viewport */}
          <div
            style={{
              position: 'relative',
              width: BOX_SIZE,
              height: BOX_SIZE,
              borderRadius: shape === 'circle' ? '50%' : shape === 'squircle' ? '24px' : '12px',
              overflow: 'hidden',
              boxShadow: '0 0 0 4px var(--accent-dim), 0 8px 30px rgba(0, 0, 0, 0.4)',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              touchAction: 'none',
              background: bgColor === 'transparent' ? 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 16px 16px' : bgColor,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <canvas ref={canvasRef} width={BOX_SIZE} height={BOX_SIZE} style={{ display: 'block', width: '100%', height: '100%' }} />

            {/* Drag hint overlay icon */}
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                background: 'rgba(0, 0, 0, 0.55)',
                color: '#fff',
                borderRadius: '6px',
                padding: '4px 6px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                pointerEvents: 'none',
              }}
            >
              <Move size={12} /> Drag to position
            </div>
          </div>

          {/* Zoom Slider */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span>Zoom &amp; Scale</span>
              <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{Math.round(zoom * 100)}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.2, +(z - 0.1).toFixed(2)))}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ZoomOut size={15} />
              </button>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
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
                onClick={() => setZoom((z) => Math.min(3.0, +(z + 0.1).toFixed(2)))}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ZoomIn size={15} />
              </button>
            </div>
          </div>

          {/* Quick Fit Controls */}
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
              <RotateCcw size={13} /> Reset Fit
            </button>

            <button
              type="button"
              onClick={() => {
                if (!imageObj) return;
                const fitScale = (BOX_SIZE * 0.85) / Math.max(imageObj.naturalWidth, imageObj.naturalHeight);
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
                const coverScale = Math.max(BOX_SIZE / imageObj.naturalWidth, BOX_SIZE / imageObj.naturalHeight);
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

          {/* Background Toggle (especially helpful for company logos) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span>Background Fill:</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setBgColor('#ffffff')}
                style={{
                  padding: '3px 8px',
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
                  padding: '3px 8px',
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
              padding: '0.55rem 1.2rem',
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
            {uploading ? 'Uploading...' : <><Check size={16} /> Apply &amp; Upload</>}
          </button>
        </div>
      </div>
    </div>
  );
}
