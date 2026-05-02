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
  if (station.id.startsWith('soma-')) return true
  const tags = getUserTags(station.id)
  return tags.some(t => /ad.?free|no.?ads/i.test(t))
}

export function StationRow({ station, onBlacklist }: { station: RadioStation; onBlacklist?: () => void }) {
  const ps = usePlayer()
  const [fav, setFav] = useState(() => isStationFavorite(station.id))
  const [blocked, setBlocked] = useState(() => isStationBlacklisted(station.id))
  const [expanded, setExpanded] = useState(false)
  const playing = ps.station?.id === station.id && ps.isPlaying
  const adFree = isAdFree(station)

  if (blocked) return null

  const allTags = station.tags?.split(',').map(t => t.trim()).filter(t => t.length > 0 && t.length < 25) || []

  return (
    <div>
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
          <div className="text-[11px] text-text-muted mt-0.5">
            {station.country || ''}{station.bitrate ? ` · ${station.bitrate}kbps ${station.codec || ''}` : ''}{station.votes ? ` · ${formatVotes(station.votes)} votes` : ''}
          </div>
          {allTags.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-1">
              {allTags.slice(0, 6).map(t => (
                <span key={t} className="text-[8px] px-1.5 py-0.5 rounded bg-white/4 text-text-dim">{t}</span>
              ))}
              {allTags.length > 6 && <span className="text-[8px] text-text-dim">+{allTags.length - 6}</span>}
            </div>
          )}
        </div>

        {playing && <PlayingBars />}

        {/* Info toggle */}
        <button className="p-1.5 flex-shrink-0 rounded-full hover:bg-white/6 opacity-0 group-hover:opacity-60 transition-opacity"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }} aria-label="Station info">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>

        <button className="p-1.5 flex-shrink-0 rounded-full hover:bg-white/6 opacity-0 group-hover:opacity-60 transition-opacity"
          onClick={(e) => { e.stopPropagation(); blacklistStation(station); setBlocked(true); setFav(false); onBlacklist?.() }} aria-label="Block">
          <ThumbDownIcon className="w-4 h-4" />
        </button>

        <button className="p-1.5 flex-shrink-0 rounded-full hover:bg-white/6 opacity-60 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); setFav(toggleStationFavorite(station)) }} aria-label={fav ? 'Unfavorite' : 'Favorite'}>
          <HeartIcon filled={fav} className="w-[18px] h-[18px]" />
        </button>
      </button>

      {/* Expanded info panel */}
      {expanded && (
        <div className="px-4 md:px-6 pb-3 ml-14">
          <div className="bg-surface border border-border rounded-xl p-3 space-y-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              {station.country && <Detail label="Country" value={station.country} />}
              {station.state && <Detail label="State" value={station.state} />}
              {station.language && <Detail label="Language" value={station.language} />}
              {station.codec && <Detail label="Codec" value={station.codec} />}
              {station.bitrate && <Detail label="Bitrate" value={`${station.bitrate} kbps`} />}
              {station.clickcount && <Detail label="Listeners" value={formatVotes(station.clickcount)} />}
              {station.votes && <Detail label="Votes" value={formatVotes(station.votes)} />}
            </div>

            {/* All tags */}
            {allTags.length > 1 && (
              <div>
                <div className="text-[10px] text-text-dim mb-1">Tags</div>
                <div className="flex gap-1 flex-wrap">
                  {allTags.slice(0, 15).map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/4 text-text-muted">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Homepage link */}
            {station.homepage && (
              <a href={station.homepage} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Station website
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-text-dim">{label}: </span>
      <span className="text-text">{value}</span>
    </div>
  )
}
