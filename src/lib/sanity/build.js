import { isSanityConfigured } from './config.js';
import {
  fetchDoorProductDetail,
  fetchDoorProductsList,
  fetchWindowProductDetail,
  fetchWindowProductsList,
} from './windows.js';

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

export const fetchDoorDetailForBuild = async (slug, lang) => {
  if (!isSanityConfigured()) return null;
  try {
    return await fetchDoorProductDetail(slug, lang);
  } catch (e) {
    console.warn('[sanity][build] door detail fetch failed', { slug, lang, e });
    return null;
  }
};
