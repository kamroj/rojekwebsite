import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../constants/index.js';
import { debounce } from '../utils';

/**
 * Custom hook for responsive design
 * @returns {Object} - Object containing screen size information
 */
export const useResponsive = () => {
  // Hydration-safe initial state:
  // keep deterministic defaults that match SSR render and sync after mount.
  const [screenSize, setScreenSize] = useState(() => {
    const width = BREAKPOINTS.MD;
    const height = 800;
    return {
      width,
      height,
      isMobile: width < BREAKPOINTS.SM,
      isTablet: width >= BREAKPOINTS.SM && width < BREAKPOINTS.MD,
      isDesktop: width >= BREAKPOINTS.MD,
      isLarge: width >= BREAKPOINTS.LG,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = debounce(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        isMobile: width < BREAKPOINTS.SM,
        isTablet: width >= BREAKPOINTS.SM && width < BREAKPOINTS.MD,
        isDesktop: width >= BREAKPOINTS.MD,
        isLarge: width >= BREAKPOINTS.LG
      });
    }, 150);

    window.addEventListener('resize', handleResize);
    // Sync once after mount to avoid hydration mismatch when SSR defaults differ.
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};
