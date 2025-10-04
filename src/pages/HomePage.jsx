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
      margin: 10px 0 20px 0;
    }
  `;

export const ProductHeader = styled.div`
    position: relative;
    z-index: 2;
    backdrop-filter: blur(2px);

    display: flex;
    padding: 10px 20px;
    background-color: ${({ $bg = '#002a12d9' }) => $bg};
    color: #ffffff;
    margin-bottom: 30px;
    margin-top: 15px;
    font-size: 2rem;
    justify-content: center;
    padding: ${({ $reversed }) => ($reversed ? "6px 50px 10px 20px" : "6px 20px 10px 50px")};
  
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
    }
  
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
      max-width: 200px;
      padding: ${({ $reversed }) => ($reversed ? "6px 50px 10px 20px" : "6px 20px 10px 50px")};
      font-size: 1.4rem;
    }
  `;

export const ProductHeaderSubtitle = styled.div`
    position: relative;
    z-index: 1;
    margin-top: -40px;
    text-align: ${({ $reversed }) => ($reversed ? 'left' : 'right')};
    margin-left: ${({ $reversed }) => ($reversed ? '0' : '80px')};
    margin-right: ${({ $reversed }) => ($reversed ? '80px' : '0')};
    color: #ffffffde;
    background-color: ${({ $bg = '#0f0f0f' }) => $bg};
    padding: 10px 20px 6px 10px;
    max-width: 100%;
    font-size: 1.4rem;
    box-sizing: border-box;
  
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
      margin-left: ${({ $reversed }) => ($reversed ? '0' : '40px')};
      margin-right: ${({ $reversed }) => ($reversed ? '40px' : '0')};
    }
  
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      width: auto;
      max-width: 100%;
      /* margin-left: ${({ $reversed }) => ($reversed ? '-15px' : '0')}; */
      /* margin-right: ${({ $reversed }) => ($reversed ? '0' : '-15px')}; */
      left: auto;
      right: auto;
    }
  
  `;

const HomePage = () => {
  const { t } = useTranslation();

  const productData = {
    [PRODUCT_TYPES.WINDOWS]: {
      id: PRODUCT_TYPES.WINDOWS,
      name: t('products.windows.name'),
      videoSrc: VIDEO_SOURCES.WINDOWS,
      posterSrc: '/images/posters/window_poster.jpg',
      description: t('products.windows.description'),
      benefits: t('products.windows.benefits', { returnObjects: true })
    },
    [PRODUCT_TYPES.WOOD_ALU]: {
      id: PRODUCT_TYPES.WOOD_ALU,
      name: t('products.woodAlu.name'),
      videoSrc: VIDEO_SOURCES.WOOD_ALU,
      posterSrc: '/images/posters/wood_alu_poster.jpg',
      description: t('products.woodAlu.description'),
      benefits: t('products.woodAlu.benefits', { returnObjects: true })
    },
    [PRODUCT_TYPES.EXTERIOR_DOORS]: {
      id: PRODUCT_TYPES.EXTERIOR_DOORS,
      name: t('products.exteriorDoors.name'),
      videoSrc: VIDEO_SOURCES.EXTERIOR_DOORS,
      posterSrc: '/images/posters/door_poster.jpg',
      description: t('products.exteriorDoors.description'),
      benefits: t('products.exteriorDoors.benefits', { returnObjects: true })
    },
    [PRODUCT_TYPES.FIRE_DOORS]: {
      id: PRODUCT_TYPES.FIRE_DOORS,
      name: t('products.fireDoors.name'),
      videoSrc: VIDEO_SOURCES.FIRE_DOORS,
      posterSrc: '/images/posters/fire_door_poster.jpg',
      description: t('products.fireDoors.description'),
      benefits: t('products.fireDoors.benefits', { returnObjects: true })
    },
    [PRODUCT_TYPES.SLIDING]: {
      id: PRODUCT_TYPES.SLIDING,
      name: t('products.sliding.name'),
      videoSrc: VIDEO_SOURCES.SLIDING,
      posterSrc: '/images/posters/hs_poster.jpg',
      description: t('products.sliding.description'),
      benefits: t('products.sliding.benefits', { returnObjects: true })
    },
    [PRODUCT_TYPES.PSK]: {
      id: PRODUCT_TYPES.PSK,
      name: t('products.psk.name'),
      videoSrc: VIDEO_SOURCES.PSK,
      posterSrc: '/images/posters/psk_poster.jpg',
      description: t('products.psk.description'),
      benefits: t('products.psk.benefits', { returnObjects: true })
    }
  };

  const realizationData = REALIZATION_IMAGES.map((image, index) => ({
    ...image,
    title: t(`realizations.items.${index}.title`, `Realization ${index + 1}`)
  }));

  return (
    <>
      <IntroSection />

      {/* <Section label={t('sections.products')} labelPosition="left"> */}
      <ProductSection
        productData={productData}
        initialProductId={PRODUCT_TYPES.WINDOWS}
      />
      {/* </Section> */}

      <Section
        dark
        customStyles={`
          background: rgb(15 15 15 / var(--tw-bg-opacity, 1));
        `}
        noPadding
        $noInset
      >
        <HeaderWrap className='full-width' $reversed>
          <ProductHeader $bg="#e6c61942" $reversed>
            REALIZACJE
          </ProductHeader>
          <ProductHeaderSubtitle $bg="#706a0026;" $reversed>Zobacz nasze realizacje</ProductHeaderSubtitle>
        </HeaderWrap>
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
