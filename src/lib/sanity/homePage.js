import { getSanityClient } from './client';
import { isSanityConfigured } from './config';
import { SANITY_IMAGE_PROJECTION } from './imageProjection.js';
import { pickLocale } from './i18n.js';

/**
 * Fetch homepage intro media (background video + poster image).
 * Singleton document id: homePage
 */
export const fetchHomePageIntro = async ({ signal } = {}) => {
  if (!isSanityConfigured()) return null;

  const sanityClient = getSanityClient();
  if (!sanityClient) return null;

  const query = `
    *[_type == "homePage" && _id == "homePage"][0]{
      intro {
        "backgroundVideoUrl": backgroundVideo.asset->url,
        "backgroundPoster": backgroundPoster ${SANITY_IMAGE_PROJECTION}
      }
    }
  `;

  const res = await sanityClient.fetch(query, {}, { signal });
  const intro = res?.intro;
  if (!intro) return null;

  return {
    backgroundVideoUrl: intro.backgroundVideoUrl || null,
    backgroundPoster: intro.backgroundPoster || null,
    _assetUrls: [intro.backgroundVideoUrl, intro?.backgroundPoster?.asset?.url].filter(Boolean),
  };
};

/**
 * Fetch homepage realizations (references from homePage singleton).
 */
export const fetchHomePageRealizations = async ({ lang = 'pl', signal } = {}) => {
  if (!isSanityConfigured()) return [];

  const sanityClient = getSanityClient();
  if (!sanityClient) return [];

  const query = `
    *[_type == "homePage" && _id == "homePage"][0]{
      realizations[]->{
        _id,
        "image": image ${SANITY_IMAGE_PROJECTION}
      }
    }
  `;

  const res = await sanityClient.fetch(query, {}, { signal });
  const items = Array.isArray(res?.realizations) ? res.realizations : [];

  return items
    .map((item, index) => ({
      id: item?._id || `realization-${index + 1}`,
      src: item?.image?.asset?.url || null,
      alt: pickLocale(item?.image?.alt, lang) || '',
    }))
    .filter((item) => Boolean(item.src));
};
