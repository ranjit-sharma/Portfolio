import { useEffect, useRef, useState } from 'react';

/**
 * Returns true once the element enters the viewport.
 * Relies on IntersectionObserver, with a fallback for reduced-motion.
 */
export function useInView(options = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -60px 0px' } = options;
  const ref = useRef(null);
  const [inView, setInView] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (!window.IntersectionObserver) return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (inView) return;

    const el = ref.current;
    if (!el || !window.IntersectionObserver) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold, rootMargin]);

  return { ref, inView };
}
