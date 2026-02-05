// src/lib/seo/structuredData.js
// Helpers for generating JSON-LD (Schema.org) snippets.

import { COMPANY } from '../../data/company.js';

function toAbsoluteUrl(site, maybePath) {
  if (!maybePath) return undefined;
  if (!site) return maybePath;
  try {
    return new URL(maybePath, site).toString();
  } catch {
    return maybePath;
  }
}

function arrayify(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function portableTextToPlainText(blocks) {
  if (!Array.isArray(blocks)) return '';
  const parts = [];

  for (const b of blocks) {
    // Sanity PortableText block
    if (b && typeof b === 'object' && b._type === 'block' && Array.isArray(b.children)) {
      const text = b.children
        .map((c) => (c && typeof c === 'object' ? c.text : ''))
        .filter(Boolean)
        .join('');
      if (text) parts.push(text);
      continue;
    }

    // Fallback
    if (typeof b === 'string') parts.push(b);
  }

  return parts.join('\n').trim();
}

/**
 * Product JSON-LD
 * - keep it minimal (no fake offers/pricing)
 */
export function getProductJsonLd({ product, site, canonicalUrl, categoryName } = {}) {
  if (!product) return null;

  const name = product?.name;
  const description = product?.shortDescription || portableTextToPlainText(product?.longDescription) || undefined;

  const images = [
    ...arrayify(product?.headerImage),
    ...arrayify(product?.images),
    ...arrayify(product?.image),
  ]
    .filter(Boolean)
    .map((img) => toAbsoluteUrl(site, img));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: images.length ? images : undefined,
    category: categoryName || product?.category || undefined,
    sku: product?.slug || product?.id || undefined,
    brand: {
      '@type': 'Brand',
      name: COMPANY.brand,
    },
    manufacturer: {
      '@type': 'Organization',
      name: COMPANY.legalName,
    },
    url: canonicalUrl || toAbsoluteUrl(site, canonicalUrl),
  };
}

/**
 * FAQPage JSON-LD
 */
export function getFaqPageJsonLd({ items, canonicalUrl } = {}) {
  const faqItems = Array.isArray(items) ? items : [];
  const mainEntity = faqItems
    .map((it) => {
      const question = it?.question;
      const answerRaw = it?.answer;
      const answer = Array.isArray(answerRaw) ? portableTextToPlainText(answerRaw) : String(answerRaw || '').trim();
      if (!question || !answer) return null;
      return {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      };
    })
    .filter(Boolean);

  if (!mainEntity.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
    url: canonicalUrl || undefined,
  };
}
