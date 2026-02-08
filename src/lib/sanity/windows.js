// src/services/sanity/windows.js
import { getSanityClient } from './client';
import { sanityConfig } from './config';
import { pickLocale } from './i18n';
import {
  SANITY_IMAGE_PROJECTION,
  SANITY_LOCALIZED_BLOCK_CONTENT_PROJECTION,
} from './imageProjection.js';

const WINDOWS_CATEGORY_ID = 'category_okna';

const fetchViaDevProxy = async (query, vars = {}, { signal } = {}) => {
  if (!(import.meta.env.DEV && typeof window !== 'undefined')) return null;

  const params = new URLSearchParams({ query });
  Object.entries(vars || {}).forEach(([key, value]) => {
    params.set(`$${key}`, String(value));
  });

  const apiVersion = sanityConfig.apiVersion || '2025-01-01';
  const dataset = sanityConfig.dataset || 'production';
  const url = `/api/sanity/v${apiVersion}/data/query/${dataset}?${params.toString()}`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Sanity dev proxy failed: ${res.status}`);
  }

  const json = await res.json();
  return json?.result || [];
};

export const fetchProductsListByCategory = async (categoryId, lang, { signal } = {}) => {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];

  const query = `
    *[_type == "product" && category._ref == $categoryId]
      | order(name asc)
      {
        _id,
        name,
        "slug": slug.current,
        "listImage": listImage ${SANITY_IMAGE_PROJECTION},
        shortDescription,
        specs{profileThickness, thermalTransmittance, waterTightness}
      }
  `;

  let items;
  try {
    items = await sanityClient.fetch(query, { categoryId }, { signal });
  } catch (e) {
    // DEV fallback: if browser/client-side fetch hits CORS or apiHost mismatch,
    // retry through local Vite/Astro proxy endpoint.
    const viaProxy = await fetchViaDevProxy(query, { categoryId }, { signal });
    if (!viaProxy) throw e;
    items = viaProxy;
  }

  return (items || []).map((p) => {
    return {
      id: p._id,
      slug: p.slug,
      name: p.name,
      description: pickLocale(p.shortDescription, lang) || '',
      // New canonical shape (preferred by new renderers): full Sanity image object.
      // Keep `image` URL for backward compatibility for now.
      listImage: p.listImage || null,
      // NOTE: this string URL is legacy and should be removed once all UIs use <SanityImage/>.
      image: p?.listImage?.asset?.url || null,
      specs: p.specs || {},

      // Assets to preload
      _assetUrls: [p?.listImage?.asset?.url].filter(Boolean),
    };
  });
};

export const fetchWindowProductsList = async (lang, { signal } = {}) => {
  return fetchProductsListByCategory(WINDOWS_CATEGORY_ID, lang, { signal });
};

export const fetchWindowProductDetail = async (slug, lang, { signal } = {}) => {
  const sanityClient = getSanityClient();
  if (!sanityClient) return null;

  const query = `
    *[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      "headerImage": headerImage ${SANITY_IMAGE_PROJECTION},
      "gallery": gallery[] ${SANITY_IMAGE_PROJECTION},
      shortDescription,
      longDescription ${SANITY_LOCALIZED_BLOCK_CONTENT_PROJECTION},
      specs{profileThickness, thermalTransmittance, waterTightness, video{asset->{url}}},
      features,
      advantages[]{
        title,
        description
      },
      faq[]{
        question,
        answer
      }
    }
  `;

  const p = await sanityClient.fetch(query, { slug }, { signal });
  if (!p) return null;

  const videoUrl = p?.specs?.video?.asset?.url || null;

  const advantages = (p?.advantages || []).map((a) => ({
    title: pickLocale(a?.title, lang) || '',
    description: pickLocale(a?.description, lang) || '',
  }));

  const faq = (p?.faq || []).map((f) => ({
    question: pickLocale(f?.question, lang) || '',
    answer: pickLocale(f?.answer, lang) || [],
  }));

  // In Sanity `features` is: array of localizedBlockContent.
  // We'll pick the correct locale later in the UI with `PortableText`.
  // Here we keep the raw structure.
  const features = (p?.features || []).map((localizedBlocks) => pickLocale(localizedBlocks, lang) || []);

  return {
    id: p._id,
    slug: p.slug,
    name: p.name,

    category: 'Okna',
    categoryKey: 'windows',

    // New canonical shapes (preferred by new renderers)
    headerImageSanity: p.headerImage || null,
    gallery: Array.isArray(p.gallery) ? p.gallery : [],

    // Backward compatible fields used by existing UI (strings):
    // NOTE: string URLs are legacy; keep them null so old <img> fallbacks don't silently drop metadata.
    // Prefer using `headerImageSanity` + `gallery` everywhere.
    headerImage: null,
    images: [],
    video: videoUrl,
    specs: p.specs || {},

    shortDescription: pickLocale(p.shortDescription, lang) || '',
    longDescription: pickLocale(p.longDescription, lang) || [],
    features,
    advantages,
    faq,

    // Assets to preload
    _assetUrls: [p?.headerImage?.asset?.url, ...(p?.gallery || []).map((img) => img?.asset?.url), videoUrl]
      .filter(Boolean),
  };
};
