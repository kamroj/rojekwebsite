import {defineField, defineType} from 'sanity'

const imageField = defineField({
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
})

export default defineType({
  name: 'slidingCommonProfile',
  title: 'Sliding: Profile thickness (shared section)',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sectionOverline',
      title: 'Section overline',
      type: 'localizedString',
      description: 'Optional override for section overline.',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section title',
      type: 'localizedString',
      description: 'Optional override for section title.',
    }),
    defineField({
      name: 'sectionSubtitle',
      title: 'Section subtitle',
      type: 'localizedString',
      description: 'Optional override for section subtitle.',
    }),
    defineField({
      name: 'useDefaultTabs',
      title: 'Use default tabs (78 / 90)',
      type: 'boolean',
      initialValue: true,
      description: 'When enabled, editors can override only selected fields for each default tab.',
    }),
    defineField({
      name: 'customTabs',
      title: 'Custom tabs (full replacement)',
      type: 'array',
      hidden: ({parent}) => parent?.useDefaultTabs !== false,
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'tabId', title: 'Tab ID', type: 'string'}),
            defineField({name: 'tabLabel', title: 'Tab label', type: 'localizedString'}),
            defineField({name: 'title', title: 'Title', type: 'localizedString'}),
            defineField({name: 'description', title: 'Description', type: 'localizedBlockContent'}),
            imageField,
          ],
          preview: {
            select: {
              title: 'tabLabel.pl',
              subtitle: 'tabId',
              media: 'image',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'defaultTabOverrides',
      title: 'Default tab overrides',
      type: 'array',
      hidden: ({parent}) => parent?.useDefaultTabs === false,
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'tabId',
              title: 'Tab to override',
              type: 'string',
              options: {
                list: [
                  {title: '78 mm', value: '78'},
                  {title: '90 mm', value: '90'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'overrideTabLabel', title: 'Override tab label', type: 'boolean', initialValue: false}),
            defineField({
              name: 'tabLabel',
              title: 'New tab label',
              type: 'localizedString',
              hidden: ({parent}) => !parent?.overrideTabLabel,
            }),
            defineField({name: 'overrideTitle', title: 'Override title', type: 'boolean', initialValue: false}),
            defineField({
              name: 'title',
              title: 'New title',
              type: 'localizedString',
              hidden: ({parent}) => !parent?.overrideTitle,
            }),
            defineField({name: 'overrideDescription', title: 'Override description', type: 'boolean', initialValue: false}),
            defineField({
              name: 'description',
              title: 'New description',
              type: 'localizedBlockContent',
              hidden: ({parent}) => !parent?.overrideDescription,
            }),
            defineField({name: 'overrideImage', title: 'Override image', type: 'boolean', initialValue: false}),
            defineField({
              ...imageField,
              name: 'image',
              hidden: ({parent}) => !parent?.overrideImage,
            }),
          ],
          preview: {
            select: {
              title: 'tabId',
              subtitle: 'title.pl',
              media: 'image',
            },
            prepare: ({title, subtitle, media}) => ({
              title: `Override ${title || 'tab'}`,
              subtitle: subtitle || 'Default tab override',
              media,
            }),
          },
        },
      ],
    }),
  ],
})
