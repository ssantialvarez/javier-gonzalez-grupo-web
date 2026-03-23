'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  mediaMobile,
  richText,
  mediaPosition = 'center',
  mediaPositionMobile,
  contentAlignment = 'center',
  contentVerticalAlignment = 'center',
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  // Dynamic classes for alignment and image positioning
  const alignmentClasses: Record<string, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const verticalAlignmentClasses: Record<string, string> = {
    top: 'items-start pt-32', // Added padding top to clear the header
    center: 'items-center',
    bottom: 'items-end pb-32', // Added padding bottom to not overlap buttons
  }

  const textAlignmentClasses: Record<string, string> = {
    left: 'md:text-left',
    center: 'md:text-center',
    right: 'md:text-right',
  }

  // Position classes without breakpoint prefix (for mobile layer)
  const mobilePositionClasses: Record<string, string> = {
    top: 'object-top',
    center: 'object-center',
    bottom: 'object-bottom',
    left: 'object-left',
    right: 'object-right',
  }

  // Position classes with md: prefix (for desktop layer)
  const desktopPositionClasses: Record<string, string> = {
    top: 'md:object-top',
    center: 'md:object-center',
    bottom: 'md:object-bottom',
    left: 'md:object-left',
    right: 'md:object-right',
  }

  // Fallback to center if somehow value is not mapped
  const alignmentClass = alignmentClasses[contentAlignment || 'center'] || 'justify-center'
  const verticalAlignmentClass =
    verticalAlignmentClasses[contentVerticalAlignment || 'center'] || 'items-center'
  const textAlignmentClass = textAlignmentClasses[contentAlignment || 'center'] || 'md:text-center'

  // Effective positions: mobile inherits desktop if not set
  const effectiveMobilePos = mediaPositionMobile || mediaPosition || 'center'
  const effectiveDesktopPos = mediaPosition || 'center'

  const mobilePositionClass = mobilePositionClasses[effectiveMobilePos] || 'object-center'
  const desktopPositionClass = desktopPositionClasses[effectiveDesktopPos] || 'md:object-center'

  const hasMobileImage = mediaMobile && typeof mediaMobile === 'object'

  return (
    <div
      className={`relative -mt-[10.4rem] flex justify-center text-white min-h-[80vh] ${verticalAlignmentClass}`}
      data-theme="dark"
    >
      {/* Contenedor del Título y Subtítulo */}
      <div className={`container mb-8 z-10 relative flex w-full ${alignmentClass}`}>
        <div className={`max-w-[36.5rem] ${textAlignmentClass}`}>
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
        </div>
      </div>

      {/* Contenedor de Botones (posicionado absolutamente abajo) */}
      {Array.isArray(links) && links.length > 0 && (
        <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center w-full">
          <ul className="flex justify-center gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} size="lg" className="text-lg px-8 py-6 rounded-full" />
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Contenedor de Imagen — art direction: imagen móvil + imagen escritorio */}
      {hasMobileImage ? (
        <>
          {/* Imagen para móvil (oculta en md y superior) */}
          <div className="md:hidden absolute inset-0 select-none">
            <Media
              fill
              imgClassName={`-z-10 object-cover ${mobilePositionClass}`}
              priority
              resource={mediaMobile}
            />
          </div>
          {/* Imagen para escritorio (visible solo en md y superior) */}
          <div className="hidden md:block absolute inset-0 select-none">
            {media && typeof media === 'object' && (
              <Media
                fill
                imgClassName={`-z-10 object-cover ${desktopPositionClass}`}
                priority
                resource={media}
              />
            )}
          </div>
        </>
      ) : (
        /* Sin imagen móvil: misma imagen con posición CSS por breakpoint */
        <div className="absolute inset-0 select-none">
          {media && typeof media === 'object' && (
            <Media
              fill
              imgClassName={`-z-10 object-cover ${mobilePositionClass} ${desktopPositionClass}`}
              priority
              resource={media}
            />
          )}
        </div>
      )}
    </div>
  )
}
