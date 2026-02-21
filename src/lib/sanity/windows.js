// src/services/sanity/windows.js
import { getSanityClient } from './client';
import { sanityConfig } from './config';
import { pickLocale } from './i18n';
import {
  SANITY_IMAGE_PROJECTION,
  SANITY_LOCALIZED_BLOCK_CONTENT_PROJECTION,
} from './imageProjection.js';

const WINDOWS_CATEGORY_ID = 'category_okna';
const SLIDING_WINDOWS_CATEGORY_ID = 'category_okna_przesuwne';
const DOORS_CATEGORY_IDS = ['category_drzwi_zewnetrzne', 'category_ppoz'];
const FIRE_RATED_CATEGORY_ID = 'category_ppoz';

const localizeRich = (value, lang) => pickLocale(value, lang) || [];
const localizeText = (value, lang) => pickLocale(value, lang) || '';

const mapImage = (image) => image || null;

const mapProfileOverrides = (items, lang) =>
  (items || []).map((item) => ({
    tabId: item?.tabId || null,
    overrideTabLabel: Boolean(item?.overrideTabLabel),
    tabLabel: localizeText(item?.tabLabel, lang),
    overrideTitle: Boolean(item?.overrideTitle),
    title: localizeText(item?.title, lang),
    overrideDescription: Boolean(item?.overrideDescription),
    description: localizeRich(item?.description, lang),
    overrideImage: Boolean(item?.overrideImage),
    image: mapImage(item?.image),
  }));

const mapUsageOverrides = (items, lang) =>
  (items || []).map((item) => ({
    tabId: item?.tabId || null,
    overrideTabLabel: Boolean(item?.overrideTabLabel),
    tabLabel: localizeText(item?.tabLabel, lang),
    overrideTitle: Boolean(item?.overrideTitle),
    title: localizeText(item?.title, lang),
    overrideDescription: Boolean(item?.overrideDescription),
    description: localizeRich(item?.description, lang),
    overrideBenefitLabel: Boolean(item?.overrideBenefitLabel),
    benefitLabel: localizeText(item?.benefitLabel, lang),
    overrideBenefitText: Boolean(item?.overrideBenefitText),
    benefitText: localizeText(item?.benefitText, lang),
  }));

const mapCustomTabs = (tabs, lang) =>
  (tabs || []).map((tab) => ({
    tabId: tab?.tabId || null,
    tabLabel: localizeText(tab?.tabLabel, lang),
    title: localizeText(tab?.title, lang),
    description: localizeRich(tab?.description, lang),
    benefitLabel: localizeText(tab?.benefitLabel, lang),
    benefitText: localizeText(tab?.benefitText, lang),
    image: mapImage(tab?.image),
  }));

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
        localizedName,
        localizedSlug,
        "categoryRef": category._ref,
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
    const localizedSlug = p?.localizedSlug || null;
    const slugForLang = pickLocale(localizedSlug, lang) || p.slug;
    const localizedName = p?.localizedName || null;
    const name = p?.categoryRef === FIRE_RATED_CATEGORY_ID
      ? pickLocale(localizedName, lang) || p.name
      : p.name;

    return {
      id: p._id,
      slug: p.slug,
      slugForLang,
      name,
      localizedName,
      localizedSlug,
      categoryRef: p?.categoryRef || null,
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

export const fetchHsProductsList = async (lang, { signal } = {}) => {
  return fetchProductsListByCategory(SLIDING_WINDOWS_CATEGORY_ID, lang, { signal });
};

export const fetchDoorProductsList = async (lang, { signal } = {}) => {
  const results = await Promise.allSettled(
    DOORS_CATEGORY_IDS.map((categoryId) => fetchProductsListByCategory(categoryId, lang, { signal }))
  );

  const merged = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value || []);

  return merged.filter((item, index, arr) => {
    const itemKey = item?.slug || item?.id;
    if (!itemKey) return false;
    return arr.findIndex((x) => (x?.slug || x?.id) === itemKey) === index;
  });
};

