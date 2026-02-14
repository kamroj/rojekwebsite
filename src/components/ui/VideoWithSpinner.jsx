import React, { useEffect, useRef, useState } from 'react';

import styles from './VideoWithSpinner.module.css';

export default function VideoWithSpinner({
  className,
  wrapperClassName,
  wrapperStyle,
  videoRef,
  spinnerSize,
  spinnerColor,
  spinnerTrackColor,
  showSpinner = true,
  holdSpinnerMs = 0,
  onLoadedData,
  onError,
  ...videoProps
}) {
  const internalVideoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSpinnerHoldActive, setIsSpinnerHoldActive] = useState(holdSpinnerMs > 0);

  useEffect(() => {
    setIsLoaded(false);
    setIsSpinnerHoldActive(holdSpinnerMs > 0);

    let holdTimer;
    if (holdSpinnerMs > 0) {
      holdTimer = window.setTimeout(() => {
        setIsSpinnerHoldActive(false);
      }, holdSpinnerMs);
    }

    const node = internalVideoRef.current;

    // HAVE_CURRENT_DATA (2) or higher means first frame is ready.
    if (node && node.readyState >= 2) {
      setIsLoaded(true);
    }

    return () => {
      if (holdTimer) {
        window.clearTimeout(holdTimer);
      }
    };
  }, [videoProps.src, holdSpinnerMs]);

  const handleLoadedData = (event) => {
    setIsLoaded(true);
    if (typeof onLoadedData === 'function') {
      onLoadedData(event);
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
    isLoaded || !showSpinner ? styles.isLoaded : null,
    wrapperClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedVideoClassName = [styles.video, className].filter(Boolean).join(' ');

  const spinnerVars = {
    ...(spinnerSize ? { '--video-spinner-size': spinnerSize } : null),
    ...(spinnerColor ? { '--video-spinner-accent': spinnerColor } : null),
    ...(spinnerTrackColor ? { '--video-spinner-track': spinnerTrackColor } : null),
    ...(wrapperStyle || null),
  };

  return (
    <div className={resolvedWrapperClassName} style={spinnerVars}>
      <video
        {...videoProps}
        ref={(node) => {
          internalVideoRef.current = node;

          if (typeof videoRef === 'function') {
            videoRef(node);
          } else if (videoRef && typeof videoRef === 'object') {
            videoRef.current = node;
          }
        }}
        className={resolvedVideoClassName}
        onLoadedData={handleLoadedData}
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
