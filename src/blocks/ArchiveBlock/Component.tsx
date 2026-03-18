import type { Post, Media, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    categories,
    folders,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    relationTo,
  } = props

  const limit = limitFromProps || 3

  let posts: (Post | Media)[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const flattenedFolders = folders?.map((folder) => {
      if (typeof folder === 'object') return folder.id
      else return folder
    })

    const fetchedPosts = await payload.find({
      collection: relationTo || 'posts',
      depth: 1,
      limit,
      ...(flattenedCategories &&
      flattenedCategories.length > 0 &&
      (!relationTo || relationTo === 'posts')
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : flattenedFolders && flattenedFolders.length > 0 && relationTo === 'media'
          ? {
              where: {
                folder: {
                  in: flattenedFolders,
                },
              },
            }
          : {}),
    })

    posts = fetchedPosts.docs as (Post | Media)[]
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as (Post | Media)[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} relationTo={relationTo || 'posts'} />
    </div>
  )
}
