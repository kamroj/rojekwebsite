// src/components/gallery/RealizationsGallery.jsx
import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import MaxWidthContainer from '../../ui/MaxWidthContainer';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../../views/HomeView';
import { useTranslation } from 'react-i18next';
import styles from './RealizationsGallery.module.css';

const RealizationsGallery = ({ images, options = {} }) => {
  const { t } = useTranslation();
  const totalImages = images?.length || 0;
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

  // Autoplay settings
  const autoplayOptions = {
    delay: config.delay,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  };

  const shouldRenderFallback = !images || totalImages < config.slidesPerViewDesktop;

  // Handle drag interactions for proper styling
  const handleDragStart = (swiper, event) => {
    if (!swiper || !event) return;

    const slideEl = event.target.closest('.swiper-slide');
    if (slideEl && swiper.slides) {
      // Clear class from all slides first
      Array.from(swiper.slides).forEach(slide => {
        slide.classList.remove('swiper-slide-grabbed');
      });
      // Add class to the clicked slide
      slideEl.classList.add('swiper-slide-grabbed');
    }
  };

  const handleDragEnd = (swiper) => {
    // Fix: Check if swiper and swiper.slides exist before calling forEach
    if (!swiper || !swiper.slides || !swiper.slides.length) return;

    // Use Array.from to ensure we have an array we can iterate over
    Array.from(swiper.slides).forEach(slide => {
      slide.classList.remove('swiper-slide-grabbed');
    });
  };

  // Setup drag tracking
  useEffect(() => {
    if (shouldRenderFallback) return;

    // Safety check
    if (!swiperRef.current) return;

    const swiperInstance = swiperRef.current.swiper;
    if (!swiperInstance) return;

    // Add event listeners
    const touchStartHandler = (_, event) => handleDragStart(swiperInstance, event);
    const touchEndHandler = () => handleDragEnd(swiperInstance);
    const mouseDownHandler = (event) => handleDragStart(swiperInstance, event);
    const mouseUpHandler = () => handleDragEnd(swiperInstance);

    swiperInstance.on('touchStart', touchStartHandler);
    swiperInstance.on('touchEnd', touchEndHandler);
    swiperInstance.on('mousedown', mouseDownHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    // Cleanup on unmount
    return () => {
      // Check if swiper instance still exists before removing listeners
      if (swiperInstance && typeof swiperInstance.off === 'function') {
        swiperInstance.off('touchStart', touchStartHandler);
        swiperInstance.off('touchEnd', touchEndHandler);
        swiperInstance.off('mousedown', mouseDownHandler);
      }
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, [shouldRenderFallback]);

  // Fallback for too few images
  if (shouldRenderFallback) {
    return (
      <div className={styles.fallbackWrapper}>
        {images?.map((imgData, i) => (
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
        <ProductHeader className={styles.headerBgLight}>
          {t('sections.realizations')}
        </ProductHeader>
        <ProductHeaderSubtitle blackBackground>{t('realizations.subtitle', 'Zobacz nasze realizacje')}</ProductHeaderSubtitle>
      </HeaderWrap>
      <div className={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          modules={[Autoplay]}
          loop={config.loop}
          slidesPerView={config.slidesPerViewMobile}
          spaceBetween={config.spaceBetween}
          autoplay={autoplayOptions}
          grabCursor={true}
          centeredSlides={config.centeredSlides}
          speed={config.speed}
          watchSlidesProgress={true}
          breakpoints={{
            577: {
              slidesPerView: config.slidesPerViewTablet,
              spaceBetween: config.spaceBetween,
            },
            993: {
              slidesPerView: config.slidesPerViewDesktop,
              spaceBetween: config.spaceBetween + 5,
            },
          }}
          className="my-interactive-swiper"
        >
          {images.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="slide-content-wrapper">
                <img
                  className={styles.galleryImage}
                  src={item.src}
                  alt={item.title}
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
