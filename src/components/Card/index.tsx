'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData | MediaType
  relationTo?: 'posts' | 'media'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo = 'posts', showCategories, title: titleFromProps } = props

  const isMedia = relationTo === 'media'

  // Safe cast since we know the shape based on relationTo
  const postDoc = !isMedia ? (doc as CardPostData) : null
  const mediaDoc = isMedia ? (doc as MediaType) : null

  const { slug, categories, meta, title } = postDoc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = !isMedia ? titleFromProps || title : null
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = !isMedia ? `/${relationTo}/${slug}` : null

  return (
    <article
      className={cn(
        isMedia
          ? 'overflow-hidden hover:cursor-pointer'
          : 'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer flex flex-col h-full',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {!isMedia && !metaImage && <div className="">No image</div>}
        {!isMedia && metaImage && typeof metaImage !== 'string' && (
          <Media resource={metaImage} size="33vw" />
        )}
        {isMedia && mediaDoc && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="hover:opacity-90 transition-opacity w-full overflow-hidden cursor-pointer">
                <Media resource={mediaDoc} size="33vw" imgClassName="w-full h-auto" />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[100dvh] w-full border-none bg-transparent p-0 flex justify-center items-center shadow-none">
              <DialogTitle className="sr-only">Image preview</DialogTitle>
              {/* Plain img bypasses Next.js Image optimization, fixing Vercel Blob large-image loading */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getMediaUrl(mediaDoc.url, mediaDoc.updatedAt)}
                alt={mediaDoc.alt || ''}
                className="max-h-[90vh] w-auto object-contain rounded-md"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      {!isMedia && (
        <div className="p-4">
          {showCategories && hasCategories && (
            <div className="uppercase text-sm mb-4">
              {showCategories && hasCategories && (
                <div>
                  {categories?.map((category, index) => {
                    if (typeof category === 'object') {
                      const { title: titleFromCategory } = category

                      const categoryTitle = titleFromCategory || 'Untitled category'

                      const isLast = index === categories.length - 1

                      return (
                        <Fragment key={index}>
                          {categoryTitle}
                          {!isLast && <Fragment>, &nbsp;</Fragment>}
                        </Fragment>
                      )
                    }

                    return null
                  })}
                </div>
              )}
            </div>
          )}
          {titleToUse && (
            <div className="prose">
              <h3>
                {href ? (
                  <Link className="not-prose" href={href} ref={link.ref}>
                    {titleToUse}
                  </Link>
                ) : (
                  <span className="not-prose">{titleToUse}</span>
                )}
              </h3>
            </div>
          )}
          {description && (
            <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>
          )}
        </div>
      )}
    </article>
  )
}
