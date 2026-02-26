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
    icon: '/images/icons/window-icon.webp',
    titleKey: 'whyUs.tradition.title',
    descriptionKey: 'whyUs.tradition.description',
    defaultTitle: 'Tradycja i doświadczenie',
    defaultDescription: 'Od 1981 roku tworzymy stolarkę najwyższej jakości, łącząc wieloletnie doświadczenie z nowoczesnymi technologiami.'
  },
  {
    id: 'individual',
    icon: '/images/icons/cowork-icon.webp',
    titleKey: 'whyUs.individual.title',
    descriptionKey: 'whyUs.individual.description',
    defaultTitle: 'Indywidualne podejście',
    defaultDescription: 'Każde zlecenie traktujemy wyjątkowo, dostosowując rozwiązania do potrzeb i oczekiwań naszych klientów.'
  },
  {
    id: 'ecological',
    icon: '/images/icons/leaf-icon.webp',
    titleKey: 'whyUs.ecological.title',
    descriptionKey: 'whyUs.ecological.description',
    defaultTitle: 'Ekologiczne materiały',
    defaultDescription: 'Wykorzystujemy wyłącznie certyfikowane, przyjazne środowisku materiały najwyższej jakości.'
  },
  {
    id: 'precision',
    icon: '/images/icons/tools-icon.webp',
    titleKey: 'whyUs.precision.title',
    descriptionKey: 'whyUs.precision.description',
    defaultTitle: 'Precyzja wykonania',
    defaultDescription: 'Dbałość o najmniejsze detale i perfekcyjne wykończenie to nasza wizytówka.'
  },
  {
    id: 'warranty',
    icon: '/images/icons/shield-icon.webp',
    titleKey: 'whyUs.warranty.title',
    descriptionKey: 'whyUs.warranty.description',
    defaultTitle: 'Gwarancja i serwis',
    defaultDescription: 'Zapewniamy wieloletnią gwarancję oraz profesjonalny serwis naszych produktów.'
  },
  {
    id: 'delivery',
    icon: '/images/icons/clock-icon.webp',
    titleKey: 'whyUs.delivery.title',
    descriptionKey: 'whyUs.delivery.description',
    defaultTitle: 'Terminowość dostaw',
    defaultDescription: 'Dotrzymujemy ustalonych terminów realizacji, szanując czas naszych klientów.'
  }
];

