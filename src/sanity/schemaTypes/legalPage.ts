import { defineField, defineType } from 'sanity'

export const legalPageType = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated Date',
      type: 'string',
      description: 'e.g., August 8, 2026',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'legalSection',
          title: 'Legal Section',
          fields: [
            { name: 'heading', title: 'Section Heading', type: 'string' },
            { 
              name: 'body', 
              title: 'Section Body', 
              type: 'text',
              description: 'HTML is supported for paragraphs, lists, and links.'
            }
          ]
        }
      ]
    })
  ]
})
