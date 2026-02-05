import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../../views/HomeView';
import MaxWidthContainer from '../../ui/MaxWidthContainer';
import styles from './WhyUsSection.module.css';

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
    <div className={styles.featureCard} key={feature.id}>
      <div className={styles.iconWrapper}>
        <img
          className={styles.icon}
          src={feature.icon}
          alt={t(feature.titleKey, feature.defaultTitle)}
          loading="lazy"
        />
      </div>
      <h3 className={styles.featureTitle}>
        {t(feature.titleKey, feature.defaultTitle)}
      </h3>
      <p className={styles.featureDescription}>
        {t(feature.descriptionKey, feature.defaultDescription)}
      </p>
    </div>
  );

  return (
    <div className={styles.container}>
      <MaxWidthContainer>
        <HeaderWrap className='full-width'>
          <ProductHeader>
            {t('sections.whyUs')}
          </ProductHeader>
          <ProductHeaderSubtitle>{t('aboutPage.headers.whyUsSubtitle', 'Co odróżnia nas od innych')}</ProductHeaderSubtitle>
        </HeaderWrap>
        <div className={styles.desktopGrid}>
          {features.map(renderFeatureCard)}
        </div>

        <div className={styles.mobileSwiper}>
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

          <button
            className={`${styles.sideArrow} ${styles.sideArrowLeft}`}
            onClick={goToPrev}
            disabled={isBeginning}
            aria-label={t('navigation.previous', 'Poprzedni')}
          >
            <IoIosArrowForward className={styles.arrowIcon} />
          </button>
          <button
            className={`${styles.sideArrow} ${styles.sideArrowRight}`}
            onClick={goToNext}
            disabled={isEnd}
            aria-label={t('navigation.next', 'Następny')}
          >
            <IoIosArrowForward className={styles.arrowIcon} />
          </button>
        </div>
      </MaxWidthContainer>
    </div>
  );
};

export default WhyUsSection;
