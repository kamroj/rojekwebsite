import { useState, useEffect } from 'react';
import { throttle } from '../utils';

/**
 * Custom hook for tracking scroll position
 * @param {number} threshold - Threshold for scroll detection
 * @returns {Object} - Object containing scroll information
 */
export const useScrollPosition = (threshold = 100) => {
  // Hydration-safe initial state:
  // On the server we don't know scroll position; on the client during hydration
  // React expects the initial render to match SSR HTML. Therefore we start with a
  // deterministic default and sync after mount in useEffect.
  const [scrollPosition, setScrollPosition] = useState({
    scrollY: 0,
    isPastThreshold: false,
    isScrollingUp: false,
    isScrollingDown: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let lastScrollY = window.pageYOffset;

    // Sync once after mount.
    setScrollPosition({
      scrollY: lastScrollY,
      isPastThreshold: lastScrollY > threshold,
      isScrollingUp: false,
      isScrollingDown: false,
    });

    const handleScroll = throttle(() => {
      const currentScrollY = window.pageYOffset;
      const isPastThreshold = currentScrollY > threshold;
      const isScrollingUp = currentScrollY < lastScrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

      setScrollPosition({
        scrollY: currentScrollY,
        isPastThreshold,
        isScrollingUp,
        isScrollingDown
      });

      lastScrollY = currentScrollY;
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrollPosition;
};
