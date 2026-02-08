// src/components/gallery/RealizationsGallery.jsx
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import MaxWidthContainer from '../../ui/MaxWidthContainer';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../../views/HomeView';
import homeStyles from '../../../views/HomeView.module.css';
import { useTranslation } from 'react-i18next';
import styles from './RealizationsGallery.module.css';

const RealizationsGallery = ({ images, options = {} }) => {
  const { t } = useTranslation();
  const swiperRef = useRef(null);

  const defaultConfig = {
    slidesPerViewMobile: 1,
    slidesPerViewTablet: 2,
    slidesPerViewDesktop: 3,
    spaceBetween: 25,
    delay: 3500,
    loop: true,
    centeredSlides: true,
    speed: 600,
  };

  // Merge defaults with provided options
  const config = { ...defaultConfig, ...options };

  const sourceImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const totalImages = sourceImages.length;

  const galleryImages = totalImages > 1
    ? [
      { ...sourceImages[totalImages - 1], _edgeClone: 'head' },
      ...sourceImages,
      { ...sourceImages[0], _edgeClone: 'tail' },
    ]
    : sourceImages;

  // Autoplay settings
  const autoplayOptions = {
    delay: config.delay,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  };

  const shouldRenderFallback = !images || totalImages === 0;
  const canSlide = totalImages > 1;

  const slidesPerViewMobile = Math.max(1, Math.min(config.slidesPerViewMobile, totalImages || 1));
  const slidesPerViewTablet = Math.max(1, Math.min(config.slidesPerViewTablet, totalImages || 1));
  const slidesPerViewDesktop = Math.max(1, Math.min(config.slidesPerViewDesktop, totalImages || 1));

  // Fallback for too few images
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
        <Swiper
          ref={swiperRef}
          modules={[Autoplay]}
          loop={false}
          rewind={canSlide}
          initialSlide={canSlide ? 1 : 0}
          watchOverflow={false}
          slidesPerView={slidesPerViewMobile}
          spaceBetween={config.spaceBetween}
          autoplay={canSlide ? autoplayOptions : false}
          allowTouchMove={canSlide}
          simulateTouch={canSlide}
          grabCursor={true}
          centeredSlides={config.centeredSlides}
          speed={config.speed}
          watchSlidesProgress={true}
          onSlideChange={(swiper) => {
            if (!canSlide) return;

            const firstRealIndex = 1;
            const lastRealIndex = totalImages;
            const firstCloneIndex = 0;
            const lastCloneIndex = totalImages + 1;

            if (swiper.activeIndex === firstCloneIndex) {
              swiper.slideTo(lastRealIndex, 0, false);
            } else if (swiper.activeIndex === lastCloneIndex) {
              swiper.slideTo(firstRealIndex, 0, false);
            }
          }}
          breakpoints={{
            577: {
              slidesPerView: slidesPerViewTablet,
              spaceBetween: config.spaceBetween,
            },
            993: {
              slidesPerView: slidesPerViewDesktop,
              spaceBetween: config.spaceBetween + 5,
            },
          }}
          className="my-interactive-swiper"
        >
          {galleryImages.map((item, idx) => (
            <SwiperSlide key={`${item.id || 'realization'}-${item._edgeClone || idx}`}>
              <div className="slide-content-wrapper">
                <img
                  className={styles.galleryImage}
                  src={item.src}
                  alt={item.alt || item.title || `Realization ${idx + 1}`}
                  draggable="false"
                />
                <div className={styles.galleryImageTitle}>{item.title}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </MaxWidthContainer>

  );
};

export default RealizationsGallery;
