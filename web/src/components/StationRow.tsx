import type { RadioStation } from '../types'
import { player } from '../services/player'
import { isStationFavorite, toggleStationFavorite } from '../services/favorites'
import { usePlayer } from '../hooks'
import { useState } from 'react'

function formatVotes(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export function StationRow({ station }: { station: RadioStation }) {
  const ps = usePlayer()
  const [fav, setFav] = useState(() => isStationFavorite(station.id))
  const playing = ps.station?.id === station.id && ps.isPlaying
  const genre = station.genre?.split(',')[0] || ''

  return (
    <button
      className="flex items-center gap-3 w-full px-4 md:px-6 py-2 hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors text-left group"
      onClick={() => player.playStation(station)}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04] ring-1 ring-white/[0.06] flex items-center justify-center">
        {station.favicon ? (
          <img
            src={station.favicon}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = 'none'; el.nextElementSibling?.classList.remove('hidden') }}
          />
        ) : null}
        <div className={`flex items-center justify-center text-[var(--accent)]/40 ${station.favicon ? 'hidden' : ''}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm-1 4h1v2H4V9zm1 4v2H4v-2h1z" clipRule="evenodd" /></svg>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-semibold truncate ${playing ? 'text-[var(--accent)]' : ''}`}>
          {station.name}
        </div>
        <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
          {genre}{station.country ? ` · ${station.country}` : ''}{station.votes ? ` · ${formatVotes(station.votes)} votes` : ''}
        </div>
      </div>

      {/* Playing indicator */}
      {playing && (
        <div className="flex items-end gap-[2px] h-4">
          <div className="w-[3px] bg-[var(--accent)] rounded-full animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
          <div className="w-[3px] bg-[var(--accent)] rounded-full animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
          <div className="w-[3px] bg-[var(--accent)] rounded-full animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
        </div>
      )}

      {/* Favorite */}
      <button
        className="p-1.5 flex-shrink-0 rounded-full hover:bg-white/[0.06] opacity-60 group-hover:opacity-100 transition-opacity"
        onClick={(e) => { e.stopPropagation(); setFav(toggleStationFavorite(station)) }}
      >
        <svg className={`w-[18px] h-[18px] ${fav ? 'text-red-400 fill-red-400' : 'text-[var(--text-muted)]'}`} fill={fav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </button>
  )
}
