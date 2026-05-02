import type { Track, RadioStation } from '../../types'
import { player } from '../../services/player'
import { PlayIcon } from '../ui/Icons'
import { Artwork } from '../ui/Artwork'

type TrackGridProps = {
  tracks: Track[]
  title: string
  showPlayAll?: boolean
}

export function TrackGrid({ tracks, title, showPlayAll }: TrackGridProps) {
  if (tracks.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between px-4 md:px-6 mb-3 mt-4">
        <h2 className="text-sm md:text-base font-bold">{title}</h2>
        {showPlayAll && (
          <button
            onClick={() => player.playTrack(tracks[0], tracks, 0)}
            className="text-[11px] md:text-xs text-accent font-semibold hover:underline"
          >
            Play All
          </button>
        )}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x md:hidden">
        {tracks.map((track, i) => (
          <TrackCard key={track.id} track={track} onClick={() => player.playTrack(track, tracks, i)} />
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-4 px-6">
        {tracks.slice(0, 10).map((track, i) => (
          <TrackCard key={track.id} track={track} onClick={() => player.playTrack(track, tracks, i)} desktop />
        ))}
      </div>
    </section>
  )
}

type StationGridProps = {
  stations: RadioStation[]
  title: string
}

export function StationGrid({ stations, title }: StationGridProps) {
  if (stations.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between px-4 md:px-6 mb-3 mt-4">
        <h2 className="text-sm md:text-base font-bold">{title}</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x md:hidden">
        {stations.map(s => (
          <StationCard key={s.id} station={s} onClick={() => player.playStation(s)} />
        ))}
      </div>

      <div className="hidden md:grid grid-cols-5 lg:grid-cols-6 gap-4 px-6">
        {stations.map(s => (
          <StationCard key={s.id} station={s} onClick={() => player.playStation(s)} desktop />
        ))}
      </div>
    </section>
  )
}

function TrackCard({ track, onClick, desktop }: { track: Track; onClick: () => void; desktop?: boolean }) {
  return (
    <button className={`${desktop ? 'w-full' : 'flex-shrink-0 w-32 snap-start'} text-left group`} onClick={onClick}>
      <div className={`${desktop ? 'w-full aspect-square' : 'w-32 h-32'} rounded-xl overflow-hidden bg-white/4 mb-2 ring-1 ring-white/6 relative`}>
        {track.artworkUrl ? (
          <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-transparent">
            <svg className="w-8 h-8 text-accent/40" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
          </div>
        )}
        {desktop && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg">
              <PlayIcon className="w-5 h-5 text-black ml-0.5" />
            </div>
          </div>
        )}
      </div>
      <div className={`${desktop ? 'text-[13px]' : 'text-[11px]'} font-semibold truncate`}>{track.title}</div>
      <div className={`${desktop ? 'text-xs' : 'text-[10px]'} text-muted truncate`}>{track.artist}</div>
    </button>
  )
}

function StationCard({ station, onClick, desktop }: { station: RadioStation; onClick: () => void; desktop?: boolean }) {
  return (
    <button className={`${desktop ? 'w-full' : 'flex-shrink-0 w-24 snap-start'} text-center group`} onClick={onClick}>
      <div className={`${desktop ? 'w-full aspect-square' : 'w-24 h-24'} rounded-xl overflow-hidden ring-1 ring-white/6 relative`}>
        <Artwork src={station.favicon} alt={station.name} size={999} type="station" rounded="rounded-none" />
        {desktop && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
              <PlayIcon className="w-4 h-4 text-black ml-0.5" />
            </div>
          </div>
        )}
      </div>
      <div className={`${desktop ? 'text-xs' : 'text-[10px]'} font-semibold truncate mt-1.5`}>{station.name}</div>
    </button>
  )
}
