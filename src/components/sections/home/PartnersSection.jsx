// src/components/home/PartnersSection.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import MaxWidthContainer from '../../ui/MaxWidthContainer';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../../views/HomeView';
import styles from './PartnersSection.module.css';

// Dane partnerów
const partnersData = [
  {
    id: 1,
    name: 'Aluron',
    logo: '/images/partners/aluron.png',
    website: 'https://www.aluron.pl/',
    alt: 'Aluron - systemy aluminiowe okienne i drzwiowe'
  },
  {
    id: 2,
    name: 'OKNO-POL',
    logo: '/images/partners/okno-pol.jpg',
    website: 'https://okno-pol.pl/',
    alt: 'OKNO-POL - producent okien i drzwi PVC, aluminium, drewno'
  },
  {
    id: 3,
    name: 'ROTO',
    logo: '/images/partners/roto.png',
    website: 'https://ftt.roto-frank.com/pl-pl/',
    alt: 'ROTO - okucia do okien i drzwi, systemy zabezpieczające'
  },
  {
    id: 4,
    name: 'MATPOL',
    logo: '/images/partners/matpol.png',
    website: 'https://matpol-skawina.pl/',
    alt: 'MATPOL - produkcja szyb zespolonych, szkło budowlane'
  }
];

const PartnersSection = () => {
  const { t } = useTranslation();
  const mobileScrollerRef = React.useRef(null);
  const mobileTrackRef = React.useRef(null);
  const resumeAnimationTimeoutRef = React.useRef(null);
  const dragOffsetRef = React.useRef(0);
  const dragStateRef = React.useRef({
    isPointerDown: false,
    startX: 0,
    startDragOffset: 0,
    hasDragged: false,
  });
  const [isMobileAnimationPaused, setIsMobileAnimationPaused] = React.useState(false);
  const [isMobileDragging, setIsMobileDragging] = React.useState(false);

  const clearResumeAnimationTimeout = () => {
    if (resumeAnimationTimeoutRef.current) {
      window.clearTimeout(resumeAnimationTimeoutRef.current);
      resumeAnimationTimeoutRef.current = null;
    }
  };

  const scheduleMobileAnimationResume = () => {
    clearResumeAnimationTimeout();
    resumeAnimationTimeoutRef.current = window.setTimeout(() => {
      setIsMobileAnimationPaused(false);
      resumeAnimationTimeoutRef.current = null;
    }, 900);
  };

  React.useEffect(() => () => clearResumeAnimationTimeout(), []);

  const handleLogoError = (e, partnerName) => {
    // Avoid innerHTML injection. Replace the <img> with a simple text fallback.
    const img = e.currentTarget;
    const parent = img.parentElement;
    if (!parent) return;
    img.remove();

    const fallback = document.createElement('div');
    fallback.textContent = partnerName;
    fallback.style.display = 'flex';
    fallback.style.alignItems = 'center';
    fallback.style.justifyContent = 'center';
    fallback.style.width = '100%';
    fallback.style.height = '100%';
    fallback.style.color = '#666';
    fallback.style.textAlign = 'center';
    fallback.style.fontWeight = '500';
    fallback.style.fontSize = '1.4rem';
    parent.appendChild(fallback);
  };

  const renderDesktopPartner = (partner) => (
    <a
      key={partner.id}
      className={styles.partnerItem}
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('partners.visitWebsite', { name: partner.name }, `Odwiedź stronę ${partner.name}`)}
    >
      <img
        className={styles.logo}
        src={partner.logo}
        alt={partner.alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onError={(e) => handleLogoError(e, partner.name)}
      />
    </a>
  );

  // Funkcja renderująca partnera dla mobile. Drugi zestaw jest tylko wizualny,
  // żeby marquee mogło zapętlać się płynnie bez skoku i bez dodatkowego Swipera.
  const renderMobilePartner = (partner, { duplicate = false } = {}) => (
    <a
      key={`${duplicate ? 'duplicate' : 'mobile'}-${partner.id}`}
      className={styles.mobilePartnerItem}
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={duplicate ? 'true' : undefined}
      tabIndex={duplicate ? -1 : undefined}
      aria-label={t('partners.visitWebsite', { name: partner.name }, `Odwiedź stronę ${partner.name}`)}
    >
      <img
        className={styles.logo}
        src={partner.logo}
        alt={partner.alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onError={(e) => handleLogoError(e, partner.name)}
      />
    </a>
  );

  const handleMobilePointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;

    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    clearResumeAnimationTimeout();
    setIsMobileAnimationPaused(true);
    setIsMobileDragging(true);

    dragStateRef.current = {
      isPointerDown: true,
      startX: event.clientX,
      startDragOffset: dragOffsetRef.current,
      hasDragged: false,
    };

    scroller.setPointerCapture?.(event.pointerId);
  };

  const handleMobilePointerMove = (event) => {
    const track = mobileTrackRef.current;
    const dragState = dragStateRef.current;
    if (!track || !dragState.isPointerDown) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 4) {
      dragState.hasDragged = true;
      event.preventDefault();
    }

    const nextOffset = dragState.startDragOffset + deltaX;
    dragOffsetRef.current = nextOffset;
    track.style.setProperty('--partners-drag-offset', `${nextOffset}px`);
  };

  const finishMobileDrag = (event) => {
    const scroller = mobileScrollerRef.current;
    const dragState = dragStateRef.current;
    if (!dragState.isPointerDown) return;

    const shouldSuppressClick = dragState.hasDragged;
    dragState.isPointerDown = false;
    setIsMobileDragging(false);
    scroller?.releasePointerCapture?.(event.pointerId);
    scheduleMobileAnimationResume();

    if (shouldSuppressClick) {
      window.setTimeout(() => {
        dragStateRef.current.hasDragged = false;
      }, 0);
    }
  };

  const handleMobileClickCapture = (event) => {
    if (!dragStateRef.current.hasDragged) return;

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current.hasDragged = false;
  };

  return (
      <MaxWidthContainer className={styles.sectionRoot}>
        <HeaderWrap className='full-width' reversed>
          <ProductHeader>
            {t('sections.partners')}
          </ProductHeader>
          <ProductHeaderSubtitle>{t('partners.subtitle', 'Firmy, z którymi współpracujemy')}</ProductHeaderSubtitle>
        </HeaderWrap>
        <div className={styles.partnersGrid}>
          {partnersData.map(renderDesktopPartner)}
        </div>

        {/* Mobile version - smooth marquee */}
        <div
          ref={mobileScrollerRef}
          className={[
            styles.mobileSwiper,
            isMobileAnimationPaused ? styles.mobileSwiperPaused : null,
            isMobileDragging ? styles.mobileSwiperDragging : null,
          ].filter(Boolean).join(' ')}
          onPointerDown={handleMobilePointerDown}
          onPointerMove={handleMobilePointerMove}
          onPointerUp={finishMobileDrag}
          onPointerCancel={finishMobileDrag}
          onLostPointerCapture={finishMobileDrag}
          onClickCapture={handleMobileClickCapture}
        >
          <div ref={mobileTrackRef} className={styles.mobileTrack}>
            {partnersData.map((partner) => renderMobilePartner(partner))}
            {partnersData.map((partner) => renderMobilePartner(partner, { duplicate: true }))}
          </div>
        </div>
      </MaxWidthContainer>
  );
};

export default PartnersSection;
