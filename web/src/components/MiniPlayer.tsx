import { useState } from 'react'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { player } from '../services/player'
import { usePlayer } from '../hooks'
import { formatTime } from '../lib/format'
import { Artwork } from './ui/Artwork'
import { HeartIcon, DislikeIcon } from './ui/Icons'
import { Spinner } from './ui/Spinner'
import { FullPlayer } from './FullPlayer'
import { isTrackFavorite, isStationFavorite, toggleTrackFavorite, toggleStationFavorite, blacklistTrack, blacklistStation } from '../services/favorites'

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
      {/* Mobile */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 px-2" onClick={() => setShowFull(true)}>
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute -inset-1 bg-accent/5 rounded-2xl blur-xl" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 rounded-full overflow-hidden z-10">
            <div className="h-full bg-gradient-to-r from-accent to-accent/60 transition-all duration-500" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="relative flex items-center gap-3 bg-surface/90 backdrop-blur-xl rounded-2xl px-3 py-2.5 border border-white/6 shadow-lg shadow-black/40">
            <Artwork src={artwork} alt={title} size={44} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">{title}</div>
              {subtitle && <div className="text-[11px] text-text-muted truncate">{subtitle}</div>}
            </div>
            {ps.isLoading ? <Spinner size={16} /> : (
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 hover:bg-white/10" onClick={(e) => { e.stopPropagation(); player.togglePlayPause() }} aria-label={ps.isPlaying ? 'Pause' : 'Play'}>
                {ps.isPlaying ? <PauseIcon /> : <PlayCircleIcon />}
              </button>
            )}
            {ps.track && (
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/6 hover:bg-white/10" onClick={(e) => { e.stopPropagation(); player.next() }} aria-label="Next">
                <NextIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-white/6">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="flex items-center gap-4 px-6 py-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 w-72 flex-shrink-0 cursor-pointer" onClick={() => setShowFull(true)}>
            <Artwork src={artwork} alt={title} size={48} />
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{title}</div>
              {subtitle && <div className="text-xs text-text-muted truncate">{subtitle}</div>}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-4">
              {ps.track && <ControlBtn onClick={() => player.previous()} label="Previous"><PrevIcon /></ControlBtn>}
              <button onClick={() => player.togglePlayPause()} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform" aria-label={ps.isPlaying ? 'Pause' : 'Play'}>
                {ps.isPlaying ? <PauseIcon className="text-black" /> : <PlayCircleIcon className="text-black" />}
              </button>
              {ps.track && <ControlBtn onClick={() => player.next()} label="Next"><NextIcon /></ControlBtn>}
            </div>
            {ps.track && ps.duration > 0 && (
              <div className="flex items-center gap-2 w-full max-w-md">
                <span className="text-[10px] text-text-muted w-8 text-right tabular-nums">{formatTime(ps.currentTime)}</span>
                <input type="range" min={0} max={1} step={0.001} value={progress} onChange={(e) => player.seek(parseFloat(e.target.value))} className="flex-1" />
                <span className="text-[10px] text-text-muted w-8 tabular-nums">{formatTime(ps.duration)}</span>
              </div>
            )}
          </div>
          <div className="w-72 flex-shrink-0 flex items-center justify-end gap-2">
            <DesktopRatingBtns />
          </div>
        </div>
      </div>

      {showFull && <FullPlayer onClose={() => setShowFull(false)} />}
    </>
  )
}

function ControlBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return <button onClick={onClick} className="p-1.5 rounded-full hover:bg-white/6 text-text-muted hover:text-text transition-colors" aria-label={label}>{children}</button>
}

function PlayCircleIcon({ className = '' }: { className?: string }) {
  return <Play className={`w-5 h-5 ${className}`} strokeWidth={2} />
}
function PauseIcon({ className = '' }: { className?: string }) {
  return <Pause className={`w-5 h-5 ${className}`} strokeWidth={2} />
}
function NextIcon() {
  return <SkipForward className="w-5 h-5" strokeWidth={2} />
}
function PrevIcon() {
  return <SkipBack className="w-5 h-5" strokeWidth={2} />
}

function DesktopRatingBtns() {
  const ps = usePlayer()
  const fav = ps.track ? isTrackFavorite(ps.track.id) : ps.station ? isStationFavorite(ps.station.id) : false

  return (
    <>
      <button
        className="p-2 rounded-full hover:bg-white/6 text-text-muted hover:text-text transition-colors"
        onClick={() => {
          if (ps.track) { blacklistTrack(ps.track); player.next() }
          else if (ps.station) { blacklistStation(ps.station) }
        }}
        aria-label="Never play again"
      >
        <DislikeIcon className="w-[18px] h-[18px]" />
      </button>
      <button
        className="p-2 rounded-full hover:bg-white/6 transition-colors"
        onClick={() => {
          if (ps.track) toggleTrackFavorite(ps.track)
          else if (ps.station) toggleStationFavorite(ps.station)
        }}
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <HeartIcon filled={fav} className="w-[18px] h-[18px]" />
      </button>
    </>
  )
}