export const fetchFireRatedProductsList = async (lang, { signal } = {}) => {
  return fetchProductsListByCategory(FIRE_RATED_CATEGORY_ID, lang, { signal });
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

export const fetchDoorProductDetail = async (slug, lang, { signal } = {}) => {
  const sanityClient = getSanityClient();
  if (!sanityClient) return null;

  const query = `
    *[_type == "product" && (slug.current == $slug || localizedSlug[$lang] == $slug)][0]{
      _id,
      name,
      localizedName,
      localizedSlug,
      "categoryRef": category._ref,
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

  const p = await sanityClient.fetch(query, { slug, lang }, { signal });
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

  const features = (p?.features || []).map((localizedBlocks) => pickLocale(localizedBlocks, lang) || []);

  const localizedSlug = p?.localizedSlug || null;
  const slugForLang = pickLocale(localizedSlug, lang) || p.slug;
  const localizedName = p?.localizedName || null;
  const resolvedName = p?.categoryRef === FIRE_RATED_CATEGORY_ID
    ? pickLocale(localizedName, lang) || p.name
    : p.name;

  return {
    id: p._id,
    slug: p.slug,
    slugForLang,
    name: resolvedName,
    localizedName,
    localizedSlug,
    categoryRef: p?.categoryRef || null,

    category: p?.categoryRef === FIRE_RATED_CATEGORY_ID ? 'Okna i drzwi przeciwpożarowe' : 'Drzwi zewnętrzne',
    categoryKey: p?.categoryRef === FIRE_RATED_CATEGORY_ID ? 'oknaDrzwiPrzeciwpozarowe' : 'exteriorDoors',

    headerImageSanity: p.headerImage || null,
    gallery: Array.isArray(p.gallery) ? p.gallery : [],

    headerImage: null,
    images: [],
    video: videoUrl,
    specs: p.specs || {},

    shortDescription: pickLocale(p.shortDescription, lang) || '',
    longDescription: pickLocale(p.longDescription, lang) || [],
    features,
    advantages,
    faq,

    _assetUrls: [p?.headerImage?.asset?.url, ...(p?.gallery || []).map((img) => img?.asset?.url), videoUrl]
      .filter(Boolean),
  };
};

export const fetchHsProductDetail = async (slug, lang, { signal } = {}) => {
  const sanityClient = getSanityClient();
  if (!sanityClient) return null;

  const query = `
    *[_type == "product" && slug.current == $slug && category._ref == $categoryId][0]{
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
      },
      slidingSystemType,
      slidingCommonSections,
      slidingSpecialSections
    }
  `;

  const p = await sanityClient.fetch(query, { slug, categoryId: SLIDING_WINDOWS_CATEGORY_ID }, { signal });
  if (!p) return null;

  const videoUrl = p?.specs?.video?.asset?.url || null;

  const advantages = (p?.advantages || []).map((a) => ({
    title: localizeText(a?.title, lang),
    description: localizeText(a?.description, lang),
  }));

  const faq = (p?.faq || []).map((f) => ({
    question: localizeText(f?.question, lang),
    answer: localizeRich(f?.answer, lang),
  }));

  const features = (p?.features || []).map((localizedBlocks) => localizeRich(localizedBlocks, lang));

  const common = p?.slidingCommonSections || {};
  const profile = common?.profileThickness || {};
  const threshold = common?.threshold || {};
  const usage = common?.usageDetails || {};

  const slidingCommonSections = {
    profileThickness: {
      enabled: profile?.enabled !== false,
      sectionOverline: localizeText(profile?.sectionOverline, lang),
      sectionTitle: localizeText(profile?.sectionTitle, lang),
      sectionSubtitle: localizeText(profile?.sectionSubtitle, lang),
      useDefaultTabs: profile?.useDefaultTabs !== false,
      customTabs: mapCustomTabs(profile?.customTabs, lang),
      defaultTabOverrides: mapProfileOverrides(profile?.defaultTabOverrides, lang),
    },
    threshold: {
      enabled: threshold?.enabled !== false,
      sectionOverline: localizeText(threshold?.sectionOverline, lang),
      sectionTitle: localizeText(threshold?.sectionTitle, lang),
      useDefaultTabs: threshold?.useDefaultTabs !== false,
      customTabs: mapCustomTabs(threshold?.customTabs, lang),
      defaultTabOverrides: mapProfileOverrides(threshold?.defaultTabOverrides, lang),
    },
    usageDetails: {
      enabled: usage?.enabled !== false,
      sectionOverline: localizeText(usage?.sectionOverline, lang),
      sectionTitle: localizeText(usage?.sectionTitle, lang),
      useDefaultTabs: usage?.useDefaultTabs !== false,
      customTabs: mapCustomTabs(usage?.customTabs, lang),
      defaultTabOverrides: mapUsageOverrides(usage?.defaultTabOverrides, lang),
    },
  };

  const slidingSpecialSections = (p?.slidingSpecialSections || [])
    .filter((item) => item?._type === 'slidingSpecialHighlight')
    .map((item) => ({
      _type: item?._type,
      enabled: item?.enabled !== false,
      imageOnLeft: Boolean(item?.imageOnLeft),
      title: localizeText(item?.title, lang),
      content: localizeRich(item?.content, lang),
      image: mapImage(item?.image),
      ctaLabel: localizeText(item?.ctaLabel, lang),
      ctaHref: item?.ctaHref || '',
    }));

  return {
    id: p._id,
    slug: p.slug,
    name: p.name,

    category: 'Okna przesuwne HS',
    categoryKey: 'oknaPrzesuwne',

    headerImageSanity: p.headerImage || null,
    gallery: Array.isArray(p.gallery) ? p.gallery : [],

    headerImage: null,
    images: [],
    video: videoUrl,
    specs: p.specs || {},

    shortDescription: localizeText(p.shortDescription, lang),
    longDescription: localizeRich(p.longDescription, lang),
    features,
    advantages,
    faq,

    slidingSystemType: p?.slidingSystemType || null,
    slidingCommonSections,
    slidingSpecialSections,

    _assetUrls: [
      p?.headerImage?.asset?.url,
      ...(p?.gallery || []).map((img) => img?.asset?.url),
      ...(slidingSpecialSections || []).map((item) => item?.image?.asset?.url),
      videoUrl,
    ].filter(Boolean),
  };
};
