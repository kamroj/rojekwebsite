import { getSanityClient } from './client.js';
import { isSanityConfigured } from './config.js';
import { SANITY_IMAGE_PROJECTION } from './imageProjection.js';
import { pickLocale } from './i18n.js';
import { REALIZATIONS_DATA } from '../../data/realizations.js';

const toFilterValueKey = (value) => encodeURIComponent(String(value || '').trim().toLowerCase());
const toUpperTagLabel = (value) => String(value || '').trim().toUpperCase();

const buildFallbackRealizations = () =>
  REALIZATIONS_DATA.map((item, index) => {
    const tags = Object.entries(item?.tags || {}).flatMap(([categoryKey, values]) =>
      (values || []).map((value) => {
        const valueLabel = toUpperTagLabel(value);
        return {
          categoryKey,
          categoryLabel: toUpperTagLabel(categoryKey),
          valueKey: toFilterValueKey(valueLabel),
          valueLabel,
        };
      })
    );

    return {
      id: `fallback-${index + 1}`,
      image: {
        alt: null,
        asset: { url: item.img },
      },
      alt: '',
      tags,
      tagPairs: tags.map((t) => `${t.categoryKey}::${t.valueKey}`),
    };
  });

export const fetchRealizationsPageData = async ({ lang = 'pl', signal } = {}) => {
  if (!isSanityConfigured()) return buildFallbackRealizations();

  const sanityClient = getSanityClient();
  if (!sanityClient) return buildFallbackRealizations();

  const query = `
    *[_type == "realization"] | order(_createdAt desc){
      _id,
      "image": image ${SANITY_IMAGE_PROJECTION},
      tags[]{
        "value": value->{
          value,
          "key": key->{
            key,
            label
          }
        },
        "key": key->{
          key,
          label
        }
      }
    }
  `;

  const rows = await sanityClient.fetch(query, {}, { signal });
  const list = Array.isArray(rows) ? rows : [];

  const mapped = list
    .map((item) => {
      const tags = (item?.tags || [])
        .map((tag) => {
          const categoryKey = tag?.key?.key;
          const valueLabel = toUpperTagLabel(pickLocale(tag?.value?.value, lang));
          if (!categoryKey || !valueLabel) return null;
          const valueKey = toFilterValueKey(valueLabel);

          return {
            categoryKey,
            categoryLabel: toUpperTagLabel(pickLocale(tag?.key?.label, lang) || categoryKey),
            valueKey,
            valueLabel,
          };
        })
        .filter(Boolean);

      return {
        id: item?._id,
        image: item?.image || null,
        alt: pickLocale(item?.image?.alt, lang) || '',
        tags,
        tagPairs: tags.map((t) => `${t.categoryKey}::${t.valueKey}`),
      };
    })
    .filter((item) => item?.image?.asset?.url);

  return mapped.length ? mapped : buildFallbackRealizations();
};
