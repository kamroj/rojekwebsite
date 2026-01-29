import React from 'react';
import { useTranslation } from 'react-i18next';
import IntroSection from '../components/home/IntroSection';
import Section from '../components/common/Section';
import ProductSection from '../components/home/ProducSection';
import RealizationsGallery from '../components/gallery/RealizationsGallery';
import WhyUsSection from '../components/home/WhyUsSection';
import CompanyPresentationSection from '../components/home/CompanyPresentationSection';
import PartnersSection from '../components/home/PartnersSection';
import {
  PRODUCT_TYPES,
  VIDEO_SOURCES,
  REALIZATION_IMAGES,
  GALLERY_CONFIG
} from '../constants';
import styled from 'styled-components';

export const HeaderWrap = styled.div`
    position: relative;
    isolation: isolate;
    display: inline-flex;
    width: 100%;
    flex-direction: column;
    margin: 20px 0 40px 0;
    align-items: ${({ $reversed }) => ($reversed ? 'flex-end' : 'flex-start')};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      margin: 20px 0;
    }
  `;

export const ProductHeader = styled.div`
  font-size: 3rem;
  font-weight: 300;
  line-height: 1.2;
  

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
  `;

export const ProductHeaderSubtitle = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.6;
  color: ${({ $blackBackground }) => ($blackBackground ? "#259108c5" : '#015b0e')};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 1.4rem;
  }
  `;

const HomePage = () => {
  const { t } = useTranslation();

  const productData = {
    [PRODUCT_TYPES.WINDOWS]: {
      id: PRODUCT_TYPES.WINDOWS,
      name: t('products.windows.name'),
      description: t('products.windows.description'),
      backgroundSrc: '/images/aboutus/okno-kafelka.png',
      videoSrc: VIDEO_SOURCES.WINDOWS,
    },
    [PRODUCT_TYPES.DOORS]: {
      id: PRODUCT_TYPES.DOORS,
      name: t('products.doors.name'),
      description: t('products.doors.description'),
      backgroundSrc: '/images/aboutus/drzwi-kafelka.png',
      videoSrc: VIDEO_SOURCES.DOORS,
    },
    [PRODUCT_TYPES.TERRACE_DOORS]: {
      id: PRODUCT_TYPES.TERRACE_DOORS,
      name: t('products.terraceDoors.name'),
      description: t('products.terraceDoors.description'),
      backgroundSrc: '/images/aboutus/hs-kafelka.png',

      videoSrc: VIDEO_SOURCES.TERRACE_DOORS,
    },
    [PRODUCT_TYPES.FIRE_RESISTANT]: {
      id: PRODUCT_TYPES.FIRE_RESISTANT,
      name: t('products.fireResistant.name'),
      description: t('products.fireResistant.description'),
      backgroundSrc: '/images/aboutus/drzwi-ppoz-kafelka.png',
      videoSrc: VIDEO_SOURCES.FIRE_RESISTANT,
    },
  };

  const realizationData = REALIZATION_IMAGES.map((image, index) => ({
    ...image,
    title: t(`realizations.items.${index}.title`, `Realization ${index + 1}`)
  }));

  return (
    <>
      <IntroSection />
      <ProductSection
        productData={productData}
        initialProductId={PRODUCT_TYPES.WINDOWS}
      />
      <Section
        noMarginBottom
        dark
        customStyles={`
          background: rgb(15 15 15 / var(--tw-bg-opacity, 1));
        `}
        noPadding
      >
        <RealizationsGallery
          images={realizationData}
          options={{
            slidesPerViewDesktop: GALLERY_CONFIG.DEFAULT_SLIDES_PER_VIEW.DESKTOP,
            slidesPerViewTablet: GALLERY_CONFIG.DEFAULT_SLIDES_PER_VIEW.TABLET,
            slidesPerViewMobile: GALLERY_CONFIG.DEFAULT_SLIDES_PER_VIEW.MOBILE,
            delay: GALLERY_CONFIG.DEFAULT_DELAY,
          }}
        />
      </Section>
      <WhyUsSection />
      <CompanyPresentationSection />
      <PartnersSection />
    </>
  );
};

export default HomePage;
