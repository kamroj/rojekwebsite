// sanity/schemaTypes/l10n.js
// Helpers for localized fields (PL/EN/DE/FR)

export const SUPPORTED_LANGUAGES = [
  {id: 'pl', title: 'Polski'},
  {id: 'en', title: 'English'},
  {id: 'de', title: 'Deutsch'},
  {id: 'fr', title: 'Français'},
]

export const localizedString = {
  name: 'localizedString',
  title: 'Tekst (PL/EN/DE/FR)',
  type: 'object',
  fields: SUPPORTED_LANGUAGES.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'string',
  })),
  preview: {
    select: {
      pl: 'pl',
      en: 'en',
      de: 'de',
      fr: 'fr',
    },
    prepare({pl, en, de, fr}) {
      return {
        title: pl || en || de || fr || '(empty)',
        subtitle: 'Tekst (PL/EN/DE/FR)',
      }
    },
  },
}

export const localizedText = {
  name: 'localizedText',
  title: 'Tekst wieloliniowy (PL/EN/DE/FR)',
  type: 'object',
  fields: SUPPORTED_LANGUAGES.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'text',
    rows: 3,
  })),
  preview: {
    select: {
      pl: 'pl',
      en: 'en',
      de: 'de',
      fr: 'fr',
    },
    prepare({pl, en, de, fr}) {
      const v = pl || en || de || fr || ''
      return {
        title: v ? `${v}`.slice(0, 60) : '(empty)',
        subtitle: 'Tekst wieloliniowy (PL/EN/DE/FR)',
      }
    },
  },
}

export const blockContent = {
  name: 'blockContent',
  title: 'Treść (blokowa)',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Zwykły', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Cytat', value: 'blockquote'},
      ],
      lists: [
        {title: 'Lista punktowana', value: 'bullet'},
        {title: 'Lista numerowana', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Pogrubienie', value: 'strong'},
          {title: 'Kursywa', value: 'em'},
          {title: 'Podkreślenie', value: 'underline'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
              },
            ],
          },
        ],
      },
    },
    {type: 'image', options: {hotspot: true}},
  ],
}

export const localizedBlockContent = {
  name: 'localizedBlockContent',
  title: 'Treść (PL/EN/DE/FR)',
  type: 'object',
  fields: SUPPORTED_LANGUAGES.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'blockContent',
  })),
}
