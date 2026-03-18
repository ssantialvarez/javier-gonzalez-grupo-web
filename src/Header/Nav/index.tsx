'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

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
      {items.map(({ link, hasSubMenu, subMenuLinks }, i) => {
        if (hasSubMenu && subMenuLinks && subMenuLinks.length > 0) {
          return (
            <div key={i} className="group relative py-2">
              <div className="flex items-center gap-1 cursor-pointer">
                <CMSLink {...link} appearance="link" className="pr-0" />
                <ChevronDown
                  className="h-4 w-4 transition-transform group-hover:rotate-180"
                  color="white"
                />
              </div>

              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-background border border-border shadow-lg rounded-md min-w-[200px] flex flex-col py-2">
                  {subMenuLinks.map(({ link: subLink }, j) => (
                    <div key={j} className="px-4 py-2 hover:bg-muted transition-colors">
                      <CMSLink
                        {...subLink}
                        appearance="link"
                        className="w-full inline-block !no-underline"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        return <CMSLink key={i} {...link} appearance="link" />
      })}
    </nav>
  )
}
