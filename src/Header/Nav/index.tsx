'use client'

import React from 'react'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'

interface HeaderNavProps {
  items: Header['navItems']
  position?: 'left' | 'right'
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ items = [], position = 'left' }) => {
  if (!items) return null

  return (
    <nav className="flex gap-6 items-center">
      {items.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
    </nav>
  )
}
