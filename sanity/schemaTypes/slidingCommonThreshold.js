import {defineField, defineType} from 'sanity'

const imageField = {
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
}

export default defineType({
  name: 'slidingCommonThreshold',
  title: 'Sliding: Threshold (shared section)',
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
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section title',
      type: 'localizedString',
    }),
    defineField({
      name: 'useDefaultTabs',
      title: 'Use default tabs (67 / 50)',
      type: 'boolean',
      initialValue: true,
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
            defineField(imageField),
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
                  {title: '67 mm', value: '67'},
                  {title: '50 mm', value: '50'},
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
