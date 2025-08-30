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
      
      <Section label={t('sections.products')} labelPosition="left">
        <ProductSection 
          productData={productData} 
          initialProductId={PRODUCT_TYPES.WINDOWS}
        />
      </Section>
      
      <Section 
        dark 
        label={t('sections.realizations')}
        customStyles={`
          background: linear-gradient(2deg, rgba(0, 0, 0, 1) 0%, #001c13 80%, #003d29 110%);
          
          @media (max-width: 992px) {
            background: linear-gradient(2deg, rgba(0, 0, 0, 1) 0%, #001c13 95%, #003d29 110%);
          }
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
      
      <Section label={t('sections.whyUs')} labelPosition="left">
        <WhyUsSection />
      </Section>
      
      <Section dark label={t('sections.companyPresentation')} labelPosition="right" noPadding>
        <CompanyPresentationSection />
      </Section>
      
      <Section label={t('sections.partners')} labelPosition="left">
        <PartnersSection />
      </Section>
    </>
  );
};

export default HomePage;
