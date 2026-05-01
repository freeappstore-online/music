import { player } from '../services/player'
import { usePlayer } from '../hooks'
import { useState } from 'react'
import { FullPlayer } from './FullPlayer'

export function MiniPlayer() {
  const ps = usePlayer()
  const [showFull, setShowFull] = useState(false)

  if (!ps.track && !ps.station) return null

  const title = ps.track?.title ?? ps.station?.name ?? ''
  const subtitle = ps.track?.artist ?? ''
  const artwork = ps.track?.artworkUrl ?? ps.station?.favicon
  const progress = ps.duration > 0 ? ps.currentTime / ps.duration : 0

  return (
    <>
      <div className="fixed bottom-14 left-0 right-0 z-40 px-2" onClick={() => setShowFull(true)}>
        <div className="max-w-2xl mx-auto relative">
        {/* progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="flex items-center gap-3 bg-[var(--surface)]/95 backdrop-blur-lg rounded-xl px-3 py-2 border border-[var(--border)]">
          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-[var(--bg)]">
            {artwork ? (
              <img src={artwork} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--accent)]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{title}</div>
            {subtitle && <div className="text-xs text-[var(--text-muted)] truncate">{subtitle}</div>}
          </div>

          {ps.isLoading ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <button
              className="w-8 h-8 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); player.togglePlayPause() }}
            >
              {ps.isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              )}
            </button>
          )}

          {ps.track && (
            <button
              className="w-8 h-8 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); player.next() }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" /></svg>
            </button>
          )}
        </div>
        </div>
      </div>

      {showFull && <FullPlayer onClose={() => setShowFull(false)} />}
    </>
  )
}