const WhyUsSection = () => {
  const { t, i18n } = useTranslation();
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const currentLang = (i18n?.language || 'pl').split('-')[0];

  const seoLeadByLang = {
    pl: [
      <>
        <strong>ROJEK Okna i drzwi to lokalna marka z Krakowa i doświadczony producent okien i drzwi drewnianych</strong>,
        {' '}specjalizujący się w projektowaniu oraz produkcji wysokiej jakości stolarki dla inwestycji prywatnych i komercyjnych. Tworzymy okna i drzwi drewniane na wymiar, łącząc tradycyjne rzemiosło, precyzję wykonania oraz nowoczesne technologie produkcji, co gwarantuje trwałość, estetykę i bardzo dobre parametry użytkowe.
      </>,
      <>
        W naszej ofercie znajdują się m.in. <strong>okna przesuwne HS drewniane oraz drewno-aluminium</strong>,
        {' '}które umożliwiają wykonanie dużych przeszkleń i zapewniają wysoki komfort użytkowania. Produkujemy również <strong>okna i drzwi przeciwpożarowe EI30 i EI60</strong>,
        {' '}przeznaczone do budynków mieszkalnych, użyteczności publicznej i obiektów komercyjnych. Jako producent z Krakowa realizujemy także <strong>okna zabytkowe drewniane</strong>,
        {' '}wymagające indywidualnego podejścia, zgodności z architekturą obiektu oraz najwyższej jakości wykonania.
      </>,
    ],
    en: [
      <>
        <strong>ROJEK Okna i drzwi is a local brand from Kraków and an experienced manufacturer of wooden windows and doors</strong>,
        {' '}specializing in the design and production of high-quality joinery for private and commercial projects. We create made-to-measure wooden windows and doors, combining traditional craftsmanship, precision workmanship, and modern production technologies, which guarantees durability, aesthetics, and very good performance parameters.
      </>,
      <>
        Our offer includes, among others, <strong>wooden and wood-aluminium HS sliding windows</strong>,
        {' '}which make it possible to create large glazed areas and ensure high user comfort. We also produce <strong>EI30 and EI60 fire-rated windows and doors</strong>,
        {' '}intended for residential, public-use, and commercial buildings. As a manufacturer from Kraków, we also deliver <strong>heritage wooden windows</strong>,
        {' '}which require an individual approach, compatibility with the building architecture, and the highest quality of workmanship.
      </>,
    ],
    de: [
      <>
        <strong>ROJEK Okna i drzwi ist eine lokale Marke aus Kraków und ein erfahrener Hersteller von Holzfenstern und Holztüren</strong>,
        {' '}spezialisiert auf die Planung und Produktion hochwertiger Tischlerelemente für private und gewerbliche Investitionen. Wir fertigen maßgefertigte Holzfenster und Holztüren und verbinden traditionelles Handwerk, präzise Ausführung und moderne Produktionstechnologien, was Langlebigkeit, Ästhetik und sehr gute Nutzungsparameter garantiert.
      </>,
      <>
        Unser Angebot umfasst unter anderem <strong>HS-Schiebefenster aus Holz sowie Holz-Aluminium</strong>,
        {' '}die die Ausführung großer Verglasungen ermöglichen und einen hohen Nutzungskomfort gewährleisten. Darüber hinaus produzieren wir <strong>EI30- und EI60-Brandschutzfenster und -türen</strong>,
        {' '}die für Wohngebäude, öffentliche Einrichtungen und gewerbliche Objekte bestimmt sind. Als Hersteller aus Kraków realisieren wir außerdem <strong>historische Holzfenster</strong>,
        {' '}die eine individuelle Herangehensweise, die Übereinstimmung mit der Architektur des Objekts sowie höchste Ausführungsqualität erfordern.
      </>,
    ],
    fr: [
      <>
        <strong>ROJEK Okna i drzwi est une marque locale de Cracovie et un fabricant expérimenté de fenêtres et portes en bois</strong>,
        {' '}spécialisé dans la conception et la production de menuiseries de haute qualité pour des investissements privés et commerciaux. Nous créons des fenêtres et portes en bois sur mesure, en combinant artisanat traditionnel, précision d’exécution et technologies de production modernes, ce qui garantit durabilité, esthétique et de très bons paramètres d’utilisation.
      </>,
      <>
        Notre offre comprend notamment <strong>des fenêtres coulissantes HS en bois et bois-aluminium</strong>,
        {' '}qui permettent la réalisation de grandes surfaces vitrées et assurent un confort d’utilisation élevé. Nous produisons également <strong>des fenêtres et portes coupe-feu EI30 et EI60</strong>,
        {' '}destinées aux bâtiments résidentiels, aux établissements publics et aux bâtiments commerciaux. En tant que fabricant de Cracovie, nous réalisons également <strong>des fenêtres patrimoniales en bois</strong>,
        {' '}qui exigent une approche individuelle, la conformité avec l’architecture du bâtiment et la plus haute qualité d’exécution.
      </>,
    ],
  };

  const seoLeadParagraphs = seoLeadByLang[currentLang] || seoLeadByLang.pl;

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
          loading="eager"
          fetchPriority="high"
          decoding="async"
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

        <div className={styles.seoLead}>
          {seoLeadParagraphs.map((paragraph, index) => (
            <p key={`why-us-seo-lead-${index}`}>{paragraph}</p>
          ))}
        </div>

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
