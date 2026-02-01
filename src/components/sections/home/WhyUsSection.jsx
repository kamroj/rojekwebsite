import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import styled from 'styled-components';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../../views/HomeView';
import MaxWidthContainer from '../../ui/MaxWidthContainer';

const WhyUsContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  position: relative;
  padding-bottom: 30px;
`;

const DesktopGrid = styled.div`
  display: none;
  
  @media (min-width: 1400px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4rem;
  }
`;

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

const NavigationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  
  @media (min-width: 1400px) {
    display: none;
  }
`;

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

const Icon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 1;
  position: relative;
`;

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

const FeatureDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.3rem;
  }
`;

const NavigationButton = styled.button`
  appearance: none;
  margin: 0;
  padding: 8px 14px;
  border: 1px solid ${({ theme }) => theme.colors.bottleGreenLight};
  border-radius: 8px;
  background-color: transparent;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  color: #015123;
  font-size: 1.8rem;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  outline: none;
  transition: opacity ${({ theme }) => theme.transitions.default},
              background-color ${({ theme }) => theme.transitions.default},
              border-color ${({ theme }) => theme.transitions.default};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  svg {
    display: block;
    width: 1.2em;
    height: 1.2em;
    color: #015123;
    transition: transform 0.22s ease, color 0.22s ease;
    transform: translateX(0);
  }

  &:hover:not(:disabled) {
    background-color: rgba(1, 85, 8, 0.08);
    border-color: ${({ theme }) => theme.colors.bottleGreen};
  }

  &:hover:not(:disabled) svg {
    transform: translateX(6px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 6px 12px;
    font-size: 2.2rem;
  }
`;

const PrevNavigationButton = styled(NavigationButton)`
  svg {
    transform: rotate(180deg) translateX(0);
  }

  &:hover:not(:disabled) svg {
    transform: rotate(180deg) translateX(-6px);
  }
`;

const NextNavigationButton = styled(NavigationButton)`
  svg {
    transform: translateX(0);
  }

  &:hover:not(:disabled) svg {
    transform: translateX(6px);
  }
`;

const MobileSideArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 44px;
  height: 64px;
  border: none;
  background: transparent;
  color: #015123;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => disabled ? 0.35 : 1};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  transition: transform 0.18s ease, opacity ${({ theme }) => theme.transitions.default};
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  svg {
    width: 2.2rem;
    height: 2.2rem;
    color: #015123;
    transform: translateX(0);
    transition: transform 0.18s ease;
  }

  &:hover:not(:disabled) svg {
    transform: translateX(4px);
  }

  @media (min-width: 1400px) {
    display: none;
  }
`;

const MobileSideArrowLeft = styled(MobileSideArrow)`
  left: 8px;
  svg {
    transform: rotate(180deg) translateX(0);
  }
  &:hover:not(:disabled) svg {
    transform: rotate(180deg) translateX(-4px);
  }
`;

const MobileSideArrowRight = styled(MobileSideArrow)`
  right: 8px;
`;

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
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

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
            {t('sections.whyUs')}
          </ProductHeader>
          <ProductHeaderSubtitle>{t('aboutPage.headers.whyUsSubtitle', 'Co odróżnia nas od innych')}</ProductHeaderSubtitle>
        </HeaderWrap>
        <DesktopGrid>
          {features.map(renderFeatureCard)}
        </DesktopGrid>

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

          <MobileSideArrowLeft
            onClick={goToPrev}
            disabled={isBeginning}
            aria-label={t('navigation.previous', 'Poprzedni')}
          >
            <IoIosArrowForward />
          </MobileSideArrowLeft>
          <MobileSideArrowRight
            onClick={goToNext}
            disabled={isEnd}
            aria-label={t('navigation.next', 'Następny')}
          >
            <IoIosArrowForward />
          </MobileSideArrowRight>
        </MobileSwiperContainer>
      </MaxWidthContainer>
    </WhyUsContainer>
  );
};

export default WhyUsSection;
