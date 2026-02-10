// src/components/home/CompanyPresentationSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlay } from 'react-icons/fi';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../../views/HomeView';
import MaxWidthContainer from '../../ui/MaxWidthContainer';
import Section from '../../ui/Section';
import { hasConsent, onConsentChange, openConsentSettings } from '../../../lib/consent/browser.js';
import styles from './CompanyPresentationSection.module.css';

const CompanyPresentationSection = () => {
  const { t } = useTranslation();
  const [showVideo, setShowVideo] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [mediaConsent, setMediaConsent] = useState(false);
  const sectionRef = useRef(null);

  const videoId = 'XhAN4U4bngs';
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMediaConsent(hasConsent('externalMedia'));
    const unsubscribe = onConsentChange((detail) => {
      const next = detail?.consents?.externalMedia;
      setMediaConsent(typeof next === 'boolean' ? next : hasConsent('externalMedia'));
    });
    return unsubscribe;
  }, []);

  const handlePlayClick = () => {
    setShowVideo(true);
  };

  return (
    <Section
      dark
      noMarginBottom
      style={{ background: 'black' }}
      noPadding
    >
      <MaxWidthContainer>
        <HeaderWrap reversed className='full-width'>
          <ProductHeader>
            {t('company.title')}
          </ProductHeader>
          <ProductHeaderSubtitle blackBackground>{t('company.subtitle', 'Poznaj nas od środka')}</ProductHeaderSubtitle>
        </HeaderWrap>
        <div className={styles.presentationWrapper} ref={sectionRef}>
          <div className={styles.videoContainer}>
            {(!isInView || !showVideo || !mediaConsent) ? (
              <div
                className={styles.videoPlaceholder}
                style={{ backgroundImage: `url(${thumbnailUrl})` }}
                onClick={mediaConsent ? handlePlayClick : undefined}
                role="button"
                aria-label={
                  mediaConsent
                    ? t('presentation.playVideo', 'Odtwórz film prezentacyjny')
                    : t('cookies.actions.openSettings', 'Ustawienia cookies')
                }
                tabIndex={0}
              >
                {mediaConsent ? (
                  <div className={styles.playButtonContainer}>
                    <button className={styles.playButton} type="button" aria-hidden="true">
                      <FiPlay />
                    </button>
                  </div>
                ) : (
                  <div className={styles.videoConsentOverlay}>
                    <p>
                      {t(
                        'cookies.placeholders.video',
                        'Aby odtworzyć wideo, zaakceptuj treści zewnętrzne (YouTube).'
                      )}
                    </p>
                    <button
                      type="button"
                      className={styles.videoConsentButton}
                      data-open-consent-settings
                      onClick={(event) => {
                        event.stopPropagation();
                        openConsentSettings();
                      }}
                    >
                      {t('cookies.actions.openSettings', 'Ustawienia cookies')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <iframe
                className={styles.videoFrame}
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                title={t('presentation.title', 'Prezentacja firmy ROJEK')}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
        </div>
      </MaxWidthContainer>
    </Section>
  );
};

export default CompanyPresentationSection;
