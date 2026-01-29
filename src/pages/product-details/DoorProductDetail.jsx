// src/pages/products/DoorProductDetail.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import Page from '../../components/common/Page';
import Section from '../../components/common/Section';
import { DOOR_SPECS_DEFS, DOOR_SPECS_ORDER_LIST } from '../../data/products/doors';
import SanityPortableText from '../../components/common/SanityPortableText';
import {
  ProductDetailHero,
  ProductDetailSpecs,
  ProductDetailFeatures,
  ProductDetailColors,
  ProductDetailAdvantages,
  ProductDetailFAQ,
  ProductDetailCTA,
} from '../../components/product-details';

// ============================================
// STANDARD FEATURES SECTION STYLES
// ============================================

const StandardSectionWrapper = styled.section`
  position: relative;
  background: #ffffff;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  text-align: center;
  padding: 4rem 2rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 1px;
    background-color: #065e0d6c;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
      width: 60%;
    }
  }
`;

const HeaderOverline = styled.span`
  display: inline-block;
  font-size: 1.4rem;
  font-weight: 600;
  color: #4c4c4c;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1.2rem;
`;

const HeaderTitle = styled.h2`
  text-transform: uppercase;
  font-size: clamp(2.5rem, 1.5rem + 3vw, 3.5rem);
  font-weight: 500;
  color: #0f591a;
  line-height: 1.1;
  margin-bottom: 1.2rem;
`;

const HeaderSubtitle = styled.p`
  letter-spacing: 0.1em;
  font-size: 1.6rem;
  color: #5a6b5f;
  margin: 0;
  font-weight: 400;
`;

// Shared Block Styles
const BlockWrapper = styled.div`
  position: relative;
  background: #ffffff;
  overflow: hidden;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $reversed }) => $reversed ? '1.1fr 1fr' : '1fr 1fr'};
  gap: 5rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ $withPadding }) => $withPadding ? '4rem 2rem' : '0'};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: ${({ $withPadding }) => $withPadding ? '3rem 1.5rem' : '0'};
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: ${({ $withPadding }) => $withPadding ? '3rem' : '0'};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 2;
    padding: ${({ $withPadding }) => $withPadding ? '2rem 1.5rem' : '0'};
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Overline = styled.span`
  font-size: 1.4rem;
  font-weight: 500;
  color: #4c4c4c;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const BlockTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 3.25rem);
  font-weight: 400;
  color: #104818;
  line-height: 1.1;
  margin: 0;
`;

const BlockSubtitle = styled.p`
  font-size: 1.6rem;
  font-weight: 400;
  color: #4a5f4e;
  margin: 0;
  margin-top: 0.25rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 1.4rem;
  }
`;

const Description = styled.p`
  font-size: 1.4rem;
  color: #4a5c50;
  line-height: 1.75;
  margin: 0;
  max-width: 520px;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const FeatureIconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(26, 86, 24, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 26px;
    height: 26px;
    color: #1a5618;
  }
`;

const FeatureTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-top: 0.25rem;
`;

const FeatureTitle = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a2e1f;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 1.3rem;
  }
`;

const FeatureDesc = styled.span`
  font-size: 1.3rem;
  color: #5a6b5f;
  line-height: 1.5;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 1.2rem;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 520px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 400px;
    order: 1;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GlowEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 380px;
  height: 380px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgb(10 96 8 / 19%) 0%,
    rgb(43 186 39 / 5%) 40%,
    #00000000 70%
  );
  z-index: 0;
