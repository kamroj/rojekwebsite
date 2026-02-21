// src/pages/ProductDetailPage.jsx
import React from 'react';
import Page from '../components/ui/Page';
import Section from '../components/ui/Section';
import { productCategories, productDetailsByType } from '../data/products/index.js';
import WindowProductDetail from './product-details/WindowProductDetail';
import DoorProductDetail from './product-details/DoorProductDetail';
import FireRatedProductDetail from './product-details/FireRatedProductDetail';
import HsProductDetail from './product-details/HsProductDetail';
import { useTranslation } from 'react-i18next';
import {
  getCategoryKeyFromSlug,
  getProductCategoryPath,
  getProductDetailPath,
  getProductsIndexPath,
} from '../lib/i18n/routing';
import { useResourceCollector } from '../context/ResourceCollectorContext';
import { runSanityTask } from '../lib/sanity/runSanityTask';
import { fetchDoorProductDetail, fetchHsProductDetail, fetchWindowProductDetail } from '../lib/sanity/windows';
import { isSanityConfigured } from '../lib/sanity/config';
import RouterAgnosticLink from '../components/_astro/RouterAgnosticLink.jsx';

import styles from './ProductDetailView.module.css';

function BackLink({ className, ...props }) {
  const classes = [styles.backLink, className].filter(Boolean).join(' ');
  return <RouterAgnosticLink className={classes} {...props} />;
}

function ProductDetailPageBase({ category, productId, initialSanityProduct }) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const { beginTask, endTask, addResources } = useResourceCollector();
  const [sanityProduct, setSanityProduct] = React.useState(
    typeof initialSanityProduct === 'undefined' ? undefined : initialSanityProduct
  ); // undefined = not fetched yet, null = fetched but not found

  const categoryKey = getCategoryKeyFromSlug(lang, category) || category;

  const categoryInfo = productCategories[categoryKey];
  const detailType = categoryInfo?.detailType;
  const breadcrumbPathname = categoryInfo ? getProductDetailPath(lang, categoryKey, productId) : undefined;

  const isWindows = detailType === 'windows';
  const isDoors = detailType === 'doors';
  const isHs = detailType === 'hs';
  const supportsSanityDetail = isWindows || isDoors || isHs;

  // Try Sanity first for detail types that support CMS integration.
  React.useEffect(() => {
    if (!supportsSanityDetail) {
      setSanityProduct(undefined);
      return;
    }

    // If Astro SSG provided initial data for this product, don't refetch.
    if (typeof initialSanityProduct !== 'undefined') return;

    if (!isSanityConfigured()) {
      setSanityProduct(undefined);
      return;
    }
    if (!productId) {
      setSanityProduct(null);
      return;
    }

    const controller = new AbortController();

    runSanityTask({
      beginTask,
      endTask,
      addResources,
      taskName: `sanity:${isWindows ? 'windows' : isDoors ? 'doors' : 'hs'}:detail:${productId}`,
      fetcher: ({ signal }) =>
        (isWindows ? fetchWindowProductDetail : isDoors ? fetchDoorProductDetail : fetchHsProductDetail)(
          productId,
          lang,
          { signal }
        ),
      extractAssetUrls: (data) => data?._assetUrls || [],
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) return;
        setSanityProduct(data || null);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        console.warn('Sanity product detail fetch failed', e);
        // Fallback to local data.
        setSanityProduct(null);
      });

    return () => {
      controller.abort();
    };
  }, [supportsSanityDetail, isWindows, isDoors, productId, lang, initialSanityProduct, beginTask, endTask, addResources]);

  // Fallback: local data when Sanity is not configured / no data found.
  const productFromLocal = detailType
    ? productDetailsByType?.[detailType]?.[productId]
    : undefined;

  // For Sanity-integrated detail types:
  // - if Sanity returned a product object, use it
  // - if Sanity explicitly returned `null` (not found), fallback to local mock
  const product = supportsSanityDetail && sanityProduct ? sanityProduct : productFromLocal;

  // Keep existing behavior for missing product/category
  if (!categoryInfo || !product) {
    return (
      <Page
        imageSrc="/images/products/default-header.jpg"
        title={t('productDetail.errors.productNotFoundTitle', 'Nie znaleziono produktu')}
      >
        <Section>
          <p>{t('productDetail.errors.productNotFoundText', 'Wybrany produkt nie istnieje.')}</p>
          <BackLink href={categoryInfo ? getProductCategoryPath(lang, categoryKey) : getProductsIndexPath(lang)}>
            {t('productDetail.errors.backToCategory', 'Wróć do kategorii')}
          </BackLink>
        </Section>
      </Page>
    );
  }

  // Route to a detail component based on detailType.
  switch (detailType) {
    case 'windows':
      return <WindowProductDetail product={product} breadcrumbPathname={breadcrumbPathname} />;
    case 'doors':
      const isFireRatedProduct =
        categoryKey === 'oknaDrzwiPrzeciwpozarowe' ||
        product?.categoryRef === 'category_ppoz' ||
        product?.categoryKey === 'oknaDrzwiPrzeciwpozarowe' ||
        product?.slug === 'okna-ei30-ei60';

      if (isFireRatedProduct) {
        return <FireRatedProductDetail product={product} breadcrumbPathname={breadcrumbPathname} />;
      }
      return <DoorProductDetail product={product} breadcrumbPathname={breadcrumbPathname} />;
    case 'hs':
      return <HsProductDetail product={product} breadcrumbPathname={breadcrumbPathname} />;
    default:
      return (
        <Page
          imageSrc="/images/products/default-header.jpg"
          title={t('productDetail.errors.noTemplateTitle', 'Brak szablonu produktu')}
        >
          <Section>
            <p>
              {t(
                'productDetail.errors.noTemplateText',
                'Dla tej kategorii produktów nie mamy jeszcze przygotowanej strony detalu.'
              )}
            </p>
            <BackLink href={getProductCategoryPath(lang, categoryKey)}>
              {t('productDetail.errors.backToCategory', 'Wróć do kategorii')}
            </BackLink>
          </Section>
        </Page>
      );
  }
}

// NOTE: React Router is removed. This default export is kept for compatibility
// (some islands/views may still import the default). It expects `category` and `productId` as props.
export default function ProductDetailPage({ category, productId }) {
  return <ProductDetailPageBase category={category} productId={productId} />;
}

// --- Astro (no React Router context) ---
// NOTE: `ViewIsland` passes `viewProps` as regular props to the rendered view.
// So for Astro we accept `category` + `productId` directly (not nested under `viewProps`).
export function ProductDetailViewAstro({ category, productId, initialSanityProduct }) {
  return (
    <ProductDetailPageBase
      category={category}
      productId={productId}
      initialSanityProduct={initialSanityProduct}
    />
  );
}
