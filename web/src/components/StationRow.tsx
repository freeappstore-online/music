import { useState } from 'react'
import type { RadioStation } from '../types'
import { player } from '../services/player'
import { isStationFavorite, toggleStationFavorite, isStationBlacklisted, blacklistStation } from '../services/favorites'
import { getUserTags } from '../services/usertags'
import { usePlayer } from '../hooks'
import { formatVotes } from '../lib/format'
import { Artwork } from './ui/Artwork'
import { HeartIcon, ThumbDownIcon, PlayingBars } from './ui/Icons'

function isAdFree(station: RadioStation): boolean {
  // SomaFM is always ad-free
  if (station.id.startsWith('soma-')) return true
  // Check user tags
  const tags = getUserTags(station.id)
  return tags.some(t => t === 'ad-free' || t === 'adfree' || t === 'no-ads' || t === 'no ads')
}

export function StationRow({ station, onBlacklist }: { station: RadioStation; onBlacklist?: () => void }) {
  const ps = usePlayer()
  const [fav, setFav] = useState(() => isStationFavorite(station.id))
  const [blocked, setBlocked] = useState(() => isStationBlacklisted(station.id))
  const playing = ps.station?.id === station.id && ps.isPlaying
  const genre = station.genre?.split(',')[0] || ''
  const adFree = isAdFree(station)

  if (blocked) return null

  const handleBlacklist = (e: React.MouseEvent) => {
    e.stopPropagation()
    blacklistStation(station)
    setBlocked(true)
    setFav(false)
    onBlacklist?.()
  }

  return (
    <button
      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/3 active:bg-white/6 transition-colors text-left group"
      onClick={() => player.playStation(station)}
      aria-label={`Play ${station.name}`}
    >
      <Artwork src={station.favicon} alt={station.name} size={48} type="station" />

      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-semibold truncate flex items-center gap-1.5 ${playing ? 'text-accent' : ''}`}>
          {station.name}
          {adFree && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent/15 text-accent flex-shrink-0">AD-FREE</span>}
        </div>
        <div className="text-[11px] text-text-muted truncate mt-0.5">
          {genre}{station.country ? ` · ${station.country}` : ''}{station.votes ? ` · ${formatVotes(station.votes)} votes` : ''}
        </div>
      </div>

      {playing && <PlayingBars />}

      <button
        className="p-1.5 flex-shrink-0 rounded-full hover:bg-white/6 opacity-0 group-hover:opacity-60 transition-opacity"
        onClick={handleBlacklist}
        aria-label="Never play again"
      >
        <ThumbDownIcon className="w-4 h-4" />
      </button>

      <button
        className="p-1.5 flex-shrink-0 rounded-full hover:bg-white/6 opacity-60 group-hover:opacity-100 transition-opacity"
        onClick={(e) => { e.stopPropagation(); setFav(toggleStationFavorite(station)) }}
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <HeartIcon filled={fav} className="w-[18px] h-[18px]" />
      </button>
    </button>
  )
}
