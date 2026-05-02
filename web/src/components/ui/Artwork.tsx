import { useState } from 'react'
import { MusicNote, RadioIcon } from './Icons'

type ArtworkProps = {
  src?: string
  alt?: string
  size: number
  rounded?: string
  type?: 'track' | 'station'
}

export function Artwork({ src, alt = '', size, rounded = 'rounded-lg', type = 'track' }: ArtworkProps) {
  const [failed, setFailed] = useState(false)
  const Icon = type === 'station' ? RadioIcon : MusicNote

  return (
    <div
      className={`${rounded} overflow-hidden flex-shrink-0 bg-white/4 ring-1 ring-white/6 flex items-center justify-center`}
      style={{ width: size, height: size }}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon className="w-5 h-5 text-accent/40" />
      )}
    </div>
  )
}
