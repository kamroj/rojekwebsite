import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'slidingSpecialHighlight',
  title: 'Sliding: Special highlight block',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable block',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'localizedBlockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'imageOnLeft',
      title: 'Display image on the left side',
      type: 'boolean',
      initialValue: false,
      description: 'If enabled, image will be rendered on the left and text on the right.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'localizedString',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA link',
      type: 'string',
      description: 'Can be internal path or external URL.',
    }),
  ],
  preview: {
    select: {
      title: 'title.pl',
      subtitle: 'title.en',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || subtitle || 'Special highlight',
        subtitle: 'Sliding special block',
        media,
      }
    },
  },
})
