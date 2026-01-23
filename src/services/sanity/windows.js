// src/services/sanity/windows.js
import { getSanityClient } from './client';
import { urlForImage } from './image';
import { pickLocale } from './i18n';

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
        listImage,
        shortDescription,
        specs{profileThickness, thermalTransmittance, waterTightness}
      }
  `;

  const items = await sanityClient.fetch(query, { categoryId: WINDOWS_CATEGORY_ID }, { signal });

  return (items || []).map((p) => {
    const listImageUrl = p?.listImage ? urlForImage(p.listImage)?.width(1200)?.quality(80)?.url() : null;
    return {
      id: p._id,
      slug: p.slug,
      name: p.name,
      description: pickLocale(p.shortDescription, lang) || '',
      image: listImageUrl,
      specs: p.specs || {},

      // Assets to preload
      _assetUrls: [listImageUrl].filter(Boolean),
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
      headerImage,
      gallery,
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

  const headerImageUrl = p?.headerImage ? urlForImage(p.headerImage)?.width(2000)?.quality(80)?.url() : null;
  const galleryUrls = (p?.gallery || [])
    .map((img) => (img ? urlForImage(img)?.width(2000)?.quality(80)?.url() : null))
    .filter(Boolean);

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

    headerImage: headerImageUrl,
    images: galleryUrls,
    video: videoUrl,
    specs: p.specs || {},

    shortDescription: pickLocale(p.shortDescription, lang) || '',
    longDescription: pickLocale(p.longDescription, lang) || [],
    features,
    advantages,
    faq,

    // Assets to preload
    _assetUrls: [headerImageUrl, ...galleryUrls, videoUrl].filter(Boolean),
  };
};
