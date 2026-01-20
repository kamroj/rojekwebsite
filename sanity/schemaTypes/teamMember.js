// sanity/schemaTypes/teamMember.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Osoba (zespół)',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Imię i nazwisko', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'role', title: 'Stanowisko', type: 'localizedString'}),
    defineField({name: 'photo', title: 'Zdjęcie', type: 'image', options: {hotspot: true}}),
    defineField({name: 'phone', title: 'Telefon', type: 'string'}),
    defineField({name: 'email', title: 'E-mail', type: 'string'}),
    defineField({name: 'order', title: 'Kolejność', type: 'number'}),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role.pl',
      media: 'photo',
    },
  },
})
