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
      {/* ===== MOBILE mini player ===== */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 px-2" onClick={() => setShowFull(true)}>
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute -inset-1 bg-accent/5 rounded-2xl blur-xl" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 rounded-full overflow-hidden z-10">
            <div className="h-full bg-gradient-to-r from-accent to-accent/60 transition-all duration-500" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="relative flex items-center gap-3 bg-surface/90 backdrop-blur-xl rounded-2xl px-3 py-2.5 border border-white/6 shadow-lg shadow-black/40">
            <Artwork src={artwork} size={44} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">{title}</div>
              {subtitle && <div className="text-[11px] text-muted truncate">{subtitle}</div>}
            </div>
            <PlayPauseBtn />
            {ps.track && <NextBtn />}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP bottom bar ===== */}
      <div className="hidden md:block fixed bottom-0 left-56 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-white/6">
        {/* Progress bar across full width */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress * 100}%` }} />
        </div>

        <div className="flex items-center gap-4 px-6 py-3 max-w-6xl mx-auto">
          {/* Left: track info */}
          <div className="flex items-center gap-3 w-72 flex-shrink-0 cursor-pointer" onClick={() => setShowFull(true)}>
            <Artwork src={artwork} size={48} />
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{title}</div>
              {subtitle && <div className="text-xs text-muted truncate">{subtitle}</div>}
            </div>
          </div>

          {/* Center: controls */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-4">
              {ps.track && (
                <button onClick={() => player.previous()} className="p-1.5 rounded-full hover:bg-white/6 text-muted hover:text-txt transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                </button>
              )}
              <button
                onClick={() => player.togglePlayPause()}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              >
                {ps.isPlaying ? (
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                )}
              </button>
              {ps.track && (
                <button onClick={() => player.next()} className="p-1.5 rounded-full hover:bg-white/6 text-muted hover:text-txt transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" /></svg>
                </button>
              )}
            </div>
            {/* Time display */}
            {ps.track && ps.duration > 0 && (
              <div className="flex items-center gap-2 w-full max-w-md">
                <span className="text-[10px] text-muted w-8 text-right tabular-nums">{fmt(ps.currentTime)}</span>
                <input
                  type="range" min={0} max={1} step={0.001} value={progress}
                  onChange={(e) => player.seek(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-[10px] text-muted w-8 tabular-nums">{fmt(ps.duration)}</span>
              </div>
            )}
          </div>

          {/* Right: volume placeholder */}
          <div className="w-72 flex-shrink-0" />
        </div>
      </div>

      {showFull && <FullPlayer onClose={() => setShowFull(false)} />}
    </>
  )
}

function Artwork({ src, size }: { src?: string; size: number }) {
  return (
    <div className="rounded-lg overflow-hidden flex-shrink-0 bg-white/4 ring-1 ring-white/6" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-accent/40">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
        </div>
      )}
    </div>
  )
}

function PlayPauseBtn() {
  const ps = usePlayer()
  if (ps.isLoading) return (
    <div className="w-9 h-9 flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return (
    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 hover:bg-white/10" onClick={(e) => { e.stopPropagation(); player.togglePlayPause() }}>
      {ps.isPlaying ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
      )}
    </button>
  )
}

function NextBtn() {
  return (
    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 hover:bg-white/10" onClick={(e) => { e.stopPropagation(); player.next() }}>
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" /></svg>
    </button>
  )
}

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}
