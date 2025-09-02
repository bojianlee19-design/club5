// sanity/schemas/types/event.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Event Date & Time',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'doorsTime', title: 'Doors Open', type: 'string' }),
    defineField({ name: 'endTime', title: 'End Time', type: 'string' }),
    defineField({ name: 'venue', type: 'string' }),
    defineField({ name: 'ageRestriction', title: 'Age Restriction', type: 'string' }),
    defineField({ name: 'price', title: 'Price (text)', type: 'string' }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket URL',
      type: 'url',
      description: 'External ticketing link',
    }),
    defineField({
      name: 'lineup',
      title: 'Line-up',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cover',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  orderings: [
    { name: 'dateAsc', title: 'Date ↑', by: [{ field: 'date', direction: 'asc' }] },
    { name: 'dateDesc', title: 'Date ↓', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'cover',
    },
    prepare({ title, date, media }) {
      const d = date ? new Date(date).toLocaleString() : ''
      return { title: title || 'Untitled Event', subtitle: d, media }
    },
  },
})