`;

const ProductImage = styled.img`
  position: relative;
  z-index: 1;
  width: 100%;
  height: auto;
  max-height: 480px;
  object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:hover {
    transform: scale(1.02) translateY(-5px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-height: 380px;
  }
`;

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
    <StandardSectionWrapper>
      {/* Header */}
      <SectionHeader>
        <HeaderOverline>
          {t('productDetail.doors.standard.overline', 'Wszystko co potrzebujesz')}
        </HeaderOverline>
        <HeaderTitle>
          {t('productDetail.doors.standard.title', 'W standardzie')}
        </HeaderTitle>
        <HeaderSubtitle>
          {t('productDetail.doors.standard.subtitle', 'Bez dodatkowych opłat')}
        </HeaderSubtitle>
      </SectionHeader>

      {/* Lock Block */}
      <BlockWrapper>
        <ContentGrid>
          <TextContent $withPadding>
            <TitleBlock>
              <Overline>{t('productDetail.doors.lock.overline', 'Bezpieczeństwo')}</Overline>
              <BlockTitle>
                {t('productDetail.doors.lock.title', 'Zamek 3-punktowy')}
              </BlockTitle>
            </TitleBlock>

            <Description>
              {t(
                'productDetail.doors.lock.description',
                'Bezpieczeństwo zaczyna się od solidnego ryglowania. Nasz standardowy zamek 3-punktowy blokuje skrzydło w trzech miejscach jednocześnie — zwiększając odporność na wyważenie i zapewniając lepszy docisk uszczelek na całej wysokości drzwi.'
              )}
            </Description>

            <FeaturesList>
              {lockFeatures.map((feature, idx) => (
                <FeatureItem key={idx}>
                  <FeatureIconBox>{feature.icon}</FeatureIconBox>
                  <FeatureTextBlock>
                    <FeatureTitle>{feature.title}</FeatureTitle>
                    <FeatureDesc>{feature.desc}</FeatureDesc>
                  </FeatureTextBlock>
                </FeatureItem>
              ))}
            </FeaturesList>
          </TextContent>

          <ImageContainer>
            <ImageWrapper>
              <GlowEffect />
              <ProductImage
                src="/images/products/doors/lock-3point.png"
                alt={t('productDetail.doors.lock.imageAlt', 'Zamek 3-punktowy')}
              />
            </ImageWrapper>
          </ImageContainer>
        </ContentGrid>
      </BlockWrapper>

      {/* Threshold Block */}
      <ContentGrid $reversed $withPadding>
        <ImageContainer>
          <ImageWrapper>
            <GlowEffect />
            <ProductImage
              src="/images/products/doors/threshold-alu.png"
              alt={t('productDetail.doors.threshold.imageAlt', 'Niski próg aluminiowy')}
            />
          </ImageWrapper>
        </ImageContainer>

        <TextContent>
          <TitleBlock>
            <Overline>{t('productDetail.doors.threshold.overline', 'Komfort użytkowania')}</Overline>
            <BlockTitle>
              {t('productDetail.doors.threshold.title', 'Niski próg aluminiowy')}
            </BlockTitle>
            <BlockSubtitle>
              {t(
                'productDetail.doors.threshold.description',
                'Przemyślany detal, który realnie wpływa na komfort codziennego użytkowania. Zaledwie 20mm wysokości zapewnia swobodne przejście bez potykania się.'
              )}
            </BlockSubtitle>
          </TitleBlock>

          <FeaturesList>
            {thresholdFeatures.map((feature, idx) => (
              <FeatureItem key={idx}>
                <FeatureIconBox>{feature.icon}</FeatureIconBox>
                <FeatureTextBlock>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDesc>{feature.desc}</FeatureDesc>
                </FeatureTextBlock>
              </FeatureItem>
            ))}
          </FeaturesList>
        </TextContent>
      </ContentGrid>
    </StandardSectionWrapper>
  );
};

// ============================================
// FALLBACK FAQ DATA
// ============================================

const fallbackFaqData = [
  {
    question: 'Jak długo trwa realizacja zamówienia drzwi?',
    answer:
      'Standardowy czas realizacji to 4-6 tygodni od momentu zatwierdzenia projektu i wpłaty zaliczki. Dla projektów indywidualnych czas może się wydłużyć do 8 tygodni.',
  },
  {
    question: 'Czy drzwi są montowane przez firmę?',
    answer:
      'Tak, oferujemy profesjonalny montaż przez doświadczony zespół. Montaż jest wliczony w cenę i objęty gwarancją.',
  },
];

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

  const colors = product?.colors || [];

  const longDescriptionContent = Array.isArray(product?.longDescription) ? (
    <SanityPortableText value={product.longDescription} />
  ) : (
    product.longDescription
  );

  const faqItems =
    Array.isArray(product?.faq) && product.faq.length > 0 ? product.faq : fallbackFaqData;

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