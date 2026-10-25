import { useEffect, useState } from 'react';

/**
 * Returns the ID of the currently active section based on scroll position.
 * Tracks sections in ascending document order with smooth threshold detection.
 * @param {string[]} sectionIds - Array of section element IDs to track.
 */
export function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY + 140; // Offset for fixed navbar + breathing room
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // When scrolled near the very bottom, activate the final section
      if (window.scrollY + windowHeight >= documentHeight - 60) {
        const lastId = sectionIds[sectionIds.length - 1];
        if (lastId) {
          setActiveId(lastId);
          return;
        }
      }

      // When at the very top of the page (hero area)
      if (window.scrollY < 180) {
        setActiveId(sectionIds.includes('hero') ? 'hero' : '');
        return;
      }

      // Check sections sequentially from top to bottom
      let currentSection = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentSection = id;
          }
        }
      }

      setActiveId(currentSection);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sectionIds]);

  return activeId;
}
