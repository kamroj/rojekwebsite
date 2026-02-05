// sanity/schemaTypes/productCategory.js
import {defineField, defineType} from 'sanity'

const CATEGORY_TITLES_BY_ID = {
  category_okna: 'Okna',
  category_okna_przesuwne: 'Okna przesuwne',
  category_drzwi_zewnetrzne: 'Drzwi zewnętrzne',
  category_ppoz: 'Ppoż.',
}

export default defineType({
  name: 'productCategory',
  title: 'Kategoria produktu',
  type: 'document',
  fields: [
    // Kategorie są predefiniowane w kodzie (IA + tłumaczenia + slug). W CMS trzymamy tylko media.
    defineField({
      name: 'headerImage',
      title: 'Zdjęcie nagłówkowe',
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
    }),
    defineField({
      name: 'tile',
      title: 'Kafelek (Home/Produkty)',
      type: 'object',
      fields: [
        defineField({
          name: 'backgroundImage',
          title: 'Obrazek w tle',
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
        }),
      ],
    }),
    defineField({
      name: 'type',
      title: 'Typ kategorii (predefiniowany)',
      type: 'string',
      readOnly: true,
      hidden: true,
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
      id: '_id',
      media: 'headerImage',
    },
    prepare: ({id, media}) => ({
      title: CATEGORY_TITLES_BY_ID[id] || id,
      media,
    }),
  },
})
