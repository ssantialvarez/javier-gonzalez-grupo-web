'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white min-h-[80vh]"
      data-theme="dark"
    >
      {/* Contenedor del Título y Subtítulo (centrado) */}
      <div className="container mb-8 z-10 relative flex justify-center bg">
        <div className="max-w-[36.5rem] md:text-center">
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

      {/* Contenedor de Imagen */}
      <div className="absolute inset-0 select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}
