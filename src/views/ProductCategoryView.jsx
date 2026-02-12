// src/pages/ProductCategoryPage.jsx
import React from 'react';
import RouterAgnosticLink from '../components/_astro/RouterAgnosticLink.jsx';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import Page from '../components/ui/Page';
import Section from '../components/ui/Section';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomeView';
import { productCategories } from '../data/products/index.js';
import { getCategoryKeyFromSlug, getProductDetailPath } from '../lib/i18n/routing';
import { WINDOW_SPECS_DEFS, WINDOW_SPECS_ORDER_LIST } from '../data/products/windows';
import { DOOR_SPECS_DEFS, DOOR_SPECS_ORDER_LIST } from '../data/products/doors';
import { useResourceCollector } from '../context/ResourceCollectorContext';
import { runSanityTask } from '../lib/sanity/runSanityTask';
import { fetchDoorProductsList, fetchWindowProductsList } from '../lib/sanity/windows';
import { isSanityConfigured } from '../lib/sanity/config';
import SanityImage from '../components/ui/SanityImage.jsx';

import styles from './ProductCategoryView.module.css';

function ViewMoreButton({ className, ...props }) {
  const classes = [styles.viewMoreButton, className].filter(Boolean).join(' ');
  return <RouterAgnosticLink className={classes} {...props} />;
}

// --- Base (router-agnostic) ---
function ProductCategoryPageBase({
  category,
  initialSanityProducts,
  categoryHeaderImage = null,
  breadcrumbPathname,
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { beginTask, endTask, addResources } = useResourceCollector();
  const [sanityProducts, setSanityProducts] = React.useState(
    Array.isArray(initialSanityProducts) ? initialSanityProducts : null
  );
  const [_sanityError, setSanityError] = React.useState(null);

  const categoryKey = getCategoryKeyFromSlug(lang, category) || category;

  const categoryInfo = productCategories[categoryKey];

  const isWindowsCategory = categoryKey === 'okna';
  const isDoorsCategory = categoryKey === 'drzwi';

  const specsDefs = isWindowsCategory ? WINDOW_SPECS_DEFS : (isDoorsCategory ? DOOR_SPECS_DEFS : WINDOW_SPECS_DEFS);
  const specsOrderList = isWindowsCategory ? WINDOW_SPECS_ORDER_LIST : (isDoorsCategory ? DOOR_SPECS_ORDER_LIST : WINDOW_SPECS_ORDER_LIST);

  // Fetch products from Sanity for categories that support full CMS integration.
  // In Astro SSG we may already have `initialSanityProducts` from build-time.
  React.useEffect(() => {
    if (!isWindowsCategory && !isDoorsCategory) return;

    // If we already have initial products (SSG), don't refetch on mount.
    if (Array.isArray(initialSanityProducts) && initialSanityProducts.length > 0) return;

    if (!isSanityConfigured()) {
      setSanityProducts(null);
      return;
    }

    const controller = new AbortController();

    runSanityTask({
      beginTask,
      endTask,
      addResources,
      taskName: isWindowsCategory ? 'sanity:windows:list' : 'sanity:doors:list',
      fetcher: ({ signal }) =>
        (isWindowsCategory ? fetchWindowProductsList : fetchDoorProductsList)(lang, { signal }),
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
        console.warn('Sanity products list fetch failed', e);
        setSanityError(e);
        setSanityProducts([]);
      });

    return () => {
      controller.abort();
    };
  }, [isWindowsCategory, isDoorsCategory, lang, initialSanityProducts, beginTask, endTask, addResources]);

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
  // - for Okna/Drzwi: prefer Sanity (if configured + data fetched), otherwise fallback to local.
  // - for other categories: keep local behavior.
  const supportsSanityList = isWindowsCategory || isDoorsCategory;
  const productsToRender = supportsSanityList && Array.isArray(sanityProducts) && sanityProducts.length > 0
    ? sanityProducts
    : categoryInfo.products;

  return (
    <Page
      imageSrc="/images/products/doors/drzwi-zewnetrzne-top.jpg"
      headerImage={categoryHeaderImage}
      title={t(`pageTitle.${categoryKey}`, categoryInfo.pageTitle)}
      breadcrumbPathname={breadcrumbPathname}
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
          <div className={styles.productsContainer}>
            {productsToRender.map((product) => (
              <div className={styles.productCard} key={product.id}>
                <div className={styles.productInfo}>
                  <h2 className={styles.productName}>{product.name}</h2>
                  <p className={styles.productDescription}>{product.description || product.shortDescription}</p>

                  <div className={styles.divider} />

                  <div className={styles.specsContainer}>
                    {specsOrderList.map((specKey, idx) => {
                      const def = specsDefs[specKey]
                      if (!def) return null
                      const Icon = def.icon
                      const value = product?.specs?.[specKey]

                      // Jeśli produkt nie ma wartości, nie renderujemy tej pozycji.
                      if (!value) return null

                      return (
                        <React.Fragment key={specKey}>
                          <div className={styles.specItem}>
                            <div className={styles.specIconWrapper}>
                              <Icon />
                            </div>
                            <div className={styles.specDetails}>
                              <span className={styles.specValue}>{value}</span>
                              <span className={styles.specLabel}>{def?.labelKey ? t(def.labelKey, def.label) : def.label}</span>
                            </div>
                          </div>
                          {idx < specsOrderList.length - 1 && <div className={styles.specSeparator} />}
                        </React.Fragment>
                      )
                    })}
                  </div>

                  <ViewMoreButton href={getProductDetailPath(lang, categoryKey, product.slug || product.id)}>
                    {t('common.viewMore', 'Zobacz więcej')}
                    <IoIosArrowForward />
                  </ViewMoreButton>
                </div>

                <div className={styles.productImageWrapper}>
                  {product?.listImage ? (
                    <SanityImage
                      className={styles.productImage}
                      image={product.listImage}
                      placeholder="none"
                      altFallback={product.name}
                      loading="lazy"
                      sizes="(max-width: 900px) 100vw, 520px"
                      widths={[320, 480, 640, 800, 1024]}
                    />
                  ) : (
                    <img
                      className={styles.productImage}
                      src={product.image || product.images?.[0]}
                      alt={product.name}
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.notFoundText}>
            {t('products.emptyCategory', 'Brak produktów w tej kategorii.')}
          </p>
        )}
      </Section>
    </Page>
  );
}

// NOTE: React Router is removed. This default export is kept for compatibility
// (some islands/views may still import the default). It expects `category` as a prop.
export default function ProductCategoryPage({ category }) {
  return <ProductCategoryPageBase category={category} />;
}

// --- Astro (no React Router context) ---
// NOTE: `ViewIsland` passes `viewProps` as regular props to the rendered view.
// So for Astro we accept `category` directly (not nested under `viewProps`).
export function ProductCategoryViewAstro({
  category,
  initialSanityProducts,
  categoryHeaderImage = null,
  breadcrumbPathname,
}) {
  return (
    <ProductCategoryPageBase
      category={category}
      initialSanityProducts={initialSanityProducts}
      categoryHeaderImage={categoryHeaderImage}
      breadcrumbPathname={breadcrumbPathname}
    />
  );
}
