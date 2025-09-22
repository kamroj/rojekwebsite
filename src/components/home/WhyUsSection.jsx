// src/components/home/WhyUsSection.jsx
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../pages/HomePage';
import MaxWidthContainer from '../common/MaxWidthContainer';

// Kontener dla całej sekcji
const WhyUsContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  position: relative;
  padding-bottom: 30px;
`;

// Desktop Grid (pokazuje się tylko na największych ekranach)
const DesktopGrid = styled.div`
  display: none;
  
  @media (min-width: 1400px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4rem;
  }
`;

// Mobile/Tablet Swiper Container
const MobileSwiperContainer = styled.div`
  display: block;
  position: relative;
  
  @media (min-width: 1400px) {
    display: none;
  }

  .swiper {
    width: 100%;
    padding: 20px 0 20px;
    overflow: visible;

    @media (max-width: 1400px) {
      cursor: grab;
    }
  }

  .swiper-slide {
    height: auto;
    display: flex;
    justify-content: center;
  }
`;

// Kontener dla przycisków nawigacji na dole
const NavigationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  
  @media (min-width: 1400px) {
    display: none;
  }
`;

// Pojedynczy kafelek
const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  transition: transform ${({ theme }) => theme.transitions.default},
              background-color ${({ theme }) => theme.transitions.default};
  width: 100%;
  max-width: 350px;
`;

// Kontener na ikonę z obramowaniem
const IconWrapper = styled.div`
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.35);
  width: 150px;
  height: 150px;
  border: 1px solid ${({ theme }) => theme.colors.bottleGreenLight};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.bottleGreen};
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.default};
  }
  
  ${FeatureCard}:hover & {
    &::before {
      opacity: 0.05;
    }
  }
`;

// Ikona
const Icon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 1;
  position: relative;
`;

// Tytuł kafelka
const FeatureTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.bottleGreen};
  margin-bottom: 1rem;
  line-height: 1.3;
  min-height: 2.6em;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.6rem;
    min-height: auto;
  }
`;

// Opis kafelka
const FeatureDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.3rem;
  }
`;

// Przycisk nawigacji - styl jak w video
const NavigationButton = styled.button`
  appearance: none;
  margin: 0;
  padding: 0;
  
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background-color: #254429;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
  transition: opacity ${({ theme }) => theme.transitions.default},
              background-color ${({ theme }) => theme.transitions.default};
  opacity: ${({ disabled }) => disabled ? 0.3 : 1};
  
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  /* Icon animation */
  svg {
    display: block;
    width: 1.2em;
    height: 1.2em;
    color: #fff;
    transition: transform 0.22s ease, color 0.22s ease;
    transform: translateX(0);
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.bottleGreen};
  }

  &:hover svg {
    transform: translateX(6px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 36px;
    height: 36px;
    font-size: 2.5rem;
  }
`;

/* Prev/Next variants so we can invert icon rotation for prev */
const PrevNavigationButton = styled(NavigationButton)`
  /* rotate forward arrow to act as left arrow */
  svg {
    transform: rotate(180deg) translateX(0);
  }

  &:hover svg {
    transform: rotate(180deg) translateX(-6px);
  }
`;

const NextNavigationButton = styled(NavigationButton)`
  /* explicit right shift on hover */
  svg {
    transform: translateX(0);
  }

  &:hover svg {
    transform: translateX(6px);
  }
`;

