import { getSanityClient } from './client.js';
import { SANITY_IMAGE_PROJECTION } from './imageProjection.js';
import { isSanityConfigured } from './config.js';

const CATEGORY_ID_BY_PRODUCTS_KEY = {
  okna: 'category_okna',
  drzwi: 'category_drzwi_zewnetrzne',
};

const CATEGORY_KEYS = Object.keys(CATEGORY_ID_BY_PRODUCTS_KEY);

const createCategoryMediaFallback = () =>
  CATEGORY_KEYS.reduce((acc, key) => {
    acc[key] = {
      headerImage: null,
      tileBackgroundImage: null,
    };
    return acc;
  }, {});

/**
 * Fetch products index page settings (header image).
 * Singleton document: productsPage
 */
export const fetchProductsPageSettings = async ({ signal } = {}) => {
  const fallback = {
    headerImage: null,
  };

  if (!isSanityConfigured()) return fallback;

  const sanityClient = getSanityClient();
  if (!sanityClient) return fallback;

  const query = `
    *[_type == "productsPage" && _id == "productsPage"][0]{
      "headerImage": headerImage ${SANITY_IMAGE_PROJECTION}
    }
  `;

  let settings;
  try {
    settings = await sanityClient.fetch(query, {}, { signal });
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[products] fetchProductsPageSettings failed, using fallback in DEV', e);
      return fallback;
    }
    throw e;
  }

  return {
    headerImage: settings?.headerImage || null,
  };
};

/**
 * Fetch category media for products-related categories (okna/drzwi).
 */
export const fetchProductsCategoryMedia = async ({ signal } = {}) => {
  const fallback = createCategoryMediaFallback();

  if (!isSanityConfigured()) return fallback;

  const sanityClient = getSanityClient();
  if (!sanityClient) return fallback;

  const ids = Object.values(CATEGORY_ID_BY_PRODUCTS_KEY);

  const query = `
    *[_type == "productCategory" && _id in $ids]{
      _id,
      "tileBackgroundImage": tile.backgroundImage ${SANITY_IMAGE_PROJECTION},
      "headerImage": headerImage ${SANITY_IMAGE_PROJECTION}
    }
  `;

  let categories;
  try {
    categories = await sanityClient.fetch(query, { ids }, { signal });
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[products] fetchProductsCategoryMedia failed, using fallback in DEV', e);
      return fallback;
    }
    throw e;
  }

  const byId = new Map((categories || []).map((item) => [item?._id, item]));

  return Object.entries(CATEGORY_ID_BY_PRODUCTS_KEY).reduce((acc, [key, categoryId]) => {
    const item = byId.get(categoryId);
    acc[key] = {
      headerImage: item?.headerImage || null,
      tileBackgroundImage: item?.tileBackgroundImage || null,
    };
    return acc;
  }, createCategoryMediaFallback());
};

/**
 * Fetch category card images for products index tiles.
 * Source priority per category:
 * 1) tile.backgroundImage (dedicated tile image)
 * 2) headerImage (fallback)
 */
export const fetchProductsCategoryCardImages = async ({ signal } = {}) => {
  const media = await fetchProductsCategoryMedia({ signal });

  return CATEGORY_KEYS.reduce((acc, key) => {
    const item = media?.[key];
    acc[key] = item?.tileBackgroundImage || item?.headerImage || null;
    return acc;
  }, {});
};

/**
 * Fetch category header images (for category pages top image).
 */
export const fetchProductsCategoryHeaderImages = async ({ signal } = {}) => {
  const media = await fetchProductsCategoryMedia({ signal });

  return CATEGORY_KEYS.reduce((acc, key) => {
    acc[key] = media?.[key]?.headerImage || null;
    return acc;
  }, {});
};
