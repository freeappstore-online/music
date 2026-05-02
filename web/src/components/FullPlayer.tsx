import { useState } from 'react'
import { player } from '../services/player'
import { usePlayer } from '../hooks'
import { formatTime } from '../lib/format'
import { isTrackFavorite, isStationFavorite, toggleTrackFavorite, toggleStationFavorite, blacklistTrack, blacklistStation } from '../services/favorites'
import { Artwork } from './ui/Artwork'
import { HeartIcon, ThumbDownIcon } from './ui/Icons'

export function FullPlayer({ onClose }: { onClose: () => void }) {
  const ps = usePlayer()
  const [fav, setFav] = useState(() =>
    ps.track ? isTrackFavorite(ps.track.id) : ps.station ? isStationFavorite(ps.station.id) : false
  )

  const title = ps.track?.title ?? ps.station?.name ?? ''
  const subtitle = ps.track?.artist ?? ''
  const artwork = ps.track?.artworkUrl ?? ps.station?.favicon
  const progress = ps.duration > 0 ? ps.currentTime / ps.duration : 0
  const source = ps.track?.source === 'jamendo' ? 'Jamendo' : ps.track?.source === 'internetarchive' ? 'Internet Archive' : ''

  return (
    <div className="fixed inset-0 z-50 bg-base flex flex-col items-center animate-[slideUp_0.3s_ease-out]">
      <div className="w-full max-w-lg flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button onClick={onClose} className="p-2 -ml-2" aria-label="Close player">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {source && <span className="text-xs text-text-muted">{source}</span>}
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
          {/* Artwork */}
          <Artwork
            src={artwork}
            alt={title}
            size={280}
            rounded="rounded-2xl"
            type={ps.station ? 'station' : 'track'}
          />

          {/* Info */}
          <div className="text-center w-full">
            <div className="text-xl font-bold truncate">{title}</div>
            {subtitle && <div className="text-text-muted mt-1 truncate">{subtitle}</div>}
          </div>

          {/* Progress */}
          {ps.track && ps.duration > 0 && (
            <div className="w-full">
              <input type="range" min={0} max={1} step={0.001} value={progress} onChange={(e) => player.seek(parseFloat(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>{formatTime(ps.currentTime)}</span>
                <span>-{formatTime(ps.duration - ps.currentTime)}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-10">
            {ps.track && (
              <button onClick={() => player.previous()} className="p-2" aria-label="Previous">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
              </button>
            )}
            <button onClick={() => player.togglePlayPause()} className="p-2" aria-label={ps.isPlaying ? 'Pause' : 'Play'}>
              {ps.isPlaying ? (
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              )}
            </button>
            {ps.track && (
              <button onClick={() => player.next()} className="p-2" aria-label="Next">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" /></svg>
              </button>
            )}
          </div>

          {/* Like / Dislike */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                if (ps.track) { blacklistTrack(ps.track); player.next() }
                else if (ps.station) { blacklistStation(ps.station); onClose() }
              }}
              aria-label="Never play again"
              className="p-3 rounded-full hover:bg-red-500/10 active:bg-red-500/20 transition-colors"
            >
              <ThumbDownIcon className="w-7 h-7" />
            </button>
            <button
              onClick={() => {
                if (ps.track) setFav(toggleTrackFavorite(ps.track))
                else if (ps.station) setFav(toggleStationFavorite(ps.station))
              }}
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
              className="p-3 rounded-full hover:bg-accent/10 active:bg-accent/20 transition-colors"
            >
              <HeartIcon filled={fav} className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  )
}
