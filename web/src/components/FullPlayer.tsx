import { player } from '../services/player'
import { usePlayer } from '../hooks'
import { isTrackFavorite, isStationFavorite, toggleTrackFavorite, toggleStationFavorite } from '../services/favorites'
import { useState } from 'react'

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function FullPlayer({ onClose }: { onClose: () => void }) {
  const ps = usePlayer()
  const [fav, setFav] = useState(() =>
    ps.track ? isTrackFavorite(ps.track.id) : ps.station ? isStationFavorite(ps.station.id) : false
  )

  const title = ps.track?.title ?? ps.station?.name ?? ''
  const subtitle = ps.track?.artist ?? ''
  const artwork = ps.track?.artworkUrl ?? ps.station?.favicon
  const progress = ps.duration > 0 ? ps.currentTime / ps.duration : 0
  const sourceLabel = ps.track?.source === 'jamendo' ? 'Jamendo' : ps.track?.source === 'internetarchive' ? 'Internet Archive' : ''

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col items-center animate-slideUp">
      <div className="w-full max-w-2xl flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <button onClick={onClose} className="p-2 -ml-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {sourceLabel && <span className="text-xs text-muted">{sourceLabel}</span>}
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        {/* Artwork */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
          {artwork ? (
            <img src={artwork} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/60 to-accent/20">
              <svg className="w-20 h-20 text-white/80" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center w-full">
          <div className="text-xl font-bold truncate">{title}</div>
          {subtitle && <div className="text-muted mt-1 truncate">{subtitle}</div>}
        </div>

        {/* Progress */}
        {ps.track && ps.duration > 0 && (
          <div className="w-full">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={progress}
              onChange={(e) => player.seek(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>{formatTime(ps.currentTime)}</span>
              <span>-{formatTime(ps.duration - ps.currentTime)}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-10">
          {ps.track && (
            <button onClick={() => player.previous()} className="p-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
            </button>
          )}
          <button onClick={() => player.togglePlayPause()} className="p-2">
            {ps.isPlaying ? (
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            )}
          </button>
          {ps.track && (
            <button onClick={() => player.next()} className="p-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" /></svg>
            </button>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={() => {
            if (ps.track) setFav(toggleTrackFavorite(ps.track))
            else if (ps.station) setFav(toggleStationFavorite(ps.station))
          }}
        >
          <svg className={`w-7 h-7 ${fav ? 'text-red-500 fill-red-500' : 'text-muted'}`} fill={fav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  )
}
