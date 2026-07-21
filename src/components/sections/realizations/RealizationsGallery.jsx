import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../../views/HomeView';
import homeStyles from '../../../views/HomeView.module.css';
import ImageWithSpinner from '../../ui/ImageWithSpinner.jsx';
import MaxWidthContainer from '../../ui/MaxWidthContainer';
import styles from './RealizationsGallery.module.css';

const mod = (number, length) => ((number % length) + length) % length;

const RealizationsGallery = ({ images }) => {
  const { t } = useTranslation();
  const dragStartXRef = useRef(0);
  const dragDeltaRef = useRef(0);
  const draggedRef = useRef(false);

  const sourceImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images],
  );
  const totalImages = sourceImages.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [imageRatios, setImageRatios] = useState({});

  useEffect(() => {
    setCurrentIndex((previous) => (totalImages ? mod(previous, totalImages) : 0));
  }, [totalImages]);

  const selectImage = (index) => {
    if (!totalImages) return;
    setCurrentIndex(mod(index, totalImages));
  };

  const visibleItems = useMemo(() => sourceImages
    .map((item, index) => {
      let offset = index - currentIndex;
      if (offset > totalImages / 2) offset -= totalImages;
      if (offset < -totalImages / 2) offset += totalImages;
      return { item, index, offset };
    })
    .filter(({ offset }) => Math.abs(offset) <= 2), [currentIndex, sourceImages, totalImages]);

  const handlePointerDown = (event) => {
    if (totalImages <= 1) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragStartXRef.current = event.clientX;
    dragDeltaRef.current = 0;
    draggedRef.current = false;
    setDragOffset(0);
  };

  const handlePointerMove = (event) => {
    if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
    const delta = event.clientX - dragStartXRef.current;
    dragDeltaRef.current = delta;
    if (Math.abs(delta) > 6) draggedRef.current = true;
    setDragOffset(Math.max(-120, Math.min(120, delta)));
  };

  const releasePointer = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event) => {
    releasePointer(event);
    const delta = dragDeltaRef.current;
    setDragOffset(0);

    if (delta > 42) selectImage(currentIndex - 1);
    else if (delta < -42) selectImage(currentIndex + 1);

    window.setTimeout(() => {
      draggedRef.current = false;
    }, 0);
  };

  const handlePointerCancel = (event) => {
    releasePointer(event);
    dragDeltaRef.current = 0;
    draggedRef.current = false;
    setDragOffset(0);
  };

  if (!totalImages) return null;

  const activeImage = sourceImages[currentIndex];

  return (
    <MaxWidthContainer id="realizations-gallery">
      <HeaderWrap className={`full-width ${styles.galleryHeader}`} reversed>
        <ProductHeader className={homeStyles.productHeaderLight}>
          {t('sections.realizations')}
        </ProductHeader>
        <ProductHeaderSubtitle blackBackground>
          {t('realizations.subtitle', 'Zobacz nasze realizacje')}
        </ProductHeaderSubtitle>
      </HeaderWrap>

      <div className={styles.coverflowGallery}>
        <div
          className={styles.coverflowStage}
          style={{ '--coverflow-drag': `${dragOffset}px` }}
          role="region"
          aria-label={t('sections.realizations')}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') selectImage(currentIndex - 1);
            if (event.key === 'ArrowRight') selectImage(currentIndex + 1);
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {visibleItems.map(({ item, index, offset }) => {
            const distance = Math.abs(offset);
            const offsetClass = offset === 0
              ? ''
              : styles[`coverflowOffset${offset < 0 ? `Neg${distance}` : `Pos${distance}`}`];

            return (
              <button
                key={item.id || item.src}
                type="button"
                className={`${styles.coverflowCard} ${styles[`coverflowDistance${distance}`]} ${offsetClass} ${offset === 0 ? styles.coverflowCardActive : ''}`}
                style={{
                  '--coverflow-aspect': imageRatios[item.src] || 0.66,
                  '--coverflow-z': `${distance * -170}px`,
                  '--coverflow-rotation': `${offset * -18}deg`,
                  '--coverflow-scale': 1 - distance * 0.1,
                  zIndex: 10 - distance,
                }}
                onClick={() => {
                  if (!draggedRef.current) selectImage(index);
                }}
                aria-label={item.title}
                aria-current={offset === 0 ? 'true' : undefined}
              >
                <ImageWithSpinner
                  wrapperClassName={styles.coverflowImageWrapper}
                  className={styles.coverflowImage}
                  src={item.src}
                  alt={offset === 0 ? (item.alt || item.title || 'Realization') : ''}
                  draggable={false}
                  onLoad={(event) => {
                    const { naturalWidth, naturalHeight } = event.currentTarget;
                    if (!naturalWidth || !naturalHeight) return;
                    const ratio = naturalWidth / naturalHeight;
                    setImageRatios((previous) => (
                      previous[item.src] === ratio
                        ? previous
                        : { ...previous, [item.src]: ratio }
                    ));
                  }}
                />
              </button>
            );
          })}
        </div>

        <div className={styles.coverflowDetails} aria-live="polite">
          <button
            type="button"
            onClick={() => selectImage(currentIndex - 1)}
            aria-label={t('navigation.previous', 'Poprzedni')}
          >
            <IoIosArrowBack aria-hidden="true" />
          </button>
          <div>
            <span>{String(currentIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}</span>
            <strong>{activeImage.title}</strong>
          </div>
          <button
            type="button"
            onClick={() => selectImage(currentIndex + 1)}
            aria-label={t('navigation.next', 'Następny')}
          >
            <IoIosArrowForward aria-hidden="true" />
          </button>
        </div>
      </div>
    </MaxWidthContainer>
  );
};

export default RealizationsGallery;
