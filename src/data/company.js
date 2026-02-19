// Central place for company/contact details used across the site.
// Keep this file as the single source of truth to avoid data drift between pages/components.

export const COMPANY = {
  brand: 'ROJEK',
  legalName: 'ROJEK Okna i Drzwi Sp. z o.o.',

  email: 'biuro@rojekoid.pl',
  // Main phone displayed on the contact page (general contact)
  phone: '+48 601 789 888',

  address: {
    streetAddress: 'Kryspinów 399',
    postalCode: '32-060',
    addressLocality: 'Kryspinów',
    addressCountry: 'PL',
  },

  nip: '679-104-25-29',
  regon: '356780524',

  // Human-readable label used in UI.
  // If you want full localization, move the label to i18n and keep only raw hours here.
  openingHoursLabel: 'Pon–Pt: 8:00–16:00',
  openingHours: {
    opens: '08:00',
    closes: '16:00',
    // ISO day names for JSON-LD
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },

  // Contact people grouped by type (the UI can translate the group labels).
  contacts: {
    quotes: [
      {
        name: 'Wiesław Rojek',
        phone: '+48 603 923 011',
        emails: ['biuro@rojekoid.pl', 'wieslaw.rojek@rojekoid.pl'],
      },
    ],
    distribution: [
      {
        name: 'Przemysław Rojek',
        phone: '+48 886 988 561',
        emails: ['przemyslaw.rojek@rojekoid.pl'],
      },
      {
        name: 'Tomasz Rojek',
        phone: '+48 889 194 388',
        emails: ['tomasz.rojek@rojekoid.pl'],
      },
    ],
  },

  map: {
    embedUrl: 'https://www.google.com/maps?q=Kryspinow+399&output=embed',
  },
};

export function getCompanyJsonLd({ url, logoUrl } = {}) {
  const address = {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address.streetAddress,
    postalCode: COMPANY.address.postalCode,
    addressLocality: COMPANY.address.addressLocality,
    addressCountry: COMPANY.address.addressCountry,
  };

  const openingHoursSpecification = {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: COMPANY.openingHours.days,
    opens: COMPANY.openingHours.opens,
    closes: COMPANY.openingHours.closes,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY.legalName,
    // Brand is useful for rich results; keep it short.
    brand: { '@type': 'Brand', name: COMPANY.brand },
    url: url || undefined,
    logo: logoUrl
      ? {
          '@type': 'ImageObject',
          url: logoUrl,
        }
      : undefined,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    address,
    openingHoursSpecification: [openingHoursSpecification],
  };
}
