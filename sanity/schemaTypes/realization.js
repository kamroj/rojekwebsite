// sanity/schemaTypes/realization.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'realization',
  title: 'Realizacja (zdjęcie)',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
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
      name: 'tags',
      title: 'Tagi',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
  ],
  preview: {
    select: {
      media: 'image',
    },
    prepare({media}) {
      return {title: 'Realizacja', media}
    },
  },
})
