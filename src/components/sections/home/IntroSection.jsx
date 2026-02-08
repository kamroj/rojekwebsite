// src/components/home/IntroSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import RouterAgnosticLink from '../../_astro/RouterAgnosticLink.jsx';
import { FiPlay, FiPause } from 'react-icons/fi';
import MaxWidthContainer from '../../ui/MaxWidthContainer.jsx';
import { getSectionPath } from '../../../lib/i18n/routing';
import { runSanityTask } from '../../../lib/sanity/runSanityTask';
import { fetchHomePageIntro } from '../../../lib/sanity/homePage';
import { isSanityConfigured } from '../../../lib/sanity/config';
import { useResourceCollector } from '../../../context/ResourceCollectorContext';
import styles from './IntroSection.module.css';

const FALLBACK_POSTER = '/images/video_poster.jpg';

export default function IntroSection({ id, introMedia }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const { beginTask, endTask, addResources } = useResourceCollector();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const prevProgress = useRef(0);

  const [media, setMedia] = useState(() => ({
    videoSrc: introMedia?.videoSrc || null,
    posterSrc: introMedia?.posterSrc || null,
    posterLqip: introMedia?.posterLqip || null,
  }));

  useEffect(() => {
    setMedia({
      videoSrc: introMedia?.videoSrc || null,
      posterSrc: introMedia?.posterSrc || null,
      posterLqip: introMedia?.posterLqip || null,
    });
  }, [introMedia]);

  useEffect(() => {
    // SSG props are preferred. Only fetch in CSR fallback when we don't have intro media.
    if (media?.videoSrc || media?.posterSrc || media?.posterLqip) return;
    if (!isSanityConfigured()) return;

    const controller = new AbortController();

    runSanityTask({
      beginTask,
      endTask,
      addResources,
      taskName: 'sanity:home:intro',
      fetcher: ({ signal }) => fetchHomePageIntro({ signal }),
      extractAssetUrls: (data) => data?._assetUrls || [],
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted || !data) return;
        setMedia({
          videoSrc: data.backgroundVideoUrl || null,
          posterSrc: data?.backgroundPoster?.asset?.url || null,
          posterLqip: data?.backgroundPoster?.asset?.metadata?.lqip || null,
        });
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        console.warn('[sanity][home] intro media fetch failed', e);
      });

    return () => {
      controller.abort();
    };
  }, [media, beginTask, endTask, addResources]);

  const videoSrc = media?.videoSrc || null;
  const posterSrc = media?.posterSrc || FALLBACK_POSTER;
  const posterLqip = media?.posterLqip || null;

  useEffect(() => {
    setIsVideoLoaded(false);
  }, [videoSrc]);

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
      {posterLqip ? (
        <img
          className={`${styles.videoBackground} ${styles.videoPoster} ${isVideoLoaded ? styles.posterHidden : ''}`}
          src={posterLqip}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="sync"
        />
      ) : null}

      {videoSrc ? (
        <video
          className={`${styles.videoBackground} ${styles.videoElement} ${isVideoLoaded ? styles.videoLoaded : ''}`}
          ref={videoRef}
          src={videoSrc}
          type="video/mp4"
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          onTimeUpdate={onTimeUpdate}
          onLoadedData={() => setIsVideoLoaded(true)}
        />
      ) : (
        <img
          className={`${styles.videoBackground} ${styles.videoElement} ${styles.videoLoaded}`}
          src={posterSrc}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="sync"
        />
      )}
      <div className={styles.videoOverlay} />

      <div className={styles.bottomOverlay}>
        <MaxWidthContainer className={styles.bottomInner}>
          {videoSrc ? (
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
          ) : null}

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
