import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'articleTag',
  title: 'Tag artykułu',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nazwa tagu',
      type: 'string',
      description: 'Tag używany wyłącznie w artykułach (SEO + podobne artykuły).',
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
