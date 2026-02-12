import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productsPage',
  title: 'Ustawienia produktów',
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'headerImage',
      title: 'Zdjęcie nagłówkowe (top image)',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt (tekst alternatywny)',
          type: 'string',
          description: 'Opis obrazka dla SEO i dostępności.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Ustawienia produktów'}
    },
  },
})