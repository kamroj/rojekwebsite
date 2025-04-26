// src/components/gallery/RealizationsGallery.jsx
import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

// --- Styled Components ---
const StyledSwiperContainer = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 40px auto;
  position: relative;

  .swiper {
    width: 100%;
    height: auto;
    padding: 10px 0px;
    box-sizing: border-box;
  }

  /* --- Default slide style (resting state) --- */
  .swiper-slide {
    height: auto;
    cursor: grab;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(0.88);
    transition: transform 0.4s ease;

    &:active { 
      cursor: grabbing; 
    }
  }

  /* Active slide style (resting state) */
  .swiper-slide-active {
    transform: scale(1.05);
    z-index: 1;
  }

  /* --- Default inner wrapper style (resting state) --- */
  .slide-content-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    height: 100%;
    width: 100%;
    transition: box-shadow 0.3s ease;
    display: block;

    /* Overlay */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 4px;
      pointer-events: none;
      z-index: 1;
      background-color: ${({ theme }) => theme.colors.galleryOverlay};
      transition: background-color 0.4s ease;
    }

    /* Hover effects */
    &:hover::after { 
      background-color: rgba(0, 0, 0, 0); 
    }
    
    &:hover img { 
      transform: scale(1.05); 
    }
  }

  /* Active slide overlay (resting state) */
  .swiper-slide-active .slide-content-wrapper::after {
    background-color: rgba(0, 0, 0, 0);
  }

  /* Shadow for active slide (resting state) */
  .swiper-slide-active .slide-content-wrapper {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  }

  /* --- Rules during dragging (.swiper-dragging) --- */
  .swiper-dragging {
    /* Disable CSS animations during dragging */
    .swiper-slide {
      transition: none !important;
      transform: scale(0.9) !important;
      
      .slide-content-wrapper::after {
        transition: none !important;
        background-color: ${({ theme }) => theme.colors.galleryOverlay} !important;
      }
      
      .slide-content-wrapper {
        transition: none !important;
        box-shadow: none !important;
      }
    }
    
    /* Special class for the currently grabbed slide */
    .swiper-slide-grabbed {
      transform: scale(1.05) !important;
      z-index: 10 !important;
      
      .slide-content-wrapper::after {
        background-color: rgba(0, 0, 0, 0) !important;
      }
      
      .slide-content-wrapper {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35) !important;
      }
    }
  }
`;

const GalleryImage = styled.img`
  display: block;
  width: 100%;
  height: 400px;
  object-fit: cover;
  user-select: none;
  transition: transform 0.3s ease;
  -webkit-user-drag: none;
  user-drag: none;
  border-radius: 4px;
`;

const GalleryImageTitle = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.bottleGreen}dd;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 5px 12px;
  border-radius: 3px;
  font-size: 1.3rem;
  font-weight: 500;
  z-index: 2;
  pointer-events: none;
  max-width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// --- Main Gallery Component ---
const RealizationsGallery = ({ images, options = {} }) => {
  const totalImages = images?.length || 0;
  const swiperRef = useRef(null);
  
  // Default configuration
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

  // Fallback for too few images
  if (!images || totalImages < config.slidesPerViewDesktop) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
        {images?.map((imgData, i) => (
          <div 
            key={imgData.id || i} 
            style={{ 
              borderRadius: '4px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
            }}
          >
            <img 
              src={imgData.src} 
              alt={imgData.title || `Realizacja ${i + 1}`} 
              style={{ 
                display: 'block', 
                height: '250px', 
                width: 'auto', 
                maxWidth: '300px' 
              }} 
            />
          </div>
        ))}
      </div>
    );
  }

  // Handle drag interactions for proper styling
  const handleDragStart = (swiper, event) => {
    const slideEl = event.target.closest('.swiper-slide');
    if (slideEl) {
      // Clear class from all slides first
      swiper.slides.forEach(slide => {
        slide.classList.remove('swiper-slide-grabbed');
      });
      // Add class to the clicked slide
      slideEl.classList.add('swiper-slide-grabbed');
    }
  };

  const handleDragEnd = (swiper) => {
    // Remove class from all slides after dragging ends
    swiper.slides.forEach(slide => {
      slide.classList.remove('swiper-slide-grabbed');
    });
  };

  // Setup drag tracking
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;

      // Add event listeners
      swiper.on('touchStart', (_, event) => handleDragStart(swiper, event));
      swiper.on('touchEnd', () => handleDragEnd(swiper));
      swiper.on('mousedown', (event) => handleDragStart(swiper, event));
      document.addEventListener('mouseup', () => handleDragEnd(swiper));

      // Cleanup on unmount
      return () => {
        swiper.off('touchStart');
        swiper.off('touchEnd');
        swiper.off('mousedown');
        document.removeEventListener('mouseup', () => handleDragEnd(swiper));
      };
    }
  }, []);

  return (
    <StyledSwiperContainer>
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
              <GalleryImage 
                src={item.src} 
                alt={item.title} 
                loading="lazy" 
                draggable="false" 
              />
              <GalleryImageTitle>{item.title}</GalleryImageTitle>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </StyledSwiperContainer>
  );
};

export default RealizationsGallery;