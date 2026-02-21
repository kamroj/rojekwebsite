import { isSanityConfigured } from './config.js';
import {
  fetchDoorProductDetail,
  fetchDoorProductsList,
  fetchFireRatedProductsList,
  fetchHsProductDetail,
  fetchHsProductsList,
  fetchWindowProductDetail,
  fetchWindowProductsList,
} from './windows.js';
import {
  fetchProductsCategoryCardImages,
  fetchProductsCategoryHeaderImages,
  fetchProductsPageSettings,
} from './products.js';

/**
 * Build-time helpers (Astro SSG)
 *
 * IMPORTANT:
 * - These functions run during `astro build` / `getStaticPaths`.
 * - They must be safe in Node (no `window` / `document`).
 */

export const fetchWindowsListForBuild = async (lang) => {
  if (!isSanityConfigured()) return null;
  try {
    return await fetchWindowProductsList(lang);
  } catch (e) {
    console.warn('[sanity][build] windows list fetch failed', e);
    return null;
  }
};

export const fetchWindowDetailForBuild = async (slug, lang) => {
  if (!isSanityConfigured()) return null;
  try {
    return await fetchWindowProductDetail(slug, lang);
  } catch (e) {
    console.warn('[sanity][build] window detail fetch failed', { slug, lang, e });
    return null;
  }
};

export const fetchDoorsListForBuild = async (lang) => {
  if (!isSanityConfigured()) return null;
  try {
    return await fetchDoorProductsList(lang);
  } catch (e) {
    console.warn('[sanity][build] doors list fetch failed', e);
    return null;
  }
};

export const fetchFireRatedListForBuild = async (lang) => {
  if (!isSanityConfigured()) return null;
  try {
    return await fetchFireRatedProductsList(lang);
  } catch (e) {
    console.warn('[sanity][build] fire-rated list fetch failed', e);
    return null;
  }
};

export const fetchHsListForBuild = async (lang) => {
  if (!isSanityConfigured()) return null;
  try {
    return await fetchHsProductsList(lang);
  } catch (e) {
    console.warn('[sanity][build] hs list fetch failed', e);
    return null;
  }
};

export const fetchHsDetailForBuild = async (slug, lang) => {
  if (!isSanityConfigured()) return null;
  try {
    return await fetchHsProductDetail(slug, lang);
  } catch (e) {
    console.warn('[sanity][build] hs detail fetch failed', { slug, lang, e });
    return null;
  }
};

export const fetchDoorDetailForBuild = async (slug, lang) => {
  if (!isSanityConfigured()) return null;
  try {
    return await fetchDoorProductDetail(slug, lang);
  } catch (e) {
    console.warn('[sanity][build] door detail fetch failed', { slug, lang, e });
    return null;
  }
};

/**
 * Product counts for products index page (SSG/SEO-friendly).
 *
 * Returns category-keyed counts from Sanity where available.
 * Current Sanity-backed categories:
 * - okna (windows)
 * - drzwi (doors)
 */
export const fetchProductsIndexCountsForBuild = async (lang) => {
  if (!isSanityConfigured()) return null;

  try {
    const [windows, doors, hs] = await Promise.all([
      fetchWindowProductsList(lang),
      fetchDoorProductsList(lang),
      fetchHsProductsList(lang),
    ]);

    return {
      okna: Array.isArray(windows) ? windows.length : 0,
      drzwi: Array.isArray(doors) ? doors.length : 0,
      oknaPrzesuwne: Array.isArray(hs) ? hs.length : 0,
    };
  } catch (e) {
    console.warn('[sanity][build] products index counts fetch failed', { lang, e });
    return null;
  }
};

/**
 * Products index page settings (header image) for Astro SSG pages.
 */
export const fetchProductsPageSettingsForBuild = async () => {
  if (!isSanityConfigured()) {
    return { headerImage: null };
  }

  try {
    return await fetchProductsPageSettings();
  } catch (e) {
    console.warn('[sanity][build] products page settings fetch failed', e);
    return { headerImage: null };
  }
};

/**
 * Product category card images for products index tiles (okna/drzwi).
 */
export const fetchProductsCategoryCardImagesForBuild = async () => {
  if (!isSanityConfigured()) {
    return {
      okna: null,
      oknaPrzesuwne: null,
      drzwi: null,
      oknaDrzwiPrzeciwpozarowe: null,
    };
  }

  try {
    return await fetchProductsCategoryCardImages();
  } catch (e) {
    console.warn('[sanity][build] products category card images fetch failed', e);
    return {
      okna: null,
      oknaPrzesuwne: null,
      drzwi: null,
      oknaDrzwiPrzeciwpozarowe: null,
    };
  }
};

/**
 * Product category header images for category pages top image (okna/drzwi).
 */
export const fetchProductsCategoryHeaderImagesForBuild = async () => {
  if (!isSanityConfigured()) {
    return {
      okna: null,
      oknaPrzesuwne: null,
      drzwi: null,
      oknaDrzwiPrzeciwpozarowe: null,
    };
  }

  try {
    return await fetchProductsCategoryHeaderImages();
  } catch (e) {
    console.warn('[sanity][build] products category header images fetch failed', e);
    return {
      okna: null,
      oknaPrzesuwne: null,
      drzwi: null,
      oknaDrzwiPrzeciwpozarowe: null,
    };
  }
};
