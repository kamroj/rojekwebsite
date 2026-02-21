import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../../constants/index.js'

/**
 * Languages that should appear in the URL as a prefix.
 * We keep Polish (default) without prefix: `/...`.
 */
export const LANG_PREFIXED = SUPPORTED_LANGUAGES.filter((l) => l !== DEFAULT_LANGUAGE)

/**
 * Localized URL slugs for top-level sections.
 * NOTE: Polish is the default language (no prefix).
 */
export const SECTION_SLUGS = {
  pl: {
    realizations: 'realizacje',
    about: 'o-firmie',
    contact: 'kontakt',
    privacyPolicy: 'polityka-prywatnosci',
    cookiePolicy: 'polityka-cookies',
    hsConfigurator: 'konfigurator-hs',
    products: 'produkty',
  },
  en: {
    realizations: 'realizations',
    about: 'about-us',
    contact: 'contact',
    privacyPolicy: 'privacy-policy',
    cookiePolicy: 'cookies-policy',
    hsConfigurator: 'hs-configurator',
    products: 'products',
  },
  de: {
    realizations: 'referenzen',
    about: 'ueber-uns',
    contact: 'kontakt',
    privacyPolicy: 'datenschutzerklaerung',
    cookiePolicy: 'cookie-richtlinie',
    hsConfigurator: 'hs-konfigurator',
    products: 'produkte',
  },
  fr: {
    realizations: 'realisations',
    about: 'a-propos',
    contact: 'contact',
    privacyPolicy: 'politique-de-confidentialite',
    cookiePolicy: 'politique-de-cookies',
    hsConfigurator: 'configurateur-hs',
    products: 'produits',
  },
}

/**
 * Localized URL slugs for product categories.
 * Keys are internal category ids (currently Polish ids from src/data/products/index.js).
 */
export const CATEGORY_SLUGS = {
  pl: {
    okna: 'okna',
    oknaPrzesuwne: 'okna-przesuwne',
    drzwi: 'drzwi',
    oknaDrzwiPrzeciwpozarowe: 'okna-i-drzwi-przeciwpozarowe',
    bramy: 'bramy',
    rolety: 'rolety',
  },
  en: {
    okna: 'windows',
    oknaPrzesuwne: 'sliding-windows',
    drzwi: 'doors',
    oknaDrzwiPrzeciwpozarowe: 'fire-rated-windows-and-doors',
    bramy: 'gates',
    rolety: 'shutters',
  },
  de: {
    okna: 'fenster',
    oknaPrzesuwne: 'schiebefenster',
    drzwi: 'tueren',
    oknaDrzwiPrzeciwpozarowe: 'brandschutz-fenster-und-tueren',
    bramy: 'garagentore',
    rolety: 'rolllaeden',
  },
  fr: {
    okna: 'fenetres',
    oknaPrzesuwne: 'fenetres-coulissantes',
    drzwi: 'portes',
    oknaDrzwiPrzeciwpozarowe: 'fenetres-et-portes-coupe-feu',
    bramy: 'portails',
    rolety: 'volets',
  },
}

const invertMap = (obj) => {
  const out = {}
  Object.entries(obj).forEach(([k, v]) => {
    out[v] = k
  })
  return out
}

export const SECTION_SLUGS_INV = {
  pl: invertMap(SECTION_SLUGS.pl),
  en: invertMap(SECTION_SLUGS.en),
  de: invertMap(SECTION_SLUGS.de),
  fr: invertMap(SECTION_SLUGS.fr),
}

export const CATEGORY_SLUGS_INV = {
  pl: invertMap(CATEGORY_SLUGS.pl),
  en: invertMap(CATEGORY_SLUGS.en),
  de: invertMap(CATEGORY_SLUGS.de),
  fr: invertMap(CATEGORY_SLUGS.fr),
}

export const normalizeLang = (lang) => {
  const l = (lang || '').toLowerCase().split('-')[0]
  return SUPPORTED_LANGUAGES.includes(l) ? l : DEFAULT_LANGUAGE
}

/**
 * Extracts language from pathname.
 * - `/en/...` => `en`
 * - `/de/...` => `de`
 * - otherwise => `pl`
 */
export const getLangFromPathname = (pathname) => {
  const p = pathname || '/'
  const first = p.replace(/^\/+/, '').split('/')[0]
  if (LANG_PREFIXED.includes(first)) return first
  return DEFAULT_LANGUAGE
}

/**
 * Removes language prefix (if present) from pathname.
 * - `/en/produkty/x` => `/produkty/x`
 * - `/` => `/`
 */
export const stripLangPrefix = (pathname) => {
  const p = pathname || '/'
  const parts = p.replace(/^\/+/, '').split('/')
  const first = parts[0]
  if (LANG_PREFIXED.includes(first)) {
    const rest = parts.slice(1).join('/')
    return `/${rest}`.replace(/\/+$/, '') || '/'
  }
  return p
}

/**
 * Adds proper language prefix to a given app-internal path.
 * - `pl` + `/produkty` => `/produkty`
 * - `en` + `/produkty` => `/en/produkty`
 */
export const withLangPrefix = (lang, path) => {
  const l = normalizeLang(lang)
  const p = (path || '/').startsWith('/') ? path : `/${path}`
  if (l === DEFAULT_LANGUAGE) return p
  return `/${l}${p}`.replace(/\/+/g, '/')
}

/**
 * Rewrites current location to the same route in another language.
 */
export const switchPathLanguage = (pathname, targetLang) => {
  const base = stripLangPrefix(pathname)
  return withLangPrefix(targetLang, base)
}

