import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'project'}),
    defineField({
      name: 'project',
      title: 'Project name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Used to build the work item link, e.g. /work/rapha',
      type: 'slug',
      options: {source: 'project'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      description: 'Overrides the default "watch" label on the grid item.',
      type: 'string',
    }),
    defineField({
      name: 'orientation',
      title: 'Orientation',
      type: 'string',
      options: {
        list: [
          {title: 'Landscape', value: 'landscape'},
          {title: 'Portrait', value: 'portrait'},
        ],
      },
      initialValue: 'landscape',
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      description: 'Upload a video file directly — it gets pushed to Mux automatically.',
      type: 'mux.video',
    }),
    defineField({
      name: 'muxPlaybackId',
      title: 'Mux playback ID (legacy)',
      description: 'Only used as a fallback when no video is uploaded above.',
      type: 'string',
    }),
    defineField({
      name: 'videoSrc',
      title: 'Video file (mp4)',
      description: 'Only needed when not using Mux — a path under /public, e.g. /clip.mp4.',
      type: 'string',
    }),
    defineField({
      name: 'videoWebm',
      title: 'Video file (webm)',
      description: 'Only needed when not using Mux — a path under /public.',
      type: 'string',
    }),
    defineField({
      name: 'showCredits',
      title: 'Show credits',
      description: 'Turn off to hide the credits list for this project.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      description: 'One credit line per line, shown in the project overlay.',
      type: 'text',
      rows: 10,
      hidden: ({parent}) => parent?.showCredits === false,
    }),
  ],
  preview: {
    select: {
      title: 'project',
      subtitle: 'year',
      media: 'poster',
    },
  },
})
