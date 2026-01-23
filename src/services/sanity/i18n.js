// src/services/sanity/i18n.js

// Pick localized value for a given language with fallbacks.
export const pickLocale = (localizedValue, lang) => {
  if (!localizedValue || typeof localizedValue !== 'object') return localizedValue;

  return (
    localizedValue?.[lang] ??
    localizedValue?.pl ??
    localizedValue?.en ??
    localizedValue?.de ??
    null
  );
};

