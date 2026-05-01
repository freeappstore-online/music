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
      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-[var(--surface-hover)] active:bg-[var(--surface)] transition-colors text-left"
      onClick={() => player.playTrack(track, queue, index)}
    >
      <div className="w-11 h-11 rounded-md overflow-hidden flex-shrink-0 bg-[var(--surface)]">
        {track.artworkUrl ? (
          <img src={track.artworkUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--accent)]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium truncate ${playing ? 'text-[var(--accent)]' : ''}`}>
          {track.title}
        </div>
        <div className="text-xs text-[var(--text-muted)] truncate">
          {track.artist}{dur ? ` · ${dur}` : ''}
        </div>
      </div>

      {playing && (
        <div className="text-[var(--accent)] text-xs">
          <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" /></svg>
        </div>
      )}

      <button
        className="p-1 flex-shrink-0"
        onClick={(e) => { e.stopPropagation(); setFav(toggleTrackFavorite(track)) }}
      >
        <svg className={`w-5 h-5 ${fav ? 'text-red-500 fill-red-500' : 'text-[var(--text-muted)]'}`} fill={fav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </button>
  )
}
