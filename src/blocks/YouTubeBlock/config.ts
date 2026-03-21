import type { Block } from 'payload'

export const YouTube: Block = {
  slug: 'youtubeBlock', // Identificador del bloque
  interfaceName: 'YouTubeBlock',
  labels: {
    singular: 'Video de YouTube',
    plural: 'Videos de YouTube',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'URL del Video',
      required: true,
      admin: {
        placeholder: 'https://www.youtube.com/watch?v=...',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Subtítulo o descripción corta',
    },
  ],
}
