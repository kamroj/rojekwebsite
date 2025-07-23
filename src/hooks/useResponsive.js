import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../constants';
import { debounce } from '../utils';

/**
 * Custom hook for responsive design
 * @returns {Object} - Object containing screen size information
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < BREAKPOINTS.SM,
    isTablet: window.innerWidth >= BREAKPOINTS.SM && window.innerWidth < BREAKPOINTS.MD,
    isDesktop: window.innerWidth >= BREAKPOINTS.MD,
    isLarge: window.innerWidth >= BREAKPOINTS.LG
  });

  useEffect(() => {
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
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};
