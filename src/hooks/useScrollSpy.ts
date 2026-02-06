import { useState, useEffect } from 'react';

/**
 * Custom hook: Scroll spy to track active section
 * Uses IntersectionObserver to determine which section is currently visible
 *
 * @param sectionIds - Array of section element IDs to observe
 * @param offset - Offset in pixels from the top of the viewport (default: 100)
 * @returns The ID of the currently active section
 */
export const useScrollSpy = (sectionIds: string[], offset = 100): string => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: `-${offset}px 0px -50% 0px` }
    );

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds, offset]);

  return activeSection;
};
