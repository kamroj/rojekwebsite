// src/components/home/IntroSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import RouterAgnosticLink from '../../_astro/RouterAgnosticLink.jsx';
import { FiPlay, FiPause } from 'react-icons/fi';
import MaxWidthContainer from '../../ui/MaxWidthContainer.jsx';
import { getSectionPath } from '../../../lib/i18n/routing';
import styles from './IntroSection.module.css';

export default function IntroSection({ id }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [resetting, setResetting] = useState(false);
  const prevProgress = useRef(0);

  const introLinks = {
    'intro.text1': 'realizations',
    'intro.text2': 'about',
    'intro.text3': 'contact',
    'intro.text4': 'realizations',
    'intro.text5': 'hsConfigurator',
  };
  const keys = Object.keys(introLinks);
  const [idx, setIdx] = useState(0);
  const [keyAnim, setKeyAnim] = useState(0);

  // cykl dynamicznych tekstów
  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i => (i + 1) % keys.length);
      setKeyAnim(k => k + 1);
    }, 7000);
    return () => clearInterval(iv);
  }, [keys.length]);

  // obsługa pętli i postępu wideo
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v?.duration) return;
    const p = Math.min(1, v.currentTime / v.duration);
    if (p < prevProgress.current) {
      setResetting(true);
      setProgress(0);
    } else {
      setProgress(p);
    }
    prevProgress.current = p;
  };

  useEffect(() => {
    if (resetting) {
      const to = setTimeout(() => setResetting(false), 50);
      return () => clearTimeout(to);
    }
  }, [resetting]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play(); setIsPlaying(true);
    } else {
      v.pause(); setIsPlaying(false);
    }
  };

  // Ustawiamy CSS-ową zmienną --vvh na rzeczywistą wysokość widocznego viewportu,
  // żeby sekcja nie zachodziła na dolny pasek przeglądarki / home indicator.
  useEffect(() => {
    const rootEl = wrapperRef.current || document.documentElement;

    const setVvh = () => {
      const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      // use ceil to avoid truncating the visible viewport height which can produce a tiny gap
      rootEl.style.setProperty('--vvh', `${Math.ceil(h)}px`);
    };

    // inicjalne ustawienie
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

  // parametry SVG pierścienia
  const SIZE = 56;
  const STROKE = 2;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const dashOffset = C * (1 - progress);

  return (
    <section className={styles.introWrapper} id={id} ref={wrapperRef}>
      <video
        className={styles.videoBackground}
        ref={videoRef}
        src="/videos/background4.mp4"
        type="video/mp4"
        autoPlay muted loop playsInline
        poster="/images/video_poster.jpg"
        onTimeUpdate={onTimeUpdate}
      />
      <div className={styles.videoOverlay} />

      <div className={styles.bottomOverlay}>
        <MaxWidthContainer className={styles.bottomInner}>
          <div className={styles.progressContainer}>
            <svg
              className={styles.progressSvg}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
            >
              <circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                fill="none"
                stroke="var(--color-border-accent)"
                strokeWidth={STROKE}
              />
              <circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth={STROKE}
                strokeDasharray={C}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                style={{
                  transition: resetting ? 'none' : 'stroke-dashoffset 0.1s linear',
                }}
              />
            </svg>
            <button
              className={styles.videoControlButton}
              type="button"
              onClick={toggle}
              onTouchEnd={(e) => {
                e.preventDefault();
                toggle();
              }}
              aria-label={isPlaying ? t('buttons.pause', 'Pause') : t('buttons.play', 'Play')}
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
          </div>

          <div className={styles.rightBottomContent}>
            <p className={styles.dynamicText} key={keyAnim}>
            {t(keys[idx], '')}
            </p>
            <RouterAgnosticLink className={styles.ctaButton} href={getSectionPath(lang, introLinks[keys[idx]] || 'home')}>
            {t('buttons.see','Zobacz')}
            </RouterAgnosticLink>
          </div>
        </MaxWidthContainer>
      </div>
    </section>
  );
}
