import { defineField, defineType } from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Hero Tagline',
      type: 'string',
    }),
    defineField({
      name: 'rulesImage',
      title: 'Hero Rules & Settings Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'yearsTrading',
      title: 'Years Trading',
      type: 'string',
    }),
    defineField({
      name: 'revenue',
      title: 'Revenue Generated',
      type: 'string',
    }),
    defineField({
      name: 'numberOfAlgos',
      title: 'Number of Algos',
      type: 'string',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' },
          ],
        },
      ],
    }),
  ],
})
