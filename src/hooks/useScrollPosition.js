import { useState, useEffect } from 'react';
import { throttle } from '../utils';

/**
 * Custom hook for tracking scroll position
 * @param {number} threshold - Threshold for scroll detection
 * @returns {Object} - Object containing scroll information
 */
export const useScrollPosition = (threshold = 100) => {
  const [scrollPosition, setScrollPosition] = useState({
    scrollY: window.pageYOffset,
    isPastThreshold: window.pageYOffset > threshold,
    isScrollingUp: false,
    isScrollingDown: false
  });

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

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
