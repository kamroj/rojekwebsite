// sanity/schemaTypes/contactPage.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Kontakt',
  type: 'document',
  // Singleton (edytujesz jeden dokument strony kontaktowej)
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({name: 'headerImage', title: 'Zdjęcie nagłówkowe', type: 'image', options: {hotspot: true}}),
    defineField({name: 'headerTitle', title: 'Tytuł', type: 'localizedString'}),
    defineField({name: 'headerSubtitle', title: 'Podtytuł', type: 'localizedText'}),
    defineField({
      name: 'contact',
      title: 'Dane kontaktowe',
      type: 'object',
      fields: [
        defineField({name: 'address', title: 'Adres', type: 'localizedText'}),
        defineField({name: 'mapUrl', title: 'Link do mapy (embed)', type: 'url'}),
        defineField({name: 'phone', title: 'Telefon', type: 'string'}),
        defineField({name: 'email', title: 'E-mail', type: 'string'}),
        defineField({name: 'hours', title: 'Godziny', type: 'localizedString'}),
        defineField({name: 'nip', title: 'NIP', type: 'string'}),
        defineField({name: 'regon', title: 'REGON', type: 'string'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Kontakt'}
    },
  },
})
