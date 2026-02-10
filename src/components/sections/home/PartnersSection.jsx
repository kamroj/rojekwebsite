// src/components/home/PartnersSection.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
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

  // Funkcja renderująca partnera dla mobile
  const renderMobilePartner = (partner) => (
    <a
      key={partner.id}
      className={styles.mobilePartnerItem}
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

  return (
      <MaxWidthContainer>
        <HeaderWrap className='full-width'>
          <ProductHeader>
            {t('sections.partners')}
          </ProductHeader>
          <ProductHeaderSubtitle>{t('partners.subtitle', 'Firmy, z którymi współpracujemy')}</ProductHeaderSubtitle>
        </HeaderWrap>
        <div className={styles.partnersGrid}>
          {partnersData.map(renderDesktopPartner)}
        </div>

        {/* Mobile version - Swiper carousel */}
        <div className={styles.mobileSwiper}>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView="auto"
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 0.5,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: false,
            }}
            speed={5000}
            allowTouchMove={true}
            grabCursor={true}
            freeMode={false}
            loopAdditionalSlides={2}
            className="partners-swiper"
          >
            {/* Renderujemy partnerów w Swiper slides */}
            {partnersData.map((partner) => (
              <SwiperSlide key={partner.id}>
                {renderMobilePartner(partner)}
              </SwiperSlide>
            ))}
            {/* Duplikujemy dla lepszej pętli */}
            {partnersData.map((partner) => (
              <SwiperSlide key={`duplicate-${partner.id}`}>
                {renderMobilePartner(partner)}
              </SwiperSlide>
            ))}
            {/* Dodatkowa duplikacja dla super płynnej pętli */}
            {partnersData.map((partner) => (
              <SwiperSlide key={`duplicate2-${partner.id}`}>
                {renderMobilePartner(partner)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </MaxWidthContainer>
  );
};

export default PartnersSection;
