// src/pages/products/DoorProductDetail.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../../components/ui/Page';
import Section from '../../components/ui/Section';
import { DOOR_SPECS_DEFS, DOOR_SPECS_ORDER_LIST } from '../../data/products/doors';
import { WINDOW_COLORS_PALETTE } from '../../data/products/windows';
import SanityPortableText from '../../components/portable/SanityPortableText';
import styles from './DoorProductDetail.module.css';
import {
  ProductDetailHero,
  ProductDetailSpecs,
  ProductDetailFeatures,
  ProductDetailColors,
  ProductDetailAdvantages,
  ProductDetailFAQ,
  ProductDetailCTA,
} from '../../components/sections/products/detail';
import { DOOR_FAQ_FALLBACK } from '../../data/products/faqFallback.js';

// ============================================
// STANDARD FEATURES SECTION COMPONENT
// ============================================

const DoorStandardFeaturesSection = ({ t }) => {
  const lockFeatures = [
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('productDetail.doors.lock.feature1.title', 'Ryglowanie w 3 punktach'),
      desc: t('productDetail.doors.lock.feature1.desc', 'Blokada w górze, środku i na dole skrzydła'),
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: t('productDetail.doors.lock.feature2.title', 'Lepszy docisk uszczelek'),
      desc: t('productDetail.doors.lock.feature2.desc', 'Równomierne rozłożenie siły na całej wysokości'),
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t('productDetail.doors.lock.feature3.title', 'Wysoka odporność na włamanie'),
      desc: t('productDetail.doors.lock.feature3.desc', 'Znacznie trudniejsze do wyważenia niż standardowe'),
    },
  ];

  const thresholdFeatures = [
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('productDetail.doors.threshold.benefit1.title', 'Łatwe przejście'),
      desc: t('productDetail.doors.threshold.benefit1.desc', 'Minimalna wysokość eliminuje potknięcia'),
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: t('productDetail.doors.threshold.benefit2.title', 'Bez barier'),
      desc: t('productDetail.doors.threshold.benefit2.desc', 'Dostępność dla wózków i osób starszych'),
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('productDetail.doors.threshold.benefit3.title', 'Trwałe aluminium'),
      desc: t('productDetail.doors.threshold.benefit3.desc', 'Odporne na korozję i warunki atmosferyczne'),
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      title: t('productDetail.doors.threshold.benefit4.title', 'Odprowadzanie wody'),
      desc: t('productDetail.doors.threshold.benefit4.desc', 'Specjalny profil kieruje wodę na zewnątrz'),
    },
  ];

  return (
    <section className={styles.standardSectionWrapper}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <span className={styles.headerOverline}>
          {t('productDetail.doors.standard.overline', 'Wszystko co potrzebujesz')}
        </span>
        <h2 className={styles.headerTitle}>
          {t('productDetail.doors.standard.title', 'W standardzie')}
        </h2>
        <p className={styles.headerSubtitle}>
          {t('productDetail.doors.standard.subtitle', 'Bez dodatkowych opłat')}
        </p>
      </div>

      {/* Lock Block */}
      <div className={styles.blockWrapper}>
        <div className={styles.contentGrid}>
          <div className={`${styles.textContent} ${styles.textContentWithPadding}`}>
            <div className={styles.titleBlock}>
              <span className={styles.overline}>{t('productDetail.doors.lock.overline', 'Bezpieczeństwo')}</span>
              <h2 className={styles.blockTitle}>
                {t('productDetail.doors.lock.title', 'Zamek 3-punktowy')}
              </h2>
            </div>

            <p className={styles.description}>
              {t(
                'productDetail.doors.lock.description',
                'Bezpieczeństwo zaczyna się od solidnego ryglowania. Nasz standardowy zamek 3-punktowy blokuje skrzydło w trzech miejscach jednocześnie — zwiększając odporność na wyważenie i zapewniając lepszy docisk uszczelek na całej wysokości drzwi.'
              )}
            </p>

            <div className={styles.featuresList}>
              {lockFeatures.map((feature, idx) => (
                <div className={styles.featureItem} key={idx}>
                  <div className={styles.featureIconBox}>{feature.icon}</div>
                  <div className={styles.featureTextBlock}>
                    <span className={styles.featureTitle}>{feature.title}</span>
                    <span className={styles.featureDesc}>{feature.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <div className={styles.glowEffect} />
              <img
                className={styles.productImage}
                src="/images/products/doors/lock-3point.png"
                alt={t('productDetail.doors.lock.imageAlt', 'Zamek 3-punktowy')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Block */}
      <div className={`${styles.contentGrid} ${styles.contentGridReversed} ${styles.contentGridWithPadding}`}>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <div className={styles.glowEffect} />
            <img
              className={styles.productImage}
              src="/images/products/doors/threshold-alu.png"
              alt={t('productDetail.doors.threshold.imageAlt', 'Niski próg aluminiowy')}
            />
          </div>
        </div>

        <div className={styles.textContent}>
          <div className={styles.titleBlock}>
            <span className={styles.overline}>{t('productDetail.doors.threshold.overline', 'Komfort użytkowania')}</span>
            <h2 className={styles.blockTitle}>
              {t('productDetail.doors.threshold.title', 'Niski próg aluminiowy')}
            </h2>
            <p className={styles.blockSubtitle}>
              {t(
                'productDetail.doors.threshold.description',
                'Przemyślany detal, który realnie wpływa na komfort codziennego użytkowania. Zaledwie 20mm wysokości zapewnia swobodne przejście bez potykania się.'
              )}
            </p>
          </div>

          <div className={styles.featuresList}>
            {thresholdFeatures.map((feature, idx) => (
              <div className={styles.featureItem} key={idx}>
                <div className={styles.featureIconBox}>{feature.icon}</div>
                <div className={styles.featureTextBlock}>
                  <span className={styles.featureTitle}>{feature.title}</span>
                  <span className={styles.featureDesc}>{feature.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const DoorProductDetail = ({ product }) => {
  const { t } = useTranslation();

  const specTooltipKeyMap = {
    profileThickness: 'productSpecs.tooltips.profileThickness',
    thermalTransmittance: 'productSpecs.tooltips.thermalTransmittance',
    waterTightness: 'productSpecs.tooltips.waterTightness',
  };

  // Keep colors static by requirement (independent from CMS product data).
  const colors = WINDOW_COLORS_PALETTE;

  const longDescriptionContent = Array.isArray(product?.longDescription) ? (
    <SanityPortableText value={product.longDescription} />
  ) : (
    product.longDescription
  );

  const faqItems =
    Array.isArray(product?.faq) && product.faq.length > 0 ? product.faq : DOOR_FAQ_FALLBACK;

  const categoryLabel = t(
    `products.${product.categoryKey || 'exteriorDoors'}.name`,
    product.category
  );

  const featuresTitle = t('productDetail.doors.featuresTitle', {
    product: product.name,
    defaultValue: 'Co wyróżnia drzwi {{product}}?',
  });

  const colorsTitle = t('productDetail.doors.colorsTitle', 'Kolorystyka RAL');
  const colorsMostPopular = t('productDetail.doors.colorsMostPopular', 'Najczęściej wybierane kolory');
  const colorsFullPalette = t('productDetail.doors.colorsFullPalette', 'Pełna paleta kolorów RAL');

  const advantagesTitle = t('productDetail.doors.advantagesTitle', {
    product: product.name,
    defaultValue: 'Dlaczego warto wybrać {{product}}?',
  });

  const ctaTitle = t('productDetail.doors.cta.title', {
    product: product.name,
    defaultValue: 'Zainteresowany drzwiami {{product}}?',
  });
  const ctaDescription = t(
    'productDetail.doors.cta.description',
    'Nasi eksperci pomogą Ci dobrać idealne rozwiązanie dla Twojego domu. Skontaktuj się z nami, aby uzyskać bezpłatną wycenę.'
  );
  const ctaNote = t('productDetail.doors.cta.note', 'Odpowiadamy w ciągu 24 godzin');

  return (
    <Page
      imageSrc={product.headerImage}
      headerImage={product.headerImageSanity}
      title={product.name}
      headerProps={{
        badge: { label: product.name },
        headerContent: {
          content: {
            isSubpage: true,
            pageType: 'product',
            subpageType: 'product',
          },
        },
      }}
    >
      {/* Main Product Info */}
      <Section>
        <ProductDetailHero
          product={product}
          categoryLabel={categoryLabel}
          longDescriptionContent={longDescriptionContent}
          t={t}
        />

        <ProductDetailSpecs
          product={product}
          specsDefs={DOOR_SPECS_DEFS}
          specsOrderList={DOOR_SPECS_ORDER_LIST}
          tooltipKeyMap={specTooltipKeyMap}
          t={t}
        />

        <ProductDetailFeatures product={product} title={featuresTitle} t={t} />
      </Section>

      {/* W standardzie - Lock & Threshold */}
      <DoorStandardFeaturesSection t={t} />

      {/* Colors Section */}
      <ProductDetailColors
        colors={colors}
        title={colorsTitle}
        mostPopularLabel={colorsMostPopular}
        fullPaletteLabel={colorsFullPalette}
        t={t}
      />

      {/* Advantages */}
      <Section>
        <ProductDetailAdvantages
          product={product}
          title={advantagesTitle}
          i18nPrefix="productDetail.doors"
          t={t}
        />
      </Section>

      {/* FAQ */}
      <ProductDetailFAQ items={faqItems} productName={product.name} t={t} />

      {/* CTA */}
      <ProductDetailCTA title={ctaTitle} description={ctaDescription} note={ctaNote} t={t} />
    </Page>
  );
};

export default DoorProductDetail;