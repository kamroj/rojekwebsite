import React, { useMemo } from 'react';
import Page from '../components/common/Page';
import ProductSection from '../components/home/ProducSection';
import { useTranslation } from 'react-i18next';
import { PRODUCT_TYPES, VIDEO_SOURCES } from '../constants';

const ProductsPage = () => {
  const { t } = useTranslation();

  // Reuse the same tile UI as HomePage.
  // For now we show the same product types as on HomePage.
  const productData = useMemo(() => ({
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
      backgroundSrc: '/images/aboutus/drzwi-kafelka.png',
      videoSrc: VIDEO_SOURCES.FIRE_RESISTANT,
    },
  }), [t]);

  return (
    <Page imageSrc="/images/products/windows/top.jpg" title="Produkty">
      <ProductSection productData={productData} />
    </Page>
  );
};

export default ProductsPage;
