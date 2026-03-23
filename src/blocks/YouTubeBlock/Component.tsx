import React from 'react'
import { cn } from '@/utilities/ui'

import type { YouTubeBlock as YouTubeBlockProps } from '@/payload-types'

const getVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

const colsClass: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}

export const YouTubeBlock: React.FC<YouTubeBlockProps> = (props) => {
  const { columns = '1', videos } = props

  if (!videos || videos.length === 0) return null

  return (
    <div className="container my-16">
      <div className={cn('grid gap-8', colsClass[columns] ?? colsClass['1'])}>
        {videos.map((video, index) => {
          const videoId = video.url ? getVideoId(video.url) : null
          if (!videoId) return null
          return (
            <div key={index}>
              <div className="aspect-video w-full relative">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-sm"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={video.caption ?? 'YouTube video player'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              {video.caption && (
                <div className="mt-4 text-center text-sm text-neutral-500">{video.caption}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
