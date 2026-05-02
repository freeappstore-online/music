import { useState } from 'react'
import type { Track } from '../types'
import { player } from '../services/player'
import { isTrackFavorite, toggleTrackFavorite, isTrackBlacklisted, blacklistTrack } from '../services/favorites'
import { usePlayer } from '../hooks'
import { formatDuration } from '../lib/format'
import { Artwork } from './ui/Artwork'
import { HeartIcon, DislikeIcon, PlayingBars } from './ui/Icons'

export function TrackRow({ track, queue, index, onBlacklist }: { track: Track; queue?: Track[]; index?: number; onBlacklist?: () => void }) {
  const ps = usePlayer()
  const [fav, setFav] = useState(() => isTrackFavorite(track.id))
  const [blocked, setBlocked] = useState(() => isTrackBlacklisted(track.id))
  const playing = ps.track?.id === track.id && ps.isPlaying
  const dur = formatDuration(track.duration)

  if (blocked) return null

  const handleBlacklist = (e: React.MouseEvent) => {
    e.stopPropagation()
    blacklistTrack(track)
    setBlocked(true)
    setFav(false)
    onBlacklist?.()
    // Skip to next if currently playing
    if (ps.track?.id === track.id) player.next()
  }

  return (
    <button
      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/3 active:bg-white/6 transition-colors text-left group"
      onClick={() => player.playTrack(track, queue, index)}
      aria-label={`Play ${track.title} by ${track.artist}`}
    >
      <Artwork src={track.artworkUrl} alt={track.title} size={48} />

      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-semibold truncate ${playing ? 'text-accent' : ''}`}>
          {track.title}
        </div>
        <div className="text-[11px] text-text-muted truncate mt-0.5">
          {track.artist}{dur ? ` · ${dur}` : ''}
        </div>
      </div>

      {playing && <PlayingBars />}

      <button
        className="p-1.5 flex-shrink-0 rounded-full hover:bg-white/6 opacity-0 group-hover:opacity-60 transition-opacity"
        onClick={handleBlacklist}
        aria-label="Never play again"
      >
        <DislikeIcon className="w-4 h-4" />
      </button>

      <button
        className="p-1.5 flex-shrink-0 rounded-full hover:bg-white/6 opacity-60 group-hover:opacity-100 transition-opacity"
        onClick={(e) => { e.stopPropagation(); setFav(toggleTrackFavorite(track)) }}
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <HeartIcon filled={fav} className="w-[18px] h-[18px]" />
      </button>
    </button>
  )
}
