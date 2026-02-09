// src/components/gallery/RealizationsGallery.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MaxWidthContainer from '../../ui/MaxWidthContainer';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../../views/HomeView';
import homeStyles from '../../../views/HomeView.module.css';
import { useTranslation } from 'react-i18next';
import styles from './RealizationsGallery.module.css';

const RealizationsGallery = ({ images, options = {} }) => {
  const { t } = useTranslation();
  const dragStartXRef = useRef(0);
  const dragDeltaRef = useRef(0);

  const defaultConfig = {
    delay: 3500,
    speed: 420,
  };

  const config = { ...defaultConfig, ...options };

  const sourceImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const totalImages = sourceImages.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const shouldRenderFallback = !images || totalImages === 0;
  const canSlide = totalImages > 1;
  const canDesktopThree = totalImages >= 3;

  const mod = (n, length) => ((n % length) + length) % length;

  const slideWindow = useMemo(() => {
    if (totalImages === 0) return [];
    return [-2, -1, 0, 1, 2].map((baseSlot) => ({
      baseSlot,
      visualSlot:
        direction === 'next'
          ? baseSlot - 1
          : direction === 'prev'
            ? baseSlot + 1
            : baseSlot,
      item: sourceImages[mod(currentIndex + baseSlot, totalImages)],
    }));
  }, [currentIndex, direction, sourceImages, totalImages]);

  const step = (dir) => {
    if (!canSlide || direction) return;

    setDirection(dir);
    window.setTimeout(() => {
      setCurrentIndex((prev) => mod(prev + (dir === 'next' ? 1 : -1), totalImages));
      setDirection(null);
    }, config.speed);
  };

  useEffect(() => {
    if (!canSlide || isPointerDown || direction) return;

    const timer = window.setInterval(() => step('next'), config.delay);
    return () => window.clearInterval(timer);
  }, [canSlide, isPointerDown, direction, config.delay]);

  const handlePointerDown = (event) => {
    if (!canSlide) return;
    setIsPointerDown(true);
    dragStartXRef.current = event.clientX;
    dragDeltaRef.current = 0;
  };

  const handlePointerMove = (event) => {
    if (!isPointerDown) return;
    dragDeltaRef.current = event.clientX - dragStartXRef.current;
  };

  const handlePointerUp = () => {
    if (!isPointerDown) return;

    const threshold = 35;
    const delta = dragDeltaRef.current;

    setIsPointerDown(false);
    if (delta > threshold) step('prev');
    else if (delta < -threshold) step('next');
  };

  if (shouldRenderFallback) {
    return (
      <div className={styles.fallbackWrapper}>
        {sourceImages?.map((imgData, i) => (
          <div
            key={imgData.id || i}
            className={styles.fallbackCard}
          >
            <img
              src={imgData.src}
              alt={imgData.title || `Realizacja ${i + 1}`}
              className={styles.fallbackImage}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <MaxWidthContainer>
      <HeaderWrap className='full-width' reversed>
        <ProductHeader className={homeStyles.productHeaderLight}>
          {t('sections.realizations')}
        </ProductHeader>
        <ProductHeaderSubtitle blackBackground>{t('realizations.subtitle', 'Zobacz nasze realizacje')}</ProductHeaderSubtitle>
      </HeaderWrap>
      <div className={styles.swiperContainer}>
        <div
          className={styles.carouselViewport}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {slideWindow.map(({ baseSlot, visualSlot, item }) => (
            <article
              key={`slot-${baseSlot}-${item?.id || visualSlot}`}
              className={`${styles.card} ${styles[`slot${visualSlot}`] || ''} ${!canDesktopThree ? styles.cardFallback : ''}`}
              style={{
                '--slot': visualSlot,
                '--transition-duration': `${config.speed}ms`,
              }}
            >
              <div className={styles.slideContentWrapper}>
                <img
                  className={styles.galleryImage}
                  src={item.src}
                  alt={item.alt || item.title || 'Realization'}
                  draggable={false}
                />
                <div className={styles.galleryImageTitle}>{item.title}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MaxWidthContainer>

  );
};

export default RealizationsGallery;
