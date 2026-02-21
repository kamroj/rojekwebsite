// sanity/schemaTypes/product.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Produkt',
  type: 'document',
  groups: [
    {name: 'basic', title: 'Podstawowe'},
    {name: 'media', title: 'Media'},
    {name: 'specs', title: 'Specyfikacja'},
    {name: 'content', title: 'Treści'},
    {name: 'faq', title: 'FAQ'},
    {name: 'sliding', title: 'Okna przesuwne'},
    {name: 'system', title: 'System'},
  ],
  fields: [
    // Internal flag: if true, the product category was set via initialValueTemplate from the desk structure.
    // We use it to lock the category field so it's not confusing in the UI.
    defineField({
      name: 'categoryLocked',
      title: 'System: blokada kategorii',
      type: 'boolean',
      hidden: true,
      readOnly: true,
      group: 'system',
    }),
    defineField({
      name: 'name',
      title: 'Nazwa',
      type: 'string',
      group: 'basic',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context?.document?.category?._ref === 'category_ppoz') return true
          return value ? true : 'Pole wymagane'
        }),
      hidden: ({document}) => document?.category?._ref === 'category_ppoz',
    }),
    defineField({
      name: 'localizedName',
      title: 'Nazwa produktu (PL/EN/DE/FR)',
      type: 'localizedString',
      group: 'basic',
      hidden: ({document}) => document?.category?._ref !== 'category_ppoz',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context?.document?.category?._ref !== 'category_ppoz') return true
          return value?.pl ? true : 'Uzupełnij nazwę PL dla produktu ppoż'
        }),
      description:
        'Pole specjalne dla kategorii ppoż. Używane do wyświetlania nazwy produktu w danym języku.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const isFireRated = context?.document?.category?._ref === 'category_ppoz'
          if (isFireRated) return true
          return value?.current ? true : 'Pole wymagane'
        }),
      group: 'basic',
      hidden: ({document}) => document?.category?._ref === 'category_ppoz',
    }),
    defineField({
      name: 'localizedSlug',
      title: 'Slug (PL/EN/DE/FR)',
      type: 'localizedSlug',
      group: 'basic',
      hidden: ({document}) => document?.category?._ref !== 'category_ppoz',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context?.document?.category?._ref !== 'category_ppoz') return true
          return value?.pl ? true : 'Uzupełnij slug PL dla produktu ppoż'
        }),
      description:
        'Slug produktu ppoż w językach PL/EN/DE/FR.',
    }),
    defineField({
      name: 'category',
      title: 'Kategoria',
      type: 'reference',
      to: [{type: 'productCategory'}],
      weak: true,
      validation: (Rule) => Rule.required(),
      readOnly: ({document}) => Boolean(document?.categoryLocked),
      hidden: ({document}) => Boolean(document?.categoryLocked),
      description:
        'Jeśli tworzysz produkt z poziomu danej kategorii, kategoria ustawia się automatycznie (i jest zablokowana).',
      group: 'basic',
    }),
    defineField({
      name: 'headerImage',
      title: 'Zdjęcie nagłówkowe (na stronie produktu)',
      type: 'image',
      options: {hotspot: true},
      group: 'basic',
      description: 'Pokazuje się w nagłówku (hero) na stronie detalu produktu.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt (tekst alternatywny)',
          type: 'string',
          description: 'Opis obrazka dla SEO i dostępności.',
        }),
      ],
    }),
    defineField({
      name: 'listImage',
      title: 'Zdjęcie kafelka (lista produktów w kategorii)',
      type: 'image',
      options: {hotspot: true},
      group: 'media',
      description:
        'Obraz używany na liście produktów (np. strona „Okna” pokazująca listę produktów w tej kategorii).',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt (tekst alternatywny)',
          type: 'string',
          description: 'Opis obrazka dla SEO i dostępności.',
        }),
      ],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Zdanie promocyjne',
      type: 'localizedText',
      group: 'content',
    }),
    defineField({
      name: 'longDescription',
      title: 'Treść uzupełniająca',
      type: 'localizedBlockContent',
      description: 'Najlepiej jeden akapit uzupełniający zdanie promocyjne.',
      group: 'content',
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria (slajder zdjęć na detalu)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt (tekst alternatywny)',
              type: 'string',
              description: 'Opis obrazka dla SEO i dostępności.',
            }),
          ],
        },
      ],
      group: ['media', 'basic'],
    }),

    defineField({
      name: 'specs',
      title: 'Specyfikacja',
      type: 'object',
      description:
        'Dla okien specyfikacja jest predefiniowana w kodzie. W CMS edytujesz tylko wartości (3 parametry + wideo).',
      group: 'specs',
      fields: [
        defineField({
          name: 'video',
          title: 'Wideo (mp4)',
          type: 'file',
          description: 'Wideo pokazywane w sekcji „Cechy / funkcje” na stronie detalu.',
        }),
        defineField({
          name: 'profileThickness',
          title: 'Grubość profilu',
          type: 'string',
          description: 'Np. „70 mm” / „82 mm”.',
        }),
        defineField({
          name: 'thermalTransmittance',
          title: 'Przenikanie ciepła (Uw)',
          type: 'string',
          description: 'Np. „Uw < 0,73 W/m²K”.',
        }),
        defineField({
          name: 'waterTightness',
          title: 'Wodoszczelność',
          type: 'string',
          description: 'Np. „do 1500 Pa”.',
        }),
      ],
    }),

    defineField({
      name: 'features',
      title: 'Cechy / funkcje',
      type: 'array',
      of: [{type: 'localizedBlockContent'}],
      group: 'content',
    }),

    defineField({
      name: 'advantages',
      title: 'Zalety',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Tytuł', type: 'localizedString'}),
            defineField({name: 'description', title: 'Opis', type: 'localizedText'}),
          ],
          preview: {
            select: {title: 'title.pl'},
          },
        },
      ],
      group: 'content',
    }),

    defineField({
      name: 'slidingSystemType',
      title: 'Typ systemu przesuwnego',
      type: 'string',
      description:
        'Pole pomocnicze dla kategorii „Okna przesuwne” (ułatwia domyślne podpowiedzi i porządek edycji).',
      options: {
        list: [
          {title: 'HS Drewno', value: 'hs_wood'},
          {title: 'HS Drewno-Alu', value: 'hs_wood_alu'},
          {title: 'PSK', value: 'psk'},
          {title: 'Harmonijka', value: 'harmonica'},
        ],
        layout: 'radio',
      },
      hidden: ({document}) => document?.category?._ref !== 'category_okna_przesuwne',
      group: 'sliding',
    }),

    defineField({
      name: 'slidingCommonSections',
      title: 'Sekcje wspólne (z opcją override)',
      type: 'object',
      hidden: ({document}) => document?.category?._ref !== 'category_okna_przesuwne',
      group: 'sliding',
      fields: [
        defineField({
          name: 'profileThickness',
          title: 'Grubość profilu (78/90)',
          type: 'slidingCommonProfile',
        }),
        defineField({
          name: 'threshold',
          title: 'Próg (67/50)',
          type: 'slidingCommonThreshold',
        }),
        defineField({
          name: 'usageDetails',
          title: 'Szczegóły użytkowe (Szklenie / Okucia / Komfort domykania)',
          type: 'slidingCommonUsage',
        }),
      ],
    }),

    defineField({
      name: 'slidingSpecialSections',
      title: 'Sekcja specjalna (układana z bloków)',
      description:
        'Dodatkowe, wariantowe bloki dla danego produktu przesuwnego (np. „Ochrona konstrukcji drewnianej”).',
      type: 'array',
      hidden: ({document}) => document?.category?._ref !== 'category_okna_przesuwne',
      group: 'sliding',
      of: [{type: 'slidingSpecialHighlight'}],
    }),

    defineField({
      name: 'faq',
      title: 'FAQ',
      description:
        'Sekcja pytań i odpowiedzi widoczna na stronie tego produktu (nie jest współdzielona między produktami).',
      type: 'array',
      of: [{type: 'faqItem'}],
      group: 'faq',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      localizedTitle: 'localizedName.pl',
      subtitle: 'category._ref',
      media: 'headerImage',
    },
    prepare({title, localizedTitle, subtitle, media}) {
      return {
        title: localizedTitle || title || '(brak nazwy)',
        subtitle,
        media,
      }
    },
  },
})
