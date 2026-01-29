import { useLayoutEffect, useRef } from 'react';

/**
 * useFitText
 *
 * Automatically decreases font-size so the element fits on a single line.
 * - Respects the CSS-defined font-size as the starting point.
 * - Uses ResizeObserver to refit on layout changes.
 *
 * Usage:
 *   const titleRef = useFitText({ minPx: 28, deps: [text] });
 *   <h1 ref={titleRef}>...</h1>
 */
export default function useFitText({ minPx = 28, deps = [] } = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      // reset inline size to allow CSS (and media queries) to set the baseline
      el.style.fontSize = '';

      // Ensure single-line behavior (requested)
      el.style.whiteSpace = 'nowrap';
      el.style.overflow = 'hidden';

      // If there is no width yet (e.g. hidden), skip
      if (!el.clientWidth) return;

      // Start from the CSS baseline
      let currentPx = parseFloat(window.getComputedStyle(el).fontSize) || 0;
      if (!currentPx) return;

      // Iteratively reduce until it fits or we hit minPx
      for (let i = 0; i < 6; i++) {
        const overflow = el.scrollWidth > el.clientWidth + 1;
        if (!overflow) {
          // fits at current settings -> keep CSS (no inline)
          if (i === 0) el.style.fontSize = '';
          break;
        }

        const ratio = el.clientWidth / el.scrollWidth;
        const nextPx = Math.max(minPx, Math.floor(currentPx * ratio));

        if (nextPx === currentPx) {
          el.style.fontSize = `${nextPx}px`;
          break;
        }

        currentPx = nextPx;
        el.style.fontSize = `${currentPx}px`;
      }
    };

    // Fit now and on resize
    fit();

    const ro = new ResizeObserver(() => fit());
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);

    // also refit after fonts load (if supported)
    if (document?.fonts?.ready) {
      document.fonts.ready.then(() => fit()).catch(() => undefined);
    }

    return () => {
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
