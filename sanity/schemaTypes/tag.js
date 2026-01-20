// sanity/schemaTypes/tag.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'group',
      title: 'Grupa',
      type: 'string',
      options: {
        list: [
          {title: 'Typ', value: 'type'},
          {title: 'Kolor', value: 'color'},
          {title: 'Zdobienie', value: 'ornament'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'value', title: 'Wartość (techniczna)', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'label', title: 'Etykieta (wyświetlana) (PL/EN/DE)', type: 'localizedString'}),
  ],
  preview: {
    select: {
      title: 'label.pl',
      subtitle: 'group',
    },
    prepare({title, subtitle}) {
      return {title: title || '(no label)', subtitle}
    },
  },
})