/* Dane dla kafelek */
const features = [
  {
    id: 'tradition',
    icon: '/images/icons/window-icon.png',
    titleKey: 'whyUs.tradition.title',
    descriptionKey: 'whyUs.tradition.description',
    defaultTitle: 'Tradycja i doświadczenie',
    defaultDescription: 'Od 1981 roku tworzymy stolarkę najwyższej jakości, łącząc wieloletnie doświadczenie z nowoczesnymi technologiami.'
  },
  {
    id: 'individual',
    icon: '/images/icons/cowork-icon.png',
    titleKey: 'whyUs.individual.title',
    descriptionKey: 'whyUs.individual.description',
    defaultTitle: 'Indywidualne podejście',
    defaultDescription: 'Każde zlecenie traktujemy wyjątkowo, dostosowując rozwiązania do potrzeb i oczekiwań naszych klientów.'
  },
  {
    id: 'ecological',
    icon: '/images/icons/leaf-icon.png',
    titleKey: 'whyUs.ecological.title',
    descriptionKey: 'whyUs.ecological.description',
    defaultTitle: 'Ekologiczne materiały',
    defaultDescription: 'Wykorzystujemy wyłącznie certyfikowane, przyjazne środowisku materiały najwyższej jakości.'
  },
  {
    id: 'precision',
    icon: '/images/icons/tools-icon.png',
    titleKey: 'whyUs.precision.title',
    descriptionKey: 'whyUs.precision.description',
    defaultTitle: 'Precyzja wykonania',
    defaultDescription: 'Dbałość o najmniejsze detale i perfekcyjne wykończenie to nasza wizytówka.'
  },
  {
    id: 'warranty',
    icon: '/images/icons/shield-icon.png',
    titleKey: 'whyUs.warranty.title',
    descriptionKey: 'whyUs.warranty.description',
    defaultTitle: 'Gwarancja i serwis',
    defaultDescription: 'Zapewniamy wieloletnią gwarancję oraz profesjonalny serwis naszych produktów.'
  },
  {
    id: 'delivery',
    icon: '/images/icons/clock-icon.png',
    titleKey: 'whyUs.delivery.title',
    descriptionKey: 'whyUs.delivery.description',
    defaultTitle: 'Terminowość dostaw',
    defaultDescription: 'Dotrzymujemy ustalonych terminów realizacji, szanując czas naszych klientów.'
  }
];

const WhyUsSection = () => {
  const { t } = useTranslation();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Update navigation state
  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Custom navigation handlers
  const goToPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const goToNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  // Render feature card
  const renderFeatureCard = (feature) => (
    <FeatureCard key={feature.id}>
      <IconWrapper>
        <Icon
          src={feature.icon}
          alt={t(feature.titleKey, feature.defaultTitle)}
          loading="lazy"
        />
      </IconWrapper>
      <FeatureTitle>
        {t(feature.titleKey, feature.defaultTitle)}
      </FeatureTitle>
      <FeatureDescription>
        {t(feature.descriptionKey, feature.defaultDescription)}
      </FeatureDescription>
    </FeatureCard>
  );

  return (
    <WhyUsContainer>
      <MaxWidthContainer>
      <HeaderWrap className='full-width'>
        <ProductHeader>
          DLACZEGO MY
        </ProductHeader>
        <ProductHeaderSubtitle>Co odróznia nas od innych</ProductHeaderSubtitle>
      </HeaderWrap>
      {/* Desktop Grid - tylko na bardzo dużych ekranach */}
      <DesktopGrid>
        {features.map(renderFeatureCard)}
      </DesktopGrid>

      {/* Mobile/Tablet Swiper */}
      <MobileSwiperContainer>
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          onSlideChange={handleSlideChange}
          onSwiper={handleSlideChange}
          breakpoints={{
            576: {
              slidesPerView: 2,
              centeredSlides: false,
              spaceBetween: 30,
            },
            992: {
              slidesPerView: 3,
              centeredSlides: false,
              spaceBetween: 40,
            },
          }}
          speed={400}
          className="why-us-swiper"
        >
          {features.map((feature) => (
            <SwiperSlide key={feature.id}>
              {renderFeatureCard(feature)}
            </SwiperSlide>
          ))}
        </Swiper>

        <NavigationContainer>
          <PrevNavigationButton
            ref={prevRef}
            onClick={goToPrev}
            disabled={isBeginning}
            aria-label={t('navigation.previous', 'Poprzedni')}
          >
            <IoIosArrowForward />
          </PrevNavigationButton>

          <NextNavigationButton
            ref={nextRef}
            onClick={goToNext}
            disabled={isEnd}
            aria-label={t('navigation.next', 'Następny')}
          >
            <IoIosArrowForward />
          </NextNavigationButton>
        </NavigationContainer>
      </MobileSwiperContainer>
      </MaxWidthContainer>
    </WhyUsContainer>
  );
};

export default WhyUsSection;
