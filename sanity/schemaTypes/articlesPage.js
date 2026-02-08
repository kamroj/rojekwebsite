import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'articlesPage',
  title: 'Ustawienia artykułów',
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
    defineField({
      name: 'headerTitle',
      title: 'Tytuł nagłówka',
      type: 'string',
      initialValue: 'Artykuły',
    }),
    defineField({
      name: 'headerSubtitle',
      title: 'Podtytuł nagłówka',
      type: 'string',
      initialValue: 'Wiedza i inspiracje ze świata stolarki budowlanej',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Ustawienia artykułów'}
    },
  },
})
