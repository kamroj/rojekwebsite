// sanity/schemaTypes/partner.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nazwa', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'logo',
      title: 'Logo',
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
    defineField({name: 'url', title: 'URL', type: 'url'}),
    defineField({name: 'order', title: 'Kolejność', type: 'number'}),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
