// src/services/sanity/windows.js
import { getSanityClient } from './client';
import { pickLocale } from './i18n';
import { SANITY_IMAGE_PROJECTION } from './imageProjection.js';

const WINDOWS_CATEGORY_ID = 'category_okna';

export const fetchWindowProductsList = async (lang, { signal } = {}) => {
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

  const items = await sanityClient.fetch(query, { categoryId: WINDOWS_CATEGORY_ID }, { signal });

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
      image: null,
      specs: p.specs || {},

      // Assets to preload
      _assetUrls: [p?.listImage?.asset?.url].filter(Boolean),
    };
  });
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
      longDescription,
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
