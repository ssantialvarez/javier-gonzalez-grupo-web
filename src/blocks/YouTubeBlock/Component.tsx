import React from 'react'

import type { YouTubeBlock as YouTubeBlockProps } from '@/payload-types'

export const YouTubeBlock: React.FC<YouTubeBlockProps> = (props) => {
  const { url, caption } = props

  // Extraer el ID del video de la URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = url ? getVideoId(url) : null

  if (!videoId) return null

  return (
    <div className="container my-16">
      <div className="aspect-video w-full relative outline-none -outline-offset-2">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-sm"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      {caption && <div className="mt-4 text-center text-sm text-neutral-500">{caption}</div>}
    </div>
  )
}
