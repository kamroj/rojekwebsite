import { createClient } from '@sanity/client';

import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from '../src/constants/index.js';
import {
  ARTICLES_PAGE_SEGMENT,
  REALIZATIONS_PAGE_SEGMENT,
  getArticleDetailPath,
  getArticlesIndexPath,
  getArticlesTagPath,
  getProductCategoryPath,
  getProductDetailPath,
  getProductsIndexPath,
  getSectionPath,
} from '../src/lib/i18n/routing.js';

const CATEGORY_KEY_BY_ID = {
  category_okna: 'okna',
  category_okna_przesuwne: 'oknaPrzesuwne',
  category_drzwi_zewnetrzne: 'drzwi',
  category_ppoz: 'oknaDrzwiPrzeciwpozarowe',
};

const SANITY_PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID || '6sp9tyie';
const SANITY_DATASET = process.env.VITE_SANITY_DATASET || 'production';
const SANITY_API_VERSION = process.env.VITE_SANITY_API_VERSION || '2025-01-01';

function normalizePath(pathname) {
  if (!pathname) return '/';

  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return normalized.length > 1 && normalized.endsWith('/')
    ? normalized.slice(0, -1)
    : normalized;
}

function toTimestamp(value) {
  if (!value) return null;
  const ts = Date.parse(value);
  return Number.isFinite(ts) ? ts : null;
}

function maxIsoDate(values = []) {
  let maxTs = null;

  for (const value of values) {
    const ts = toTimestamp(value);
    if (ts === null) continue;
    if (maxTs === null || ts > maxTs) maxTs = ts;
  }

  return maxTs === null ? null : new Date(maxTs).toISOString();
}

function normalizeTags(values) {
  if (!Array.isArray(values)) return [];

  return values
    .flatMap((value) => {
      if (typeof value === 'string') return value.split(',');
      if (value && typeof value === 'object') {
        const label = value.name || value.label || value.value;
        return typeof label === 'string' ? label.split(',') : [];
      }
      return [];
    })
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function upsertDate(map, pathname, isoDate) {
  const path = normalizePath(pathname);
  const incomingTs = toTimestamp(isoDate);
  if (incomingTs === null) return;

  const currentTs = toTimestamp(map.get(path));
  if (currentTs === null || incomingTs > currentTs) {
    map.set(path, new Date(incomingTs).toISOString());
  }
}

function mapPagedPathToBase(pathname) {
  for (const lang of SUPPORTED_LANGUAGES) {
    const realizationsBase = normalizePath(getSectionPath(lang, 'realizations'));
    const realizationsSegment = REALIZATIONS_PAGE_SEGMENT[lang] || 'page';
    if (pathname.startsWith(`${realizationsBase}/${realizationsSegment}/`)) {
      return realizationsBase;
    }

    const articlesBase = normalizePath(getArticlesIndexPath(lang));
    const articlesSegment = ARTICLES_PAGE_SEGMENT[lang] || 'page';
    if (pathname.startsWith(`${articlesBase}/${articlesSegment}/`)) {
      return articlesBase;
    }
  }

  return null;
}

export function resolveSanityLastmod(pathname, lastmodByPath) {
  const path = normalizePath(pathname);
  const direct = lastmodByPath.get(path);
  if (direct) return direct;

  const base = mapPagedPathToBase(path);
  if (base) return lastmodByPath.get(base) || null;

  return null;
}

function createSanityClient() {
  if (!SANITY_PROJECT_ID || !SANITY_DATASET) return null;

  return createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
  });
}

