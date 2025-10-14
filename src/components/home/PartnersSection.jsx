// src/components/home/PartnersSection.jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import MaxWidthContainer from '../common/MaxWidthContainer';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../pages/HomePage';

const PartnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacings.large};
  align-items: center;
  justify-items: center;
  margin-bottom: ${({ theme }) => theme.spacings.xlarge};
  margin-top: ${({ theme }) => theme.spacings.large};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

// Kontener dla Swiper na mobile
const MobileSwiperContainer = styled.div`
  display: none;
  margin-bottom: ${({ theme }) => theme.spacings.large};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
    width: 100%;
    padding: ${({ theme }) => theme.spacings.medium} 0;
    
    .swiper {
      width: 100%;
      height: auto;
      overflow: visible;
    }
    
    .swiper-slide {
      width: auto !important;
      height: auto;
    }
  }
`;

// Kontener dla pojedynczego partnera - desktop
const PartnerItem = styled.a`
  display: block;
  width: 100%;
  max-width: 280px;
  height: 200px;
  padding: ${({ theme }) => theme.spacings.large};
  transition: transform ${({ theme }) => theme.transitions.default},
              box-shadow ${({ theme }) => theme.transitions.default},
              border-color ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  text-decoration: none;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  box-shadow: rgb(0 0 0 / 14%) 0px 2px 18px 0px;
  border: 1px solid #003d2988;
  border-radius: 4px;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    border-color: ${({ theme }) => theme.colors.bottleGreen};
  }
  
  &:active {
    transform: translateY(-4px);
  }
`;

// Kontener dla mobilnej wersji partnera
const MobilePartnerItem = styled.a`
  display: block;
  width: 220px;
  height: 140px;
  border: 1px solid #003d2988;
  border-radius: 4px;
  padding: ${({ theme }) => theme.spacings.medium};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  text-decoration: none;
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.default};
  margin-right: ${({ theme }) => theme.spacings.medium};
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  box-shadow: rgb(0 0 0 / 14%) 0px 2px 18px 0px;
  
  &:hover {
    box-shadow: rgb(0 0 0 / 20%) 0px 4px 24px 0px;
    border-color: ${({ theme }) => theme.colors.bottleGreenLight};
    transform: scale(1.02);
  }
`;

// Obrazek partnera
const PartnerLogo = styled.img`
  width: 90%;
  height: 90%;
  object-fit: contain;
  transition: transform ${({ theme }) => theme.transitions.default};
  
  ${PartnerItem}:hover & {
    transform: scale(1.05);
  }
  
  ${MobilePartnerItem}:hover & {
    transform: scale(1.03);
  }
`;

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

  const renderDesktopPartner = (partner) => (
    <PartnerItem
      key={partner.id}
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('partners.visitWebsite', { name: partner.name }, `Odwiedź stronę ${partner.name}`)}
    >
      <PartnerLogo
        src={partner.logo}
        alt={partner.alt}
        loading="lazy"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `<div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: #666;
            font-size: 1.6rem;
            text-align: center;
            font-weight: 500;
          ">${partner.name}</div>`;
        }}
      />
    </PartnerItem>
  );

  // Funkcja renderująca partnera dla mobile
  const renderMobilePartner = (partner) => (
    <MobilePartnerItem
      key={partner.id}
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('partners.visitWebsite', { name: partner.name }, `Odwiedź stronę ${partner.name}`)}
    >
      <PartnerLogo
        src={partner.logo}
        alt={partner.alt}
        loading="lazy"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `<div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: #666;
            font-size: 1.4rem;
            text-align: center;
            font-weight: 500;
          ">${partner.name}</div>`;
        }}
      />
    </MobilePartnerItem>
  );

  return (
      <MaxWidthContainer>
        <HeaderWrap className='full-width'>
          <ProductHeader>
            PARTNERZY
          </ProductHeader>
          <ProductHeaderSubtitle>Firmy, z którymi współpracujemy</ProductHeaderSubtitle>
        </HeaderWrap>
        <PartnersGrid>
          {partnersData.map(renderDesktopPartner)}
        </PartnersGrid>

        {/* Mobile version - Swiper carousel */}
        <MobileSwiperContainer>
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
        </MobileSwiperContainer>
      </MaxWidthContainer>
  );
};

export default PartnersSection;