export const getSectionPath = (lang, sectionKey) => {
  const l = normalizeLang(lang)
  if (sectionKey === 'home') return withLangPrefix(l, '/')
  const slug = SECTION_SLUGS?.[l]?.[sectionKey]
  if (!slug) return withLangPrefix(l, '/')
  return withLangPrefix(l, `/${slug}`)
}

export const getProductsIndexPath = (lang) => getSectionPath(lang, 'products')

export const REALIZATIONS_PAGE_SEGMENT = {
  pl: 'strona',
  en: 'page',
  de: 'seite',
  fr: 'page',
}

export const getRealizationsPagePath = (lang, page = 1) => {
  const base = getSectionPath(lang, 'realizations')
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : Number.parseInt(String(page || '1'), 10) || 1
  if (safePage <= 1) return base

  const l = normalizeLang(lang)
  const segment = REALIZATIONS_PAGE_SEGMENT[l] || 'page'
  return `${base}/${segment}/${safePage}`
}

// Articles (blog)
// Keep Polish (default) without prefix: `/artykuly/...`
export const getArticlesIndexPath = (lang) => withLangPrefix(lang, '/artykuly')

export const ARTICLES_PAGE_SEGMENT = {
  pl: 'strona',
  en: 'page',
  de: 'seite',
  fr: 'page',
}

export const getArticlesPagePath = (lang, page = 1) => {
  const base = getArticlesIndexPath(lang)
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : Number.parseInt(String(page || '1'), 10) || 1
  if (safePage <= 1) return base

  const l = normalizeLang(lang)
  const segment = ARTICLES_PAGE_SEGMENT[l] || 'page'
  return `${base}/${segment}/${safePage}`
}

export const getArticlesTagPath = (lang, tag) => {
  const value = tag ? encodeURIComponent(String(tag).trim()) : ''
  return withLangPrefix(lang, `/artykuly/tag/${value}`)
}

export const getArticleDetailPath = (lang, slug) => {
  const s = slug ? String(slug) : ''
  return withLangPrefix(lang, `/artykuly/${s}`)
}

export const getCategoryKeyFromSlug = (lang, categorySlug) => {
  const l = normalizeLang(lang)
  return CATEGORY_SLUGS_INV?.[l]?.[categorySlug]
}

// Useful for router config where we don't have `lang`.
export const getCategoryKeyFromAnySlug = (categorySlug) => {
  for (const lang of SUPPORTED_LANGUAGES) {
    const key = CATEGORY_SLUGS_INV?.[lang]?.[categorySlug]
    if (key) return key
  }
  return undefined
}

export const getCategorySlug = (lang, categoryKey) => {
  const l = normalizeLang(lang)
  return CATEGORY_SLUGS?.[l]?.[categoryKey]
}

export const getProductCategoryPath = (lang, categoryKey) => {
  const l = normalizeLang(lang)
  const productsSlug = SECTION_SLUGS[l].products
  const categorySlug = getCategorySlug(l, categoryKey)
  if (!categorySlug) return withLangPrefix(l, `/${productsSlug}`)
  return withLangPrefix(l, `/${productsSlug}/${categorySlug}`)
}

export const getProductDetailPath = (lang, categoryKey, productId) => {
  const base = getProductCategoryPath(lang, categoryKey)
  const pid = productId || ''
  return `${base}/${pid}`.replace(/\/+/g, '/')
}

/**
 * Translates current URL between languages including localized slugs.
 * Example:
 * - `/produkty/okna/pava` (pl) -> `/en/products/windows/pava`
 */
export const translatePathname = (pathname, targetLang) => {
  const fromLang = getLangFromPathname(pathname)
  const toLang = normalizeLang(targetLang)
  const base = stripLangPrefix(pathname)

  // Split into segments without leading slash
  const parts = base.replace(/^\/+/, '').split('/').filter(Boolean)
  if (parts.length === 0) return withLangPrefix(toLang, '/')

  const fromSectionKey = SECTION_SLUGS_INV[fromLang]?.[parts[0]]
  if (!fromSectionKey) {
    // Unknown path, just switch prefix.
    return withLangPrefix(toLang, base)
  }

  if (fromSectionKey === 'products') {
    // /{products}/{categorySlug}/({productId})
    const categorySlug = parts[1]
    const productId = parts[2]
    const categoryKey = categorySlug ? getCategoryKeyFromSlug(fromLang, categorySlug) : undefined
    if (categoryKey) {
      if (productId) return getProductDetailPath(toLang, categoryKey, productId)
      return getProductCategoryPath(toLang, categoryKey)
    }
    // Products index
    return getProductsIndexPath(toLang)
  }

  if (fromSectionKey === 'realizations') {
    const pageSegment = parts[1]
    const pageNum = Number.parseInt(parts[2] || '', 10)
    const fromSegment = REALIZATIONS_PAGE_SEGMENT[fromLang]
    if (pageSegment === fromSegment && Number.isFinite(pageNum) && pageNum > 1) {
      return getRealizationsPagePath(toLang, pageNum)
    }
  }

  // Normal top-level section
  return getSectionPath(toLang, fromSectionKey)
}

/**
 * Returns a canonical route key for resource preloading etc.
 * Works across languages and without language prefix.
 */
export const getRouteKeyFromPathname = (pathname) => {
  const base = stripLangPrefix(pathname)
  const parts = base.replace(/^\/+/, '').split('/').filter(Boolean)
  if (parts.length === 0) return 'home'

  const first = parts[0]

  // check all languages, because `base` may be e.g. `/realizacje` (pl) or `/realizations` (en)
  for (const lang of SUPPORTED_LANGUAGES) {
    const key = SECTION_SLUGS_INV[lang]?.[first]
    if (key) return key
  }

  return 'unknown'
}
