import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faqItem',
  title: 'FAQ (pozycja)',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Pytanie',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Odpowiedź',
      type: 'localizedBlockContent',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'question.pl',
      subtitle: 'question.en',
    },
    prepare({title, subtitle}) {
      return {
        title: title || subtitle || '(empty)',
        subtitle: 'FAQ',
      }
    },
  },
})

