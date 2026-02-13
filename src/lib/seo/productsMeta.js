import { productCategories, productDetailsByType } from '../../data/products/index.js';
import { getCategoryKeyFromSlug, CATEGORY_SLUGS, normalizeLang } from '../i18n/routing.js';

const DEFAULT_SITE_NAME = 'ROJEK';

const PRODUCTS_SECTION_LABEL = {
  pl: 'Produkty',
  en: 'Products',
  de: 'Produkte',
};

const CATEGORY_LABELS = {
  pl: {
    okna: 'Okna',
    oknaPrzesuwne: 'Okna przesuwne HS',
    drzwi: 'Drzwi',
    oknaDrzwiPrzeciwpozarowe: 'Okna i drzwi przeciwpożarowe',
    bramy: 'Bramy',
    rolety: 'Rolety',
  },
  en: {
    okna: 'Windows',
    oknaPrzesuwne: 'Sliding windows HS',
    drzwi: 'Doors',
    oknaDrzwiPrzeciwpozarowe: 'Fire-rated windows and doors',
    bramy: 'Gates',
    rolety: 'Shutters',
  },
  de: {
    okna: 'Fenster',
    oknaPrzesuwne: 'Schiebefenster HS',
    drzwi: 'Türen',
    oknaDrzwiPrzeciwpozarowe: 'Brandschutzfenster und -türen',
    bramy: 'Garagentore',
    rolety: 'Rollläden',
  },
};

const DEFAULT_CATEGORY_DESCRIPTION = {
  pl: (label) => `Produkty ROJEK – kategoria: ${label}. Zobacz dostępne modele, warianty i szczegóły.`,
  en: (label) => `ROJEK products – category: ${label}. Browse available models, variants and details.`,
  de: (label) => `ROJEK Produkte – Kategorie: ${label}. Modelle, Varianten und Details ansehen.`,
};

const DEFAULT_PRODUCT_DESCRIPTION = {
  pl: (label) => `Szczegóły produktu ROJEK (${label}): specyfikacja, cechy, kolory i warianty.`,
  en: (label) => `ROJEK ${label} product details: specifications, features, colours and options.`,
  de: (label) => `ROJEK ${label} Produktdetails: Spezifikation, Eigenschaften, Farben und Optionen.`,
};

function truncate(text, max = 160) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function isPlaceholderDescription(text) {
  const t = String(text || '').toLowerCase();
  // Common dummy text we don't want in meta tags.
  if (t.includes('lorem ipsum')) return true;
  // Too short to be a useful meta description.
  if (t.replace(/\s+/g, ' ').trim().length < 30) return true;
  return false;
}

function pickMetaDescription({ preferred, fallback }) {
  const candidate = String(preferred || '').trim();
  if (!candidate) return truncate(fallback);
  if (isPlaceholderDescription(candidate)) return truncate(fallback);
  return truncate(candidate);
}

function getLocalizedCategoryLabel(lang, categoryKey) {
  const l = normalizeLang(lang);
  return CATEGORY_LABELS?.[l]?.[categoryKey] || CATEGORY_LABELS?.pl?.[categoryKey] || categoryKey;
}

function findLocalProductBySlug(categoryKey, productId) {
  const category = productCategories?.[categoryKey];
  const detailType = category?.detailType;
  if (!detailType) return null;

  const details = productDetailsByType?.[detailType];
  const byType = details?.[productId] || null;
  if (byType) return byType;

  // Fallback: look into category.products array.
  const listItem = (category?.products || []).find((p) => (p?.slug || p?.id) === productId);
  return listItem || null;
}

/**
 * Category meta based on URL slug.
 *
 * @returns {{ title: string, description: string, categoryKey?: string, categoryLabel?: string }}
 */
export function getProductCategoryMeta({ lang = 'pl', categorySlug }) {
  const l = normalizeLang(lang);
  const categoryKey = getCategoryKeyFromSlug(l, categorySlug);

  // If we can't map slug -> key (should be rare), fall back to slug itself.
  const fallbackLabel = categorySlug;

  const label = categoryKey ? getLocalizedCategoryLabel(l, categoryKey) : fallbackLabel;

  const sectionLabel = PRODUCTS_SECTION_LABEL[l] || PRODUCTS_SECTION_LABEL.pl;
  const title = `${label} – ${DEFAULT_SITE_NAME} | ${sectionLabel}`;
  const description = truncate(DEFAULT_CATEGORY_DESCRIPTION[l](label));

  return { title, description, categoryKey, categoryLabel: label };
}

/**
 * Product meta based on URL slug.
 *
 * Note: we keep it conservative and language-aware, but without Sanity fetches here.
 * For Windows category, details may come from Sanity in Astro props (initialSanityProduct).
 *
 * @returns {{ title: string, description: string, categoryKey?: string, categoryLabel?: string, productName?: string }}
 */
export function getProductDetailMeta({
  lang = 'pl',
  categorySlug,
  productId,
  initialSanityProduct,
}) {
  const l = normalizeLang(lang);
  const categoryKey = getCategoryKeyFromSlug(l, categorySlug);
  const categoryLabel = categoryKey ? getLocalizedCategoryLabel(l, categoryKey) : categorySlug;

  const local = categoryKey ? findLocalProductBySlug(categoryKey, productId) : null;
  const productName = initialSanityProduct?.name || local?.name || local?.title || productId;

  const sectionLabel = PRODUCTS_SECTION_LABEL[l] || PRODUCTS_SECTION_LABEL.pl;
  const title = `${productName} – ${DEFAULT_SITE_NAME} | ${categoryLabel} (${sectionLabel})`;

  const fallback = DEFAULT_PRODUCT_DESCRIPTION[l](categoryLabel);
  const rawDesc =
    initialSanityProduct?.shortDescription ||
    local?.shortDescription ||
    local?.description ||
    '';

  const description = pickMetaDescription({ preferred: rawDesc, fallback });

  return { title, description, categoryKey, categoryLabel, productName };
}

export function getProductsIndexMeta({ lang = 'pl' } = {}) {
  const l = normalizeLang(lang);
  const titleByLang = {
    pl: `Produkty – ${DEFAULT_SITE_NAME} | Okna, drzwi, bramy i rolety`,
    en: `Products – ${DEFAULT_SITE_NAME} | Windows, doors, gates & shutters`,
    de: `Produkte – ${DEFAULT_SITE_NAME} | Fenster, Türen, Tore & Rollläden`,
  };
  const descriptionByLang = {
    pl: 'Produkty ROJEK: okna, drzwi, bramy i rolety. Zobacz kategorie i wybierz rozwiązanie dopasowane do potrzeb.',
    en: 'ROJEK products: windows, doors, gates and shutters. Browse categories and choose the right solution.',
    de: 'ROJEK Produkte: Fenster, Türen, Garagentore und Rollläden. Kategorien ansehen und passende Lösung wählen.',
  };
  return {
    title: titleByLang[l] || titleByLang.pl,
    description: descriptionByLang[l] || descriptionByLang.pl,
  };
}

export const __debug = {
  CATEGORY_SLUGS,
};
