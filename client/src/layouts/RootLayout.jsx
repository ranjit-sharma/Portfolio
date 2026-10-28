import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { EntryPreloader } from '../components/ui';

export default function RootLayout() {
  const [introDone, setIntroDone] = useState(false);
  // Stable callback: EntryPreloader's effect depends on it and would restart otherwise
  const handleIntroDone = useCallback(() => setIntroDone(true), []);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <>
      <EntryPreloader onComplete={handleIntroDone} />
      {/* Site-wide background: drifting aurora (styles in index.css) */}
      <div aria-hidden="true" className="site-bg">
        <div className="site-bg-blob site-bg-blob-1" />
        <div className="site-bg-blob site-bg-blob-2" />
        
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
