import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'article',
  title: 'Artykuły',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Zdjęcie główne',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Tekst alternatywny',
          type: 'string',
          description: 'Ważne dla SEO i dostępności',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tagi',
      type: 'array',
      description: 'Tagi tylko dla artykułów (SEO + podobne artykuły).',
      of: [{ type: 'reference', to: [{ type: 'articleTag' }] }],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'content',
      title: 'Treść artykułu',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normalny', value: 'normal' },
            { title: 'Lead (większy akapit)', value: 'lead' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Cytat', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Pogrubienie', value: 'strong' },
              { title: 'Kursywa', value: 'em' },
              { title: 'Podkreślenie', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Otwórz w nowej karcie',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          name: 'contentImage',
          title: 'Zdjęcie',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Tekst alternatywny',
              type: 'string',
            },
            {
              name: 'caption',
              title: 'Podpis',
              type: 'string',
            },
            {
              name: 'layout',
              title: 'Układ',
              type: 'string',
              options: {
                list: [
                  { title: 'Pełna szerokość', value: 'full' },
                  { title: 'Po lewej (desktop)', value: 'left' },
                  { title: 'Po prawej (desktop)', value: 'right' },
                  { title: 'Wycentrowany', value: 'center' },
                ],
              },
              initialValue: 'full',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO: Tytuł strony',
      description: 'Opcjonalnie - jeśli puste, użyty zostanie tytuł artykułu',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO: Opis strony',
      description: 'Opcjonalnie - jeśli puste, użyty zostanie skrót z pierwszego akapitu artykułu',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
  ],
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  orderings: [
    {
      title: 'Data publikacji (najnowsze)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Data publikacji (najstarsze)',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'featuredImage',
      publishedAt: 'publishedAt',
    },
    prepare({ title, author, media, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('pl-PL')
        : 'Brak daty';
      return {
        title,
        subtitle: `${author || 'Brak autora'} • ${date}`,
        media,
      };
    },
  },
});