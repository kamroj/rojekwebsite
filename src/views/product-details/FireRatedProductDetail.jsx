import React from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../../components/ui/Page';
import Section from '../../components/ui/Section';
import { DOOR_SPECS_DEFS, DOOR_SPECS_ORDER_LIST } from '../../data/products/doors';
import { WINDOW_COLORS_PALETTE, WINDOW_LAZUR_PALETTE } from '../../data/products/windows';
import SanityPortableText from '../../components/portable/SanityPortableText';
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
import styles from './FireRatedProductDetail.module.css';

const FireRatedInfoSections = () => {
  const certificationItems = [
    {
      text: 'Deklaracja właściwości użytkowych (DoP) – jeśli dotyczy systemu',
      icon: '/images/icons/ikona-certifikat.png',
    },
    {
      text: 'Raporty z badań / klasyfikacja odporności ogniowej – w zakresie oferty',
      icon: '/images/icons/ikona-raporty-ppoz.png',
    },
    {
      text: 'Zgodność z PN-EN 13501-2 (klasyfikacja odporności ogniowej) – opisowo',
      icon: '/images/icons/ikona-zgodnosc-z-norma.png',
    },
  ];

  const constructionItems = [
    'Uszczelnienia pęczniejące – ograniczenie przepływu dymu i ognia',
    'Szklenie ognioodporne (opcjonalnie) – konfiguracje pod projekt',
    'Wielowarstwowa konstrukcja stabilizująca – kontrola pracy drewna',
    'Okucia i zamki w konfiguracjach spełniających wymagania projektu',
    'Montaż i kompletność systemu – kluczowe dla zachowania klasy EI',
    'Dobór rozwiązań pod projekt wykonawczy – wsparcie techniczne na etapie uzgodnień',
  ];

  const applications = [
    {
      text: 'Budynki wielorodzinne, klatki schodowe, korytarze ewakuacyjne',
      icon: '/images/icons/ikona-blok.png',
    },
    {
      text: 'Obiekty użyteczności publicznej: szkoły, hotele, urzędy',
      icon: '/images/icons/ikona-szkola.png',
    },
    {
      text: 'Obiekty komercyjne i magazynowe (w zależności od projektu)',
      icon: '/images/icons/ikona-budynki-publiczne.png',
    },
    {
      text: 'Domy jednorodzinne – warianty dobierane do wymagań inwestycji',
      icon: '/images/icons/ikona-dom-jednorodzinny.png',
    },
  ];

  const comparisonRows = [
    {
      label: 'Czas odporności ogniowej',
      ei30: 'Do 30 minut utrzymania kryteriów klasy EI',
      ei60: 'Do 60 minut utrzymania kryteriów klasy EI',
    },
    {
      label: 'Typowe zastosowania',
      ei30: 'Mieszkania, strefy komunikacji wewnętrznej, obiekty o niższym obciążeniu ogniowym',
      ei60: 'Klatki schodowe, drogi ewakuacyjne, obiekty o podwyższonych wymaganiach',
    },
    {
      label: 'Dostępne warianty szklenia',
      ei30: 'Konfiguracje przeszkleń zgodnie z dokumentacją systemu',
      ei60: 'Warianty przeszkleń dobierane indywidualnie do projektu i klasy',
    },
    {
      label: 'Rekomendacje projektowe',
      ei30: 'Optymalny kompromis między wymaganiem ochrony i ekonomią inwestycji',
      ei60: 'Rekomendowany przy wyższych wymaganiach formalnych i funkcjonalnych',
    },
  ];

  return (
    <section className={styles.standardSectionWrapper}>
      <div className={styles.sectionHeader}>
        <span className={styles.headerOverline}>Stolarka ognioodporna</span>
        <h2 className={styles.headerTitle}>Certyfikacja i normy</h2>
        <p className={styles.headerSubtitle}>Dokumentacja i zgodność projektowa</p>
      </div>

      <div className={`${styles.contentGrid} ${styles.contentGridWithPadding}`}>
        <div className={styles.textContent}>
          <div className={styles.titleBlock}>
            <span className={styles.overline}>Co otrzymuje inwestor</span>
            <h3 className={styles.blockTitle}>Zakres dokumentacji</h3>
          </div>
          <div className={styles.featuresList}>
            {certificationItems.map((item) => (
              <div key={item.text} className={styles.featureItem}>
                <div className={styles.featureIconBox}>
                  <img
                    className={styles.featureIconImg}
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className={styles.featureTextBlock}>
                  <span className={styles.featureTitle}>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.disclaimerText}>
            Jako jeden z wyspecjalizowanych producentów w regionie Krakowa dostarczamy rozwiązania
            dobierane do wymagań projektowych i formalnych.
          </p>
        </div>

        <div className={styles.textContent}>
          <div className={styles.titleBlock}>
            <span className={styles.overline}>Konstrukcja przeciwpożarowa</span>
            <h3 className={`${styles.blockTitle} ${styles.constructionSectionTitle}`}>Kluczowe elementy systemu</h3>
          </div>
          <div className={`${styles.cardGrid} ${styles.constructionGrid}`}>
            {constructionItems.map((item) => (
              <article key={item} className={styles.simpleCard}>
                <p className={styles.simpleCardText}>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.contentGridWithPadding}>
        <div className={styles.tableWrapper}>
          <h3 className={`${styles.blockTitle} ${styles.fireRatedSubsectionTitle}`}>EI30 vs EI60 – jak dobrać?</h3>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th scope="col">Parametr</th>
                <th scope="col">EI30</th>
                <th scope="col">EI60</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.ei30}</td>
                  <td>{row.ei60}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.contentGridWithPadding}>
        <h3 className={`${styles.blockTitle} ${styles.applicationsHeading} ${styles.fireRatedSubsectionTitle}`}>Obszary zastosowania</h3>
        <div className={`${styles.cardGrid} ${styles.applicationsGrid}`}>
          {applications.map((item) => (
            <article key={item.text} className={styles.simpleCard}>
              <p className={styles.simpleCardText}>{item.text}</p>
              <img
                className={styles.applicationIcon}
                src={item.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function FireRatedProductDetail({ product }) {
  const { t } = useTranslation();

  const specTooltipKeyMap = {
    profileThickness: 'productSpecs.tooltips.profileThickness',
    thermalTransmittance: 'productSpecs.tooltips.thermalTransmittance',
    waterTightness: 'productSpecs.tooltips.waterTightness',
  };

  const colors = WINDOW_COLORS_PALETTE;

  const longDescriptionContent = Array.isArray(product?.longDescription) ? (
    <SanityPortableText value={product.longDescription} />
  ) : (
    product.longDescription
  );

  const faqItems =
    Array.isArray(product?.faq) && product.faq.length > 0 ? product.faq : DOOR_FAQ_FALLBACK;

  const categoryLabel = product.category;

  const featuresTitle = t('productDetail.doors.featuresTitle', {
    product: product.name,
    defaultValue: 'Co wyróżnia drzwi {{product}}?',
  });

  const colorsTitle = t('productDetail.doors.colorsTitle', 'KOLORYSTYKA');
  const colorsRalTabLabel = t('productDetail.doors.colorsRalTab', 'RAL');
  const colorsLazurTabLabel = t('productDetail.doors.colorsLazurTab', 'LAZUR');
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
  const ctaDescription = 'Producent Kraków – realizacje w Małopolsce i całej Polsce. Wsparcie dla architektów i wykonawców.';
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
      <Section>
        <ProductDetailHero
          product={product}
          categoryLabel={categoryLabel}
          longDescriptionContent={longDescriptionContent}
          primaryCtaLabel="Wycena i konsultacja"
          secondaryCtaLabel="Pobierz kartę techniczną"
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

      <FireRatedInfoSections />

      <ProductDetailColors
        title={colorsTitle}
        colorsRal={colors}
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
          i18nPrefix="productDetail.doors"
          t={t}
        />
      </Section>

      <ProductDetailFAQ
        items={faqItems}
        productName={product.name}
        titleOverride="FAQ – drzwi i okna przeciwpożarowe drewniane"
        subtitleOverride="Najczęściej zadawane pytania dotyczące doboru, dokumentacji i realizacji stolarki EI30/EI60."
        t={t}
      />

      <ProductDetailCTA title={ctaTitle} description={ctaDescription} note={ctaNote} t={t} />
    </Page>
  );
}
