'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import { HeaderNav } from './Nav'
import { MobileMenu } from './MobileMenu'
import { MobileMenuButton } from './MobileMenu/MobileMenuButton'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  // Reset header theme on pathname change
  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Scroll detection for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Split navigation items: first 3 left, next 3 right
  const navItems = data?.navItems || []
  const leftNavItems = navItems.slice(0, 3)
  const rightNavItems = navItems.slice(3, 6)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-border',
        scrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-background/80 backdrop-blur-sm',
      )}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-300',
            scrolled ? 'py-3' : 'py-4',
          )}
        >
          {/* Left Nav - desktop only */}
          <div className="hidden md:flex gap-6 flex-1 justify-end">
            <HeaderNav items={leftNavItems} position="left" />
          </div>

          {/* Centered Logo */}
          <div className="flex-shrink-0 md:px-8">
            <Link href="/">
              <Logo loading="eager" priority="high" className="invert dark:invert-0" />
            </Link>
          </div>

          {/* Right Nav - desktop only */}
          <div className="hidden md:flex gap-6 flex-1 justify-start">
            <HeaderNav items={rightNavItems} position="right" />
          </div>

          {/* Mobile: Logo left, Hamburger right */}
          <div className="md:hidden flex items-center justify-between w-full">
            <Link href="/">
              <Logo loading="eager" priority="high" className="invert dark:invert-0" />
            </Link>
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </header>
  )
}
