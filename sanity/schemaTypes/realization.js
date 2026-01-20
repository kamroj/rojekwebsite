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
