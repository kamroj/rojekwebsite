import React, { useEffect, useRef, useState } from 'react';

import styles from './ImageWithSpinner.module.css';

export default function ImageWithSpinner({
  src,
  alt,
  className,
  wrapperClassName,
  wrapperStyle,
  spinnerSize,
  spinnerColor,
  spinnerTrackColor,
  showSpinner = true,
  holdSpinnerMs = 0,
  onLoad,
  onError,
  ...imgProps
}) {
  const imageRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSpinnerHoldActive, setIsSpinnerHoldActive] = useState(holdSpinnerMs > 0);

  useEffect(() => {
    setIsLoaded(false);
    setIsSpinnerHoldActive(holdSpinnerMs > 0);

    if (!src) {
      setIsLoaded(true);
    }

    let holdTimer;
    if (holdSpinnerMs > 0) {
      holdTimer = window.setTimeout(() => {
        setIsSpinnerHoldActive(false);
      }, holdSpinnerMs);
    }

    const node = imageRef.current;
    // In Astro islands the browser can finish loading (or fail loading)
    // the image before React hydrates. In that case onLoad/onError events
    // are already gone, so we must rely on `complete` only.
    // If `naturalWidth === 0`, the image likely failed, but spinner still
    // must disappear to avoid an infinite loading state.
    if (node && node.complete) {
      setIsLoaded(true);
    }

    // Safety net for browser/hydration edge-cases where load/error events
    // may be missed and `complete` flips slightly later.
    let completionWatcher;
    if (node && !node.complete) {
      completionWatcher = window.setInterval(() => {
        if (node.complete) {
          setIsLoaded(true);
          window.clearInterval(completionWatcher);
        }
      }, 150);
    }

    return () => {
      if (holdTimer) {
        window.clearTimeout(holdTimer);
      }
      if (completionWatcher) {
        window.clearInterval(completionWatcher);
      }
    };
  }, [src, holdSpinnerMs]);

  const handleLoad = (event) => {
    setIsLoaded(true);
    if (typeof onLoad === 'function') {
      onLoad(event);
    }
  };

  const handleError = (event) => {
    setIsLoaded(true);
    if (typeof onError === 'function') {
      onError(event);
    }
  };

  const resolvedWrapperClassName = [
    styles.wrapper,
    !showSpinner ? styles.noSpinner : null,
    isLoaded || !showSpinner ? styles.isLoaded : null,
    wrapperClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedImageClassName = [styles.image, className].filter(Boolean).join(' ');

  const spinnerVars = {
    ...(spinnerSize ? { '--image-spinner-size': spinnerSize } : null),
    ...(spinnerColor ? { '--image-spinner-accent': spinnerColor } : null),
    ...(spinnerTrackColor ? { '--image-spinner-track': spinnerTrackColor } : null),
    ...(wrapperStyle || null),
  };

  return (
    <div className={resolvedWrapperClassName} style={spinnerVars}>
      <img
        {...imgProps}
        ref={imageRef}
        src={src}
        alt={alt}
        className={resolvedImageClassName}
        onLoad={handleLoad}
        onError={handleError}
      />

      {showSpinner && (!isLoaded || isSpinnerHoldActive) ? (
        <span className={styles.loader} aria-hidden="true">
          <span className={styles.spinner} />
        </span>
      ) : null}
    </div>
  );
}
