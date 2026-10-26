import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { EntryPreloader } from '../components/ui';

// Positions are relative to the viewport; the layer stays put while content scrolls over it
const BG_SNIPPETS = [
  { text: '$ git commit -m "ship it"', top: '14%', left: '3%', delay: '0s' },
  { text: 'GET /api/v1/projects → 200 OK', top: '9%', left: '42%', delay: '-3s' },
  { text: 'docker compose up -d', top: '22%', left: '74%', delay: '-6s' },
  { text: 'O(n log n)', top: '44%', left: '91%', delay: '-4s' },
  { text: 'async / await', top: '58%', left: '2%', delay: '-2s' },
  { text: 'npm run build ✓', top: '86%', left: '30%', delay: '-5s' },
  { text: 'SELECT * FROM skills;', top: '76%', left: '82%', delay: '-7s' },
];

export default function RootLayout() {
  const [introDone, setIntroDone] = useState(false);
  // Stable callback: EntryPreloader's effect depends on it and would restart otherwise
  const handleIntroDone = useCallback(() => setIntroDone(true), []);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <>
      <EntryPreloader onComplete={handleIntroDone} />
      {/* Site-wide background: drifting aurora and engineering snippets (styles in index.css) */}
      <div aria-hidden="true" className="site-bg">
        <div className="site-bg-blob site-bg-blob-1" />
        <div className="site-bg-blob site-bg-blob-2" />
        {BG_SNIPPETS.map((s) => (
          <span
            key={s.text}
            className="site-bg-snippet"
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          >
            {s.text}
          </span>
        ))}
      </div>
      {/* Scroll progress bar, above the navbar */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'var(--accent)',
          boxShadow: '0 0 10px var(--accent-glow)',
          transformOrigin: '0 50%',
          scaleX: progress,
          zIndex: 1002,
        }}
      />
      <Navbar />
      <main style={{ paddingTop: 'var(--navbar-height)' }}>
        <Outlet context={{ introDone }} />
      </main>
      <Footer />
    </>
  );
}
