import type { Block } from 'payload'

export const YouTube: Block = {
  slug: 'youtubeBlock',
  interfaceName: 'YouTubeBlock',
  labels: {
    singular: 'Video de YouTube',
    plural: 'Videos de YouTube',
  },
  fields: [
    {
      name: 'columns',
      type: 'select',
      label: 'Columnas',
      defaultValue: '1',
      required: true,
      options: [
        { label: '1 columna (ancho completo)', value: '1' },
        { label: '2 columnas', value: '2' },
        { label: '3 columnas', value: '3' },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      label: 'Videos',
      minRows: 1,
      admin: {
        initCollapsed: true,
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
    },
  ],
}
