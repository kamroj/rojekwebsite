import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'realizationTagKey',
  title: 'Klucz tagu realizacji',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Klucz techniczny',
      type: 'string',
      description: 'Stały klucz grupy filtrów (np. typ, kolor, dodatki).',
      validation: (Rule) =>
        Rule.required()
          .regex(/^[a-z0-9-]+$/, {
            name: 'slug-like-key',
            invert: false,
          })
          .error('Użyj małych liter, cyfr i myślnika.'),
    }),
    defineField({
      name: 'label',
      title: 'Nazwa klucza (PL/EN/DE)',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label.pl',
      subtitle: 'key',
    },
    prepare({title, subtitle}) {
      return {
        title: title || '(brak nazwy)',
        subtitle: subtitle ? `Klucz: ${subtitle}` : 'Brak klucza',
      }
    },
  },
})
