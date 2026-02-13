import React from 'react';
import { useTranslation } from 'react-i18next';
import IntroSection from '../components/sections/home/IntroSection';
import Section from '../components/ui/Section';
import ProductSection from '../components/sections/home/ProducSection';
import RealizationsGallery from '../components/sections/realizations/RealizationsGallery';
import WhyUsSection from '../components/sections/home/WhyUsSection';
import CompanyPresentationSection from '../components/sections/home/CompanyPresentationSection';
import PartnersSection from '../components/sections/home/PartnersSection';
import {
  PRODUCT_TYPES,
  VIDEO_SOURCES,
  REALIZATION_IMAGES,
  GALLERY_CONFIG
} from '../constants/index.js';

import styles from './HomeView.module.css';

export function HeaderWrap({ reversed, className, children, ...rest }) {
  const classes = [styles.headerWrap, reversed ? styles.headerWrapReversed : null, className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export function ProductHeader({ className, children, ...rest }) {
  const classes = [styles.productHeader, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export function ProductHeaderSubtitle({ blackBackground, className, children, ...rest }) {
  const classes = [
    styles.productHeaderSubtitle,
    blackBackground ? styles.productHeaderSubtitleBlackBackground : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

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
        style={{ background: 'rgb(15 15 15 / var(--tw-bg-opacity, 1))' }}
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
