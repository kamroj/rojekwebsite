import React from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../../components/ui/Page';
import Section from '../../components/ui/Section';
import { WINDOW_COLORS_PALETTE, WINDOW_SPECS_DEFS, WINDOW_SPECS_ORDER_LIST } from '../../data/products/windows';
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

// NOTE: This page composes reusable product-detail components.

// --- Styled Components ---


// Local fallback FAQ (used only if CMS has no FAQ yet)
const fallbackFaqData = [
  {
    question: "Jak często należy konserwować okna PVC?",
    answer: "Okna PVC wymagają minimalnej konserwacji. Zalecamy czyszczenie ram i szyb co najmniej 2-3 razy w roku przy użyciu łagodnych środków czyszczących. Okucia warto smarować specjalnym olejem raz w roku, najlepiej przed sezonem zimowym. Uszczelki można przecierać preparatem silikonowym, co przedłuży ich żywotność."
  },
  {
    question: "Jaki współczynnik przenikania ciepła Uw jest najlepszy?",
    answer: "Im niższy współczynnik Uw, tym lepsza izolacja termiczna okna. Dla domów energooszczędnych zalecamy okna z Uw poniżej 0,9 W/m²K. Standardowe okna mają Uw na poziomie 1,1-1,3 W/m²K. Nasze okna premium osiągają nawet Uw = 0,7 W/m²K, co przekłada się na znaczne oszczędności w ogrzewaniu."
  },
];

const WindowProductDetail = ({ product }) => {
  const { t } = useTranslation();

  const specTooltipKeyMap = {
    profileThickness: 'productSpecs.tooltips.profileThickness',
    thermalTransmittance: 'productSpecs.tooltips.thermalTransmittance',
    waterTightness: 'productSpecs.tooltips.waterTightness'
  };

  // W CMS okna nie mają kolorów (kolory są wspólne i zdefiniowane w kodzie),
  // więc jeśli produkt nie ma `colors`, używamy palety domyślnej.
  const colors = product?.colors?.length ? product.colors : WINDOW_COLORS_PALETTE;

  // Long description: local data uses string, Sanity uses PortableText blocks.
  const longDescriptionContent = Array.isArray(product?.longDescription) ? (
    <SanityPortableText value={product.longDescription} />
  ) : (
    product.longDescription
  );

  // FAQ: prefer CMS
  const faqItems = Array.isArray(product?.faq) && product.faq.length > 0 ? product.faq : fallbackFaqData;

  const categoryLabel = t(`products.${product.categoryKey || 'windows'}.name`, product.category);

  const featuresTitle = t('productDetail.windows.featuresTitle', {
    product: product.name,
    defaultValue: 'Co wyróżnia okno {{product}}?',
  });

  const colorsTitle = t('productDetail.windows.colorsTitle', 'Kolorystyka RAL');
  const colorsMostPopular = t('productDetail.windows.colorsMostPopular', 'Najczęściej wybierane kolory');
  const colorsFullPalette = t('productDetail.windows.colorsFullPalette', 'Pełna paleta kolorów RAL');

  const advantagesTitle = t('productDetail.windows.advantagesTitle', {
    product: product.name,
    defaultValue: 'Dlaczego warto wybrać {{product}}?',
  });

  const ctaTitle = t('productDetail.windows.cta.title', {
    product: product.name,
    defaultValue: 'Zainteresowany oknami {{product}}?',
  });
  const ctaDescription = t(
    'productDetail.windows.cta.description',
    'Nasi eksperci pomogą Ci dobrać idealne rozwiązanie dla Twojego domu. Skontaktuj się z nami, aby uzyskać bezpłatną wycenę.'
  );
  const ctaNote = t('productDetail.windows.cta.note', 'Odpowiadamy w ciągu 24 godzin');

  return (
    <Page
      imageSrc={product.headerImage}
      title={product.name}
      headerProps={{
        badge: { label: product.name },
        headerContent: {
          content: {
            isSubpage: true,
            pageType: 'product',
            subpageType: 'product'
          }
        }
      }}
    >
      <Section>
        <ProductDetailHero
          product={product}
          categoryLabel={categoryLabel}
          longDescriptionContent={longDescriptionContent}
          t={t}
        />

        <ProductDetailSpecs
          product={product}
          specsDefs={WINDOW_SPECS_DEFS}
          specsOrderList={WINDOW_SPECS_ORDER_LIST}
          tooltipKeyMap={specTooltipKeyMap}
          t={t}
        />

        <ProductDetailFeatures product={product} title={featuresTitle} t={t} />
      </Section>

      {/* Colors Section */}
      <ProductDetailColors
        colors={colors}
        title={colorsTitle}
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

      {/* FAQ Section */}
      <ProductDetailFAQ items={faqItems} productName={product.name} t={t} />

      <ProductDetailCTA
        title={ctaTitle}
        description={ctaDescription}
        note={ctaNote}
        t={t}
      />
    </Page>
  );
};

export default WindowProductDetail;