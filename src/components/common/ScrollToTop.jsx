import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Forces scroll to top on route change. Uses small delayed calls to
 * overwrite any leftover scroll restoration / body-lock effects.
 */
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Prefer manual scroll restoration
    try {
      if (history && history.scrollRestoration) {
        history.scrollRestoration = 'manual';
      }
    } catch (e) {
      // ignore (non-browser env)
    }

    // Clear any body-locking styles that might remain
    try {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    } catch (e) {
      // ignore
    }

    // Call scrollTo a couple of times with small delays to ensure we win
    // over any other async effects (loading screen, animations, etc).
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const t1 = setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 50);
    const t2 = setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;