export async function buildSanityLastmodMap() {
  const client = createSanityClient();
  if (!client) return new Map();

  const query = `{
    "homePageUpdatedAt": coalesce(*[_type == "homePage" && _id == "drafts.homePage"][0]._updatedAt, *[_type == "homePage" && _id == "homePage"][0]._updatedAt),
    "aboutPageUpdatedAt": coalesce(*[_type == "aboutPage" && _id == "drafts.aboutPage"][0]._updatedAt, *[_type == "aboutPage" && _id == "aboutPage"][0]._updatedAt),
    "contactPageUpdatedAt": coalesce(*[_type == "contactPage" && _id == "drafts.contactPage"][0]._updatedAt, *[_type == "contactPage" && _id == "contactPage"][0]._updatedAt),
    "productsPageUpdatedAt": coalesce(*[_type == "productsPage" && _id == "drafts.productsPage"][0]._updatedAt, *[_type == "productsPage" && _id == "productsPage"][0]._updatedAt),
    "articlesPageUpdatedAt": coalesce(*[_type == "articlesPage" && _id == "drafts.articlesPage"][0]._updatedAt, *[_type == "articlesPage" && _id == "articlesPage"][0]._updatedAt),
    "articles": *[_type == "article" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt,
      "tags": tags[]{
        _type == "reference" => @->{"name": name},
        _type != "reference" => @
      }
    },
    "products": *[_type == "product" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt,
      "categoryId": category._ref
    },
    "productCategories": *[_type == "productCategory"]{_id, _updatedAt},
    "realizations": *[_type == "realization"]{_updatedAt}
  }`;

  let data;
  try {
    data = await client.fetch(query);
  } catch (error) {
    console.warn('[sitemap] Could not load lastmod data from Sanity, using file mtime fallback.', error);
    return new Map();
  }

  const map = new Map();

  // Static top-level pages driven by singleton documents.
  for (const lang of SUPPORTED_LANGUAGES) {
    upsertDate(map, getSectionPath(lang, 'home'), data?.homePageUpdatedAt);
    upsertDate(map, getSectionPath(lang, 'about'), data?.aboutPageUpdatedAt);
    upsertDate(map, getSectionPath(lang, 'contact'), data?.contactPageUpdatedAt);
    upsertDate(map, getProductsIndexPath(lang), data?.productsPageUpdatedAt);
    upsertDate(map, getSectionPath(lang, 'realizations'), maxIsoDate((data?.realizations || []).map((item) => item?._updatedAt)));
  }

  // Articles are available only in Polish in current routing.
  const articleDates = [];
  const articleTags = new Set();

  for (const article of data?.articles || []) {
    const slug = article?.slug;
    const date = article?._updatedAt;
    if (!slug || !date) continue;

    articleDates.push(date);
    upsertDate(map, getArticleDetailPath(DEFAULT_LANGUAGE, slug), date);

    for (const tag of normalizeTags(article?.tags)) {
      articleTags.add(tag);
    }
  }

  const articlesSectionDate = maxIsoDate([data?.articlesPageUpdatedAt, ...articleDates]);
  upsertDate(map, getArticlesIndexPath(DEFAULT_LANGUAGE), articlesSectionDate);

  for (const tag of articleTags) {
    upsertDate(map, getArticlesTagPath(DEFAULT_LANGUAGE, tag), articlesSectionDate);
  }

  // Products and product categories for all languages.
  const categoryUpdatedAtByKey = {};
  for (const item of data?.productCategories || []) {
    const key = CATEGORY_KEY_BY_ID[item?._id];
    if (!key) continue;
    categoryUpdatedAtByKey[key] = maxIsoDate([categoryUpdatedAtByKey[key], item?._updatedAt]);
  }

  const productDates = [];
  const productDatesByCategoryKey = {};

  for (const product of data?.products || []) {
    const slug = product?.slug;
    const date = product?._updatedAt;
    const categoryKey = CATEGORY_KEY_BY_ID[product?.categoryId];
    if (!slug || !date || !categoryKey) continue;

    productDates.push(date);
    productDatesByCategoryKey[categoryKey] = maxIsoDate([
      productDatesByCategoryKey[categoryKey],
      date,
    ]);

    for (const lang of SUPPORTED_LANGUAGES) {
      upsertDate(map, getProductDetailPath(lang, categoryKey, slug), date);
    }
  }

  for (const categoryKey of Object.keys(CATEGORY_KEY_BY_ID).map((id) => CATEGORY_KEY_BY_ID[id])) {
    const categoryDate = maxIsoDate([
      categoryUpdatedAtByKey[categoryKey],
      productDatesByCategoryKey[categoryKey],
    ]);

    if (!categoryDate) continue;

    for (const lang of SUPPORTED_LANGUAGES) {
      upsertDate(map, getProductCategoryPath(lang, categoryKey), categoryDate);
    }
  }

  const productsSectionDate = maxIsoDate([
    data?.productsPageUpdatedAt,
    ...productDates,
    ...Object.values(categoryUpdatedAtByKey),
  ]);

  for (const lang of SUPPORTED_LANGUAGES) {
    upsertDate(map, getProductsIndexPath(lang), productsSectionDate);
  }

  return map;
}
