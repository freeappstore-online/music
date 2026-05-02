import type { Track, RadioStation } from '../../types'
import { player } from '../../services/player'
import { Artwork } from '../ui/Artwork'

export function TrackGrid({ tracks, title, showPlayAll }: { tracks: Track[]; title: string; showPlayAll?: boolean }) {
  if (tracks.length === 0) return null
  return (
    <section>
      <div className="flex items-center justify-between px-4 md:px-6 mb-3 mt-6">
        <h2 className="text-base font-bold">{title}</h2>
        {showPlayAll && (
          <button onClick={() => player.playTrack(tracks[0], tracks, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>
        )}
      </div>
      {/* Mobile: scroll. Desktop: wrap grid */}
      <div className="flex gap-3 overflow-x-auto px-4 md:px-6 pb-3 snap-x md:grid md:grid-cols-4 lg:grid-cols-5 md:overflow-visible">
        {tracks.map((track, i) => (
          <button
            key={track.id}
            className="flex-shrink-0 w-36 md:w-auto snap-start text-left group"
            onClick={() => player.playTrack(track, tracks, i)}
          >
            <div className="w-36 h-36 md:w-full md:aspect-square rounded-xl overflow-hidden bg-white/4 mb-2 ring-1 ring-white/6 relative">
              {track.artworkUrl ? (
                <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-transparent">
                  <svg className="w-8 h-8 text-accent/40" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold truncate">{track.title}</div>
            <div className="text-[11px] text-muted truncate">{track.artist}</div>
          </button>
        ))}
      </div>
    </section>
  )
}

export function StationGrid({ stations, title }: { stations: RadioStation[]; title: string }) {
  if (stations.length === 0) return null
  return (
    <section>
      <div className="flex items-center justify-between px-4 md:px-6 mb-3 mt-6">
        <h2 className="text-base font-bold">{title}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 md:px-6 pb-3 snap-x md:grid md:grid-cols-5 lg:grid-cols-6 md:overflow-visible">
        {stations.map(s => (
          <button key={s.id} className="flex-shrink-0 w-28 md:w-auto snap-start text-center group" onClick={() => player.playStation(s)}>
            <div className="w-28 h-28 md:w-full md:aspect-square rounded-xl overflow-hidden ring-1 ring-white/6 relative">
              <Artwork src={s.favicon} alt={s.name} size={999} type="station" rounded="rounded-none" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                </div>
              </div>
            </div>
            <div className="text-[11px] font-semibold truncate mt-1.5">{s.name}</div>
          </button>
        ))}
      </div>
    </section>
  )
}
