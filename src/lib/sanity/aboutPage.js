import { getSanityClient } from './client.js';
import { isSanityConfigured } from './config.js';
import { SANITY_IMAGE_PROJECTION } from './imageProjection.js';
import { pickLocale } from './i18n.js';

const toTelHref = (phone = '') => `tel:${String(phone).replace(/\s+/g, '')}`;

export const fetchAboutPageData = async ({ lang = 'pl', signal } = {}) => {
  if (!isSanityConfigured()) return null;

  const sanityClient = getSanityClient();
  if (!sanityClient) return null;

  const query = `
    coalesce(
      *[_type == "aboutPage" && _id == "drafts.aboutPage"][0],
      *[_type == "aboutPage" && _id == "aboutPage"][0]
    ){
      pageSettings {
        "headerImage": headerImage ${SANITY_IMAGE_PROJECTION}
      },
      whyUs {
        description,
        "video": video {
          "asset": asset->{
            url
          }
        },
        points[]{
          title,
          description
        }
      },
      history {
        description,
        items[]{
          year,
          title,
          description,
          "image": image ${SANITY_IMAGE_PROJECTION}
        }
      },
      management[]{
        name,
        role,
        phone,
        email,
        "photo": photo ${SANITY_IMAGE_PROJECTION}
      }
    }
  `;

  const data = await sanityClient.fetch(query, {}, { signal });
  if (!data) return null;

  const whyUsPoints = Array.isArray(data?.whyUs?.points)
    ? data.whyUs.points
        .map((point) => ({
          title: pickLocale(point?.title, lang) || '',
          description: pickLocale(point?.description, lang) || '',
        }))
        .filter((point) => point.title || point.description)
    : [];

  const historyItems = Array.isArray(data?.history?.items)
    ? data.history.items
        .map((item) => ({
          year: item?.year || '',
          title: pickLocale(item?.title, lang) || '',
          description: pickLocale(item?.description, lang) || '',
          image: item?.image || null,
          imageAlt: pickLocale(item?.image?.alt, lang) || '',
        }))
        .filter((item) => item.year || item.title || item.description || item?.image?.asset?.url)
    : [];

  const management = Array.isArray(data?.management)
    ? data.management
        .map((person) => {
          const phone = person?.phone || '';
          const email = person?.email || '';
          return {
            name: person?.name || '',
            role: pickLocale(person?.role, lang) || '',
            phone,
            phoneHref: phone ? toTelHref(phone) : '',
            email,
            emailHref: email ? `mailto:${email}` : '',
            photo: person?.photo || null,
            photoAlt: pickLocale(person?.photo?.alt, lang) || person?.name || '',
          };
        })
        .filter((person) => person.name || person.role || person.phone || person.email || person?.photo?.asset?.url)
    : [];

  return {
    headerImage: data?.pageSettings?.headerImage || null,
    whyUsDescription: pickLocale(data?.whyUs?.description, lang) || '',
    whyUsVideoUrl: data?.whyUs?.video?.asset?.url || '',
    whyUsPoints,
    historyDescription: pickLocale(data?.history?.description, lang) || '',
    historyItems,
    management,
  };
};
