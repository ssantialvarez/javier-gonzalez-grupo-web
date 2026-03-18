'use client'

import { X } from 'lucide-react'
import React, { useEffect } from 'react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import type { Header } from '@/payload-types'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: Header['navItems']
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navItems = [] }) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className={cn(
          'absolute right-0 top-0 h-full w-[280px] bg-background shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Mobile navigation"
      >
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="mb-8 p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Nav items */}
          <div className="flex flex-col gap-4">
            {navItems?.map(({ link, hasSubMenu, subMenuLinks }, i) => {
              if (hasSubMenu && subMenuLinks && subMenuLinks.length > 0) {
                return (
                  <div key={i} className="flex flex-col gap-2">
                    <CMSLink {...link} appearance="link" className="text-lg font-semibold" />
                    <div className="flex flex-col gap-2 pl-4 border-l border-border ml-2">
                      {subMenuLinks.map(({ link: subLink }, j) => (
                        <CMSLink key={j} {...subLink} appearance="link" className="text-base opacity-80" />
                      ))}
                    </div>
                  </div>
                )
              }
              return (
                <CMSLink key={i} {...link} appearance="link" className="text-lg" />
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
