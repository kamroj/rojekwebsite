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
          type: 'localizedString',
          description: 'Opis obrazka dla SEO i dostępności (PL/EN/DE).',
        }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tagi realizacji',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'realizationTagItem',
          title: 'Tag',
          fields: [
            defineField({
              name: 'key',
              title: 'Klucz tagu',
              type: 'reference',
              to: [{type: 'realizationTagKey'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Wartość (PL/EN/DE)',
              type: 'localizedString',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              value: 'value.pl',
              keyLabel: 'key.label.pl',
              key: 'key.key',
            },
            prepare({value, keyLabel, key}) {
              return {
                title: value || '(brak wartości)',
                subtitle: keyLabel || key || '(brak klucza)',
              }
            },
          },
        },
      ],
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
