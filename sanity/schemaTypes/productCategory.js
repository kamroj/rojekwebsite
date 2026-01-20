// sanity/schemaTypes/productCategory.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productCategory',
  title: 'Kategoria produktu',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Nazwa', type: 'localizedString', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title.pl', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'subtitle', title: 'Podtytuł', type: 'localizedText'}),
    defineField({name: 'headerImage', title: 'Zdjęcie nagłówkowe', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'tile',
      title: 'Kafelek (Home/Produkty)',
      type: 'object',
      fields: [
        defineField({name: 'backgroundImage', title: 'Obrazek w tle', type: 'image', options: {hotspot: true}}),
        defineField({name: 'video', title: 'Wideo (mp4)', type: 'file'}),
      ],
    }),
    defineField({name: 'order', title: 'Kolejność', type: 'number'}),
    defineField({
      name: 'type',
      title: 'Typ kategorii (predefiniowany)',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          {title: 'Okna', value: 'windows'},
          {title: 'Okna przesuwne', value: 'slidingWindows'},
          {title: 'Drzwi zewnętrzne', value: 'exteriorDoors'},
          {title: 'Ppoż.', value: 'fireResistant'},
        ],
      },
      description: 'To pole jest pomocnicze — na razie kategorie są identyfikowane po documentId w panelu.',
    }),
  ],
  preview: {
    select: {
      title: 'title.pl',
      media: 'headerImage',
    },
  },
})
