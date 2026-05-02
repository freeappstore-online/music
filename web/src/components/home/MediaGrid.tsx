import type { Track, RadioStation } from '../../types'
import { player } from '../../services/player'
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
      <div className="flex items-center justify-between px-4 mb-3 mt-4">
        <h2 className="text-sm font-bold">{title}</h2>
        {showPlayAll && (
          <button
            onClick={() => player.playTrack(tracks[0], tracks, 0)}
            className="text-[11px] text-accent font-semibold hover:underline"
          >
            Play All
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x">
        {tracks.map((track, i) => (
          <button
            key={track.id}
            className="flex-shrink-0 w-32 snap-start text-left"
            onClick={() => player.playTrack(track, tracks, i)}
          >
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-white/4 mb-2 ring-1 ring-white/6">
              {track.artworkUrl ? (
                <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-transparent">
                  <svg className="w-8 h-8 text-accent/40" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
                </div>
              )}
            </div>
            <div className="text-[11px] font-semibold truncate">{track.title}</div>
            <div className="text-[10px] text-muted truncate">{track.artist}</div>
          </button>
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
      <div className="flex items-center justify-between px-4 mb-3 mt-4">
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x">
        {stations.map(s => (
          <button
            key={s.id}
            className="flex-shrink-0 w-24 snap-start text-center"
            onClick={() => player.playStation(s)}
          >
            <div className="w-24 h-24 rounded-xl overflow-hidden ring-1 ring-white/6">
              <Artwork src={s.favicon} alt={s.name} size={96} type="station" rounded="rounded-none" />
            </div>
            <div className="text-[10px] font-semibold truncate mt-1.5">{s.name}</div>
          </button>
        ))}
      </div>
    </section>
  )
}
