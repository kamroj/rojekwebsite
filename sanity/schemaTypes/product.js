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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'category',
      title: 'Kategoria',
      type: 'reference',
      to: [{type: 'productCategory'}],
      weak: true,
      validation: (Rule) => Rule.required(),
      readOnly: ({document}) => Boolean(document?.categoryLocked),
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
    }),

    defineField({
      name: 'shortDescription',
      title: 'Krótki opis',
      type: 'localizedText',
      group: 'content',
    }),
    defineField({
      name: 'longDescription',
      title: 'Długi opis',
      type: 'localizedBlockContent',
      group: 'content',
    }),

    defineField({
      name: 'listImage',
      title: 'Zdjęcie kafelka (lista produktów w kategorii)',
      type: 'image',
      options: {hotspot: true},
      group: 'media',
      description:
        'Obraz używany na liście produktów (np. strona „Okna” pokazująca listę produktów w tej kategorii).',
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria (slajder zdjęć na detalu)',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      group: 'media',
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
      subtitle: 'category._ref',
      media: 'headerImage',
    },
  },
})

