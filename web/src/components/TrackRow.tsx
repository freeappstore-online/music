import type { Track } from '../types'
import { player } from '../services/player'
import { isTrackFavorite, toggleTrackFavorite } from '../services/favorites'
import { usePlayer } from '../hooks'
import { useState } from 'react'

export function TrackRow({ track, queue, index }: { track: Track; queue?: Track[]; index?: number }) {
  const ps = usePlayer()
  const [fav, setFav] = useState(() => isTrackFavorite(track.id))
  const playing = ps.track?.id === track.id && ps.isPlaying

  const dur = track.duration > 0
    ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}`
    : ''

  return (
    <button
      className="flex items-center gap-3 w-full px-4 md:px-6 py-2 hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors text-left group"
      onClick={() => player.playTrack(track, queue, index)}
    >
      {/* Artwork */}
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04] ring-1 ring-white/[0.06]">
        {track.artworkUrl ? (
          <img src={track.artworkUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--accent)]/40">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-semibold truncate ${playing ? 'text-[var(--accent)]' : ''}`}>
          {track.title}
        </div>
        <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
          {track.artist}{dur ? ` · ${dur}` : ''}
          {track.source === 'internetarchive' && ' · Archive'}
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
        onClick={(e) => { e.stopPropagation(); setFav(toggleTrackFavorite(track)) }}
      >
        <svg className={`w-[18px] h-[18px] ${fav ? 'text-red-400 fill-red-400' : 'text-[var(--text-muted)]'}`} fill={fav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </button>
  )
}
