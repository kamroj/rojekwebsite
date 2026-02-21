import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Page from '../../components/ui/Page';
import Section from '../../components/ui/Section';
import RouterAgnosticLink from '../../components/_astro/RouterAgnosticLink.jsx';
import {
  ProductDetailHero,
  ProductDetailSpecs,
  ProductDetailFeatures,
  ProductDetailColors,
  ProductDetailAdvantages,
  ProductDetailFAQ,
  ProductDetailCTA,
} from '../../components/sections/products/detail';
import HsDetailsSection from '../../components/sections/products/detail/HsDetailsSection.jsx';
import ImageWithSpinner from '../../components/ui/ImageWithSpinner.jsx';
import { HS_SPECS_DEFS, HS_SPECS_ORDER_LIST } from '../../data/products/hs.js';
import {
  WINDOW_LAZUR_PALETTE,
  getLocalizedWindowColorsPalette,
} from '../../data/products/windows.js';
import { WINDOW_FAQ_FALLBACK } from '../../data/products/faqFallback.js';
import { getSectionPath } from '../../lib/i18n/routing.js';

import styles from './HsProductDetail.module.css';

export default function HsProductDetail({ product, breadcrumbPathname }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = (lang || 'pl').split('-')[0];
  const [activeSchemeId, setActiveSchemeId] = useState('A');

  const categoryLabel = t('products.terraceDoors.name', 'Okna przesuwne');

  const ctaTitle = t('productDetail.hs.cta.title', {
    product: product?.name || '',
    defaultValue:
      locale === 'de'
        ? 'Interessiert am System {{product}}?'
        : locale === 'fr'
          ? 'Intéressé par le système {{product}} ?'
          : locale === 'en'
            ? 'Interested in the {{product}} system?'
            : 'Zainteresowany systemem {{product}}?',
  });
  const ctaDescription = t('productDetail.hs.cta.description', {
    defaultValue:
      locale === 'de'
        ? 'Unsere Experten helfen Ihnen bei der Auswahl einer HS-Konfiguration, die zu Ihrem Projekt passt. Kontaktieren Sie uns für ein kostenloses Angebot.'
        : locale === 'fr'
          ? 'Nos experts vous aideront à choisir la configuration HS adaptée à votre projet. Contactez-nous pour un devis gratuit.'
          : locale === 'en'
            ? 'Our experts will help you choose an HS configuration tailored to your project. Contact us for a free quote.'
            : 'Nasi eksperci pomogą dobrać konfigurację HS dopasowaną do projektu. Skontaktuj się z nami i zamów bezpłatną wycenę.',
  });
  const ctaNote = t('productDetail.windows.cta.note', 'Odpowiadamy w ciągu 24 godzin');

  const featuresTitle = t('productDetail.windows.featuresTitle', {
    product: product.name,
    defaultValue:
      locale === 'de'
        ? 'Was zeichnet das Fenster {{product}} aus?'
        : locale === 'fr'
          ? 'Qu’est-ce qui distingue la fenêtre {{product}} ?'
          : locale === 'en'
            ? 'What makes the {{product}} window stand out?'
            : 'Co wyróżnia okno {{product}}?',
  });

  const colorsTitle = t('productDetail.windows.colorsTitle', {
    defaultValue: locale === 'de' ? 'FARBEN' : locale === 'fr' ? 'COULEURS' : locale === 'en' ? 'COLORS' : 'KOLORYSTYKA',
  });
  const colorsRalTabLabel = t('productDetail.windows.colorsRalTab', 'RAL');
  const colorsLazurTabLabel = t('productDetail.windows.colorsLazurTab', {
    defaultValue: locale === 'fr' ? 'LAZURE' : 'LAZUR',
  });
  const colorsMostPopular = t('productDetail.windows.colorsMostPopular', {
    defaultValue:
      locale === 'de'
        ? 'Beliebteste Farben'
        : locale === 'fr'
          ? 'Couleurs les plus populaires'
          : locale === 'en'
            ? 'Most popular colours'
            : 'Najczęściej wybierane kolory',
  });
  const colorsFullPalette = t('productDetail.windows.colorsFullPalette', {
    defaultValue:
      locale === 'de'
        ? 'Vollständige RAL-Farbkarte'
        : locale === 'fr'
          ? 'Palette complète des couleurs RAL'
          : locale === 'en'
            ? 'Full RAL colour chart'
            : 'Pełna paleta kolorów RAL',
  });

  const advantagesTitle = t('productDetail.windows.advantagesTitle', {
    product: product.name,
    defaultValue:
      locale === 'de'
        ? 'Warum {{product}} wählen?'
        : locale === 'fr'
          ? 'Pourquoi choisir {{product}} ?'
          : locale === 'en'
            ? 'Why choose {{product}}?'
            : 'Dlaczego warto wybrać {{product}}?',
  });

  const faqItems = Array.isArray(product?.faq) && product.faq.length > 0 ? product.faq : WINDOW_FAQ_FALLBACK;

  const schemeItems = useMemo(() => {
    const schemeOrder = ['A', 'A3', 'C', 'D', 'E', 'F', 'G2', 'G3', 'H', 'K'];
    const schemeImageMap = {
      A: '/images/hs/schemat-A.png',
      A3: '/images/hs/schemat-A3.png',
      C: '/images/hs/schemat-C.png',
      D: '/images/hs/schemat-D.png',
      E: '/images/hs/schemat-E.png',
      F: '/images/hs/schemat-F.png',
      G2: '/images/hs/schemat-G2.png',
      G3: '/images/hs/schemat-G3.png',
      H: '/images/hs/schemat-H.png',
      K: '/images/hs/schemat-K.png',
    };

    return schemeOrder
      .map((id) => {
        const content = t(`productDetail.hsSchemes.items.${id}`, { returnObjects: true, defaultValue: {} });
        const image = schemeImageMap[id];

        if (!image || !content?.title || !content?.description || !content?.usage) {
          return null;
        }

        return {
          id,
          buttonLabel: t(`productDetail.hsSchemes.items.${id}.buttonLabel`, {
            defaultValue:
              locale === 'de'
                ? `Schema ${id}`
                : locale === 'fr'
                  ? `Schéma ${id}`
                  : locale === 'en'
                    ? `Scheme ${id}`
                    : `Schemat ${id}`,
          }),
          image,
          title: content.title,
          description: content.description,
          usage: content.usage,
        };
      })
      .filter(Boolean);
  }, [t]);

  const activeScheme = schemeItems.find((item) => item.id === activeSchemeId) ?? schemeItems[0];

  return (
    <Page
      imageSrc={product.headerImage}
      headerImage={product.headerImageSanity}
      title={product.name}
      breadcrumbPathname={breadcrumbPathname}
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
      <Section>
        <ProductDetailHero
          product={product}
          categoryLabel={categoryLabel}
          longDescriptionContent={product.longDescription}
          t={t}
        />

        <ProductDetailSpecs
          product={product}
          specsDefs={HS_SPECS_DEFS}
          specsOrderList={HS_SPECS_ORDER_LIST}
          tooltipKeyMap={{
            profileThickness: 'productSpecs.tooltips.profileThickness',
            thermalTransmittance: 'productSpecs.tooltips.thermalTransmittance',
            waterTightness: 'productSpecs.tooltips.waterTightness',
          }}
          t={t}
        />

        <ProductDetailFeatures product={product} title={featuresTitle} t={t} />
      </Section>

      <HsDetailsSection
        commonSections={product.slidingCommonSections}
        specialSections={product.slidingSpecialSections}
      >
        <section className={styles.schemesSection} id="hs-schemes">
          <div className={styles.schemesTitleBlock}>
            <span className={styles.schemesOverline}>
              {t('productDetail.hsSchemes.sectionOverline', {
                defaultValue: locale === 'de' ? 'SCHEMATA' : locale === 'fr' ? 'SCHÉMAS' : locale === 'en' ? 'SCHEMES' : 'SCHEMATY',
              })}
            </span>
            <h2 className={styles.schemesMainTitle}>
              {t('productDetail.hsSchemes.sectionSubtitle', {
                defaultValue:
                  locale === 'de'
                    ? 'Konfiguration passend zu Ihren Anforderungen'
                    : locale === 'fr'
                      ? 'Configuration adaptée à vos besoins'
                      : locale === 'en'
                        ? 'Configuration tailored to your needs'
                        : 'Konfiguracja dopasowana do Twoich wymagań',
              })}
            </h2>
          </div>

          <div
            className={styles.schemeTiles}
            role="tablist"
            aria-label={t('productDetail.hsSchemes.selectorAriaLabel', {
              defaultValue:
                locale === 'de'
                  ? 'Auswahl des HS-Schemas'
                  : locale === 'fr'
                    ? 'Sélection du schéma HS'
                    : locale === 'en'
                      ? 'HS scheme selection'
                      : 'Wybór schematu HS',
            })}
          >
            {schemeItems.map((scheme) => (
              <button
                key={scheme.id}
                type="button"
                role="tab"
                aria-selected={activeScheme.id === scheme.id}
                className={`${styles.schemeTile} ${activeScheme.id === scheme.id ? styles.schemeTileActive : ''}`}
                onClick={() => setActiveSchemeId(scheme.id)}
              >
                <div className={styles.schemeTileImageFrame}>
                  <ImageWithSpinner
                    src={scheme.image}
                    alt={`${scheme.buttonLabel} miniatura`}
                    className={styles.schemeTileImage}
                    wrapperClassName={styles.schemeTileImageWrapper}
                    loading="lazy"
                    decoding="async"
                    spinnerSize="30px"
                    spinnerColor="#1a5618"
                    spinnerTrackColor="rgba(2, 99, 3, 0.18)"
                  />
                </div>
                <span className={styles.schemeTileLabel}>{scheme.buttonLabel}</span>
              </button>
            ))}
          </div>

          <div className={styles.schemeLayout}>
            <div className={styles.schemeContent}>
              <p className={styles.schemeConfigLine}>
                <span>{t('productDetail.hsSchemes.configurationLabel', 'Konfiguracja:')}</span> {activeScheme.title}
              </p>

              <p className={styles.schemeDescription}>{activeScheme.description}</p>

              <p className={styles.schemeUsageLine}>
                <span className={styles.schemeUsageLabel}>{t('productDetail.hsSchemes.usageLabel', 'Zastosowanie:')}</span>{' '}
                {activeScheme.usage}
              </p>
            </div>
          </div>

          <RouterAgnosticLink className={styles.schemesLink} href={getSectionPath(lang, 'hsConfigurator')}>
            {t('productDetail.hsSchemes.cta', 'Zobacz konfigurator HS')}
          </RouterAgnosticLink>
        </section>
      </HsDetailsSection>

      <ProductDetailColors
        title={colorsTitle}
        colorsRal={getLocalizedWindowColorsPalette(locale)}
        colorsLazur={WINDOW_LAZUR_PALETTE}
        ralTabLabel={colorsRalTabLabel}
        lazurTabLabel={colorsLazurTabLabel}
        mostPopularLabel={colorsMostPopular}
        fullPaletteLabel={colorsFullPalette}
        t={t}
      />

      <Section>
        <ProductDetailAdvantages
          product={product}
          title={advantagesTitle}
          i18nPrefix="productDetail.windows"
          t={t}
        />
      </Section>

      <ProductDetailFAQ items={faqItems} productName={product.name} t={t} />

      <ProductDetailCTA title={ctaTitle} description={ctaDescription} note={ctaNote} t={t} />
    </Page>
  );
}
