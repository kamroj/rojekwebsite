// src/pages/ProductCategoryPage.jsx
import React from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import Page from '../components/common/Page';
import Section from '../components/common/Section';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomePage';
import { productCategories } from '../data/products';
import { getCategoryKeyFromSlug, getProductDetailPath } from '../utils/i18nRouting';
import { WINDOW_SPECS_DEFS, WINDOW_SPECS_ORDER_LIST } from '../data/products/windows';
import { DOOR_SPECS_DEFS, DOOR_SPECS_ORDER_LIST } from '../data/products/doors';
import { useResourceCollector } from '../context/ResourceCollectorContext';
import { runSanityTask } from '../services/sanity/runSanityTask';
import { fetchWindowProductsList } from '../services/sanity/windows';
import { isSanityConfigured } from '../services/sanity/config';

// --- Styled Components ---

const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
`;

const ProductCard = styled.div`
  display: flex;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: 420px;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    min-height: auto;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  padding: 1rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  background: #ffffff;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 1rem 1.5rem 1rem;;
    order: 2;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 1rem 1.5rem 1rem;
  }
`;

const ProductName = styled.h2`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: #013613;
  margin: 0 0 1rem 0;
  letter-spacing: 0.5px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 0 0.6rem 0;
  }
`;

const ProductDescription = styled.p`
  font-size: 1.4rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  max-width: 600px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.2rem;
    margin: 0 0 1.2rem 0;
  }
`;

const Divider = styled.div`
  width: 30%;
  height: 1px;
  background-color: #0132068e;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 1.2rem;
  }
`;

const SpecsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 1.5rem;
    gap: 1rem 0;
  }
`;

const SpecItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-right: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.6rem;
    padding-right: 0;
    flex: 1 1 100%;
  }
`;

const SpecSeparator = styled.div`
  width: 1px;
  height: 45px;
  background-color: #d1d5db;
  margin-right: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const SpecIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f0f4f0;
  border: 1px solid #e0e5e0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    font-size: 1.8rem;
    color: #4a7c59;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 40px;
    height: 40px;
    
    svg {
      font-size: 1.5rem;
    }
  }
`;

const SpecDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const SpecValue = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.15rem;
  }
`;

const SpecLabel = styled.span`
  font-size: 1rem;
  color: #9ca3af;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.9rem;
  }
`;

const ViewMoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #1a5618 0%, #2d7a2a 100%);
  color: #ffffff;
  padding: 1rem 1.8rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 500;
  transition: all 0.3s ease;
  width: fit-content;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0px 3px 10px 0px rgb(13 43 12 / 35%);
  }
  
  svg {
    font-size: 1.4rem;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.9rem 1.5rem;
    font-size: 1.15rem;
  }
`;

const ProductImageWrapper = styled.div`
  width: 550px;
  min-width: 550px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    min-width: 100%;
    height: auto;
    order: 1;
    min-height: 320px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 280px;
    padding: 1.5rem;
  }
`;

const ProductImage = styled.img`
  width: 100%; /* Zawsze 100% szerokości kontenera */
  height: auto; /* Wysokość dostosowuje się automatycznie */
  max-height: 100%; /* Nie przekracza wysokości kontenera */
  object-fit: contain; /* Zachowuje proporcje i mieści się w kontenerze */
  display: block;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-height: 280px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-height: 240px;
  }
`;

const NotFoundText = styled.p`
  font-size: 1.4rem;
  color: #6b7280;
  text-align: center;
  padding: 4rem 0;
