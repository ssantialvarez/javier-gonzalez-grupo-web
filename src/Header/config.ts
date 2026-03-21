import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'hasSubMenu',
          type: 'checkbox',
          label: 'Tiene submenú (Dropdown)',
        },
        link({
          appearances: false,
        }),
        {
          name: 'subMenuLinks',
          type: 'array',
          label: 'Enlaces del Submenú',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.hasSubMenu),
            initCollapsed: true,
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
