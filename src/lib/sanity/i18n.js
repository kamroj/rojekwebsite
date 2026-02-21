// src/services/sanity/i18n.js

// Pick localized value for a given language with fallbacks.
export const pickLocale = (localizedValue, lang) => {
  if (!localizedValue || typeof localizedValue !== 'object') return localizedValue;

  const rawLang = typeof lang === 'string' ? lang.trim() : '';
  const baseLang = rawLang.split('-')[0] || '';

  return (
    localizedValue?.[rawLang] ??
    localizedValue?.[baseLang] ??
    localizedValue?.pl ??
    localizedValue?.en ??
    localizedValue?.fr ??
    localizedValue?.de ??
    null
  );
};