`;

// --- Component ---
const ProductCategoryPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { category } = useParams();

  const { beginTask, endTask, addResources } = useResourceCollector();
  const [sanityProducts, setSanityProducts] = React.useState(null);
  const [_sanityError, setSanityError] = React.useState(null);

  const categoryKey = getCategoryKeyFromSlug(lang, category) || category;

  const categoryInfo = productCategories[categoryKey];

  const isWindowsCategory = categoryKey === 'okna';
  const isDoorsCategory = categoryKey === 'drzwi';

  const specsDefs = isWindowsCategory ? WINDOW_SPECS_DEFS : (isDoorsCategory ? DOOR_SPECS_DEFS : WINDOW_SPECS_DEFS);
  const specsOrderList = isWindowsCategory ? WINDOW_SPECS_ORDER_LIST : (isDoorsCategory ? DOOR_SPECS_ORDER_LIST : WINDOW_SPECS_ORDER_LIST);

  // Fetch window products from Sanity (only for Okna).
  React.useEffect(() => {
    if (!isWindowsCategory) return;
    if (!isSanityConfigured()) {
      setSanityProducts(null);
      return;
    }

    const controller = new AbortController();

    runSanityTask({
      beginTask,
      endTask,
      addResources,
      taskName: 'sanity:windows:list',
      fetcher: ({ signal }) => fetchWindowProductsList(lang, { signal }),
      extractAssetUrls: (data) => (data || []).flatMap((p) => p?._assetUrls || []),
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) return;
        setSanityError(null);
        setSanityProducts(data || []);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        console.warn('Sanity windows list fetch failed', e);
        setSanityError(e);
        setSanityProducts([]);
      });

    return () => {
      controller.abort();
    };
  }, [isWindowsCategory, lang, beginTask, endTask, addResources]);

  if (!categoryInfo) {
    return (
      <Page
        imageSrc="/images/products/default-header.jpg"
        title={t('products.notFound', 'Nie znaleziono')}
      >
        <Section>
          <HeaderWrap>
            <ProductHeader>
              {t('products.categoryNotFoundTitle', 'Kategoria nie znaleziona')}
            </ProductHeader>
            <ProductHeaderSubtitle>
              {t('products.categoryNotFoundSubtitle', 'Wybrana kategoria produktów nie istnieje.')}
            </ProductHeaderSubtitle>
          </HeaderWrap>
        </Section>
      </Page>
    );
  }

  // Data source:
  // - for Okna: prefer Sanity (if configured + data fetched), otherwise fallback to local.
  // - for other categories: keep local behavior.
  const productsToRender = isWindowsCategory && Array.isArray(sanityProducts) && sanityProducts.length > 0
    ? sanityProducts
    : categoryInfo.products;

  return (
    <Page
      imageSrc={categoryInfo.headerImage}
      title={t(`pageTitle.${categoryKey}`, categoryInfo.pageTitle)}
    >
      <Section>
        <HeaderWrap>
          <ProductHeader>
            {t(`productCategories.${categoryKey}.title`, categoryInfo.title)}
          </ProductHeader>
          <ProductHeaderSubtitle>
            {t(`productCategories.${categoryKey}.subtitle`, categoryInfo.subtitle)}
          </ProductHeaderSubtitle>
        </HeaderWrap>

        {productsToRender.length > 0 ? (
          <ProductsContainer>
            {productsToRender.map((product) => (
              <ProductCard key={product.id}>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductDescription>{product.description || product.shortDescription}</ProductDescription>

                  <Divider />

                  <SpecsContainer>
                    {specsOrderList.map((specKey, idx) => {
                      const def = specsDefs[specKey]
                      if (!def) return null
                      const Icon = def.icon
                      const value = product?.specs?.[specKey]

                      // Jeśli produkt nie ma wartości, nie renderujemy tej pozycji.
                      if (!value) return null

                      return (
                        <React.Fragment key={specKey}>
                          <SpecItem>
                            <SpecIconWrapper>
                              <Icon />
                            </SpecIconWrapper>
                            <SpecDetails>
                              <SpecValue>{value}</SpecValue>
                              <SpecLabel>{def?.labelKey ? t(def.labelKey, def.label) : def.label}</SpecLabel>
                            </SpecDetails>
                          </SpecItem>
                          {idx < specsOrderList.length - 1 && <SpecSeparator />}
                        </React.Fragment>
                      )
                    })}
                  </SpecsContainer>

                  <ViewMoreButton to={getProductDetailPath(lang, categoryKey, product.slug || product.id)}>
                    {t('common.viewMore', 'Zobacz więcej')}
                    <IoIosArrowForward />
                  </ViewMoreButton>
                </ProductInfo>

                <ProductImageWrapper>
                  <ProductImage
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    loading="lazy"
                  />
                </ProductImageWrapper>
              </ProductCard>
            ))}
          </ProductsContainer>
        ) : (
          <NotFoundText>
            {t('products.emptyCategory', 'Brak produktów w tej kategorii.')}
          </NotFoundText>
        )}
      </Section>
    </Page>
  );
};

export default ProductCategoryPage;
