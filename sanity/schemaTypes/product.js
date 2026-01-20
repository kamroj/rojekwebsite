// sanity/schemaTypes/product.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Produkt',
  type: 'document',
  fields: [
    // Internal flag: if true, the product category was set via initialValueTemplate from the desk structure.
    // We use it to lock the category field so it's not confusing in the UI.
    defineField({
      name: 'categoryLocked',
      title: 'System: blokada kategorii',
      type: 'boolean',
      hidden: true,
      readOnly: true,
    }),
    defineField({name: 'name', title: 'Nazwa', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
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
    }),
    defineField({name: 'shortDescription', title: 'Krótki opis', type: 'localizedText'}),
    defineField({name: 'longDescription', title: 'Długi opis', type: 'localizedBlockContent'}),
    defineField({name: 'headerImage', title: 'Zdjęcie nagłówkowe', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'gallery',
      title: 'Galeria',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({name: 'video', title: 'Wideo (mp4)', type: 'file'}),
    defineField({
      name: 'specs',
      title: 'Specyfikacja',
      type: 'object',
      description:
        'Dla okien specyfikacja jest predefiniowana w kodzie. W CMS edytujesz tylko wartości współczynników.',
      fields: [
        defineField({
          name: 'soundInsulation',
          title: 'Izolacyjność akustyczna (Rw)',
          type: 'string',
        }),
        defineField({
          name: 'thermalTransmittance',
          title: 'Współczynnik przenikania ciepła (Uw)',
          type: 'string',
        }),
        defineField({
          name: 'windResistance',
          title: 'Odporność na obciążenie wiatrem',
          type: 'string',
        }),
        defineField({
          name: 'waterTightness',
          title: 'Wodoszczelność',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'features',
      title: 'Cechy / funkcje',
      type: 'array',
      of: [{type: 'localizedBlockContent'}],
    }),
    // Kolorystyka dla okien jest predefiniowana i wspólna – nie edytujemy jej w CMS.
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
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.title.pl',
      media: 'headerImage',
    },
  },
})
