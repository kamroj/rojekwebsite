import { useState, useEffect } from 'react';
import { throttle } from '../utils';

/**
 * Custom hook for tracking scroll position
 * @param {number} threshold - Threshold for scroll detection
 * @returns {Object} - Object containing scroll information
 */
export const useScrollPosition = (threshold = 100) => {
  const getScrollY = () => {
    if (typeof window === 'undefined') return 0;
    return (
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement?.scrollTop ||
      document.body?.scrollTop ||
      0
    );
  };

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
    let lastScrollY = getScrollY();

    // Sync once after mount.
    setScrollPosition({
      scrollY: lastScrollY,
      isPastThreshold: lastScrollY > threshold,
      isScrollingUp: false,
      isScrollingDown: false,
    });

    const handleScroll = throttle(() => {
      const currentScrollY = getScrollY();
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

    // Sync once more right after listeners are attached
    // (helps on mobile where initial scroll can be restored asynchronously).
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [threshold]);

  return scrollPosition;
};
