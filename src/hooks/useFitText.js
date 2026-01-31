import { useLayoutEffect, useRef, useCallback } from 'react';

/**
 * useFitText
 *
 * Automatically adjusts font-size so the element fits within parent's width.
 * - Respects the CSS-defined font-size as the maximum starting point.
 * - Uses ResizeObserver to refit on layout changes.
 *
 * Usage:
 *   const titleRef = useFitText({ minPx: 28, deps: [text] });
 *   <h1 ref={titleRef}>...</h1>
 */
export default function useFitText({ minPx = 12, maxPx = null, deps = [] } = {}) {
  const ref = useRef(null);
  const originalFontSize = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;

      // Reset to measure original/CSS font size
      el.style.fontSize = '';
      el.style.whiteSpace = 'nowrap';
      el.style.display = 'inline-block'; // Important: allows scrollWidth measurement
      
      // Store original font size on first run
      if (originalFontSize.current === null) {
        originalFontSize.current = parseFloat(window.getComputedStyle(el).fontSize);
      }

      // Calculate available width from parent
      const parentStyle = window.getComputedStyle(parent);
      const availableWidth = 
        parent.clientWidth -
        parseFloat(parentStyle.paddingLeft || 0) -
        parseFloat(parentStyle.paddingRight || 0);

      if (availableWidth <= 0) return;

      // Start from max (either CSS value, maxPx prop, or stored original)
      const startPx = maxPx || originalFontSize.current || 48;
      let currentPx = startPx;
      el.style.fontSize = `${currentPx}px`;

      // Binary search for optimal font size (more efficient than linear)
      let low = minPx;
      let high = startPx;
      let bestFit = minPx;

      // Quick check: if it fits at max size, we're done
      if (el.scrollWidth <= availableWidth) {
        bestFit = startPx;
      } else {
        // Binary search for the largest font that fits
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          el.style.fontSize = `${mid}px`;

          if (el.scrollWidth <= availableWidth) {
            bestFit = mid;
            low = mid + 1; // Try larger
          } else {
            high = mid - 1; // Try smaller
          }
        }
      }

      el.style.fontSize = `${bestFit}px`;
    };

    // Initial fit
    fit();

    // Observe both element and parent for size changes
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(fit);
    });

    ro.observe(el);
    if (el.parentElement) {
      ro.observe(el.parentElement);
    }

    // Refit after fonts are loaded
    document.fonts?.ready?.then(fit).catch(() => {});

    return () => {
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return ref;
}