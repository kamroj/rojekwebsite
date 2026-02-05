import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoadingScreen.module.css';



const LoadingScreen = ({ 
  isVisible = true, 
  isHiding = false, 
  progress = 0, 
  loadedCount = 0, 
  totalCount = 0 
}) => {
  const { t } = useTranslation();

  // Use dynamic viewport height (vvh) based on visualViewport to keep content
  // perfectly centered within the visible area on mobile (URL bar at bottom/top).
  const wrapperRef = useRef(null);
  useEffect(() => {
    const el = wrapperRef.current || document.documentElement;

    const setVvh = () => {
      const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      el.style.setProperty('--vvh', `${Math.ceil(h)}px`);
    };

    // initial set
    setVvh();

    const onResize = () => setVvh();

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResize);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onResize);
      }
    };
  }, []);

  // Block scrolling when loading screen is visible
  useEffect(() => {
    if (isVisible && !isHiding) {
      // Save current scroll position and current path
      const scrollY = window.scrollY;
      // const initialPath = window.location.pathname;
      
      // Block scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scrolling styles (do not restore scroll position here — navigation should control it)
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
      };
    }
    // no cleanup needed if we didn't lock scrolling
    return undefined;
  }, [isVisible, isHiding]);

  // Don't render if not visible and not hiding
  if (!isVisible && !isHiding) return null;

  const overlayClass = isHiding ? `${styles.overlay} ${styles.overlayHiding}` : styles.overlay;

  return (
    <div className={overlayClass} ref={wrapperRef}>
      <div className={styles.content}>
        <img
          className={styles.logo}
          src="/images/logo.png" 
          alt={t('nav.logoAlt', 'ROJEK Logo')}
          width={1110}
          height={331}
          decoding="async"
        />
        
        <div className={styles.spinner} />
        
        <p className={styles.loadingText}>
          {t('loading', 'Ładowanie...')}
        </p>
        
        {totalCount > 0 && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.progressText}>
              {loadedCount} / {totalCount} {t('loading.resources', 'zasobów')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
