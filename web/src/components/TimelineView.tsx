import { useState } from 'react'
import { COMPOSERS, getClassicalTracks, type ClassicalCategory } from '../services/classical'
import { ARTISTS, getJazzTracks, type JazzCategory } from '../services/jazz'
import { player } from '../services/player'
import type { Track } from '../types'
import { TrackRow } from './TrackRow'
import { Spinner } from './ui/Spinner'

// ===== Shared types =====

type EraEntry = {
  label: string
  start: number
  end: number
  color: string
  artists: { id: string; name: string; image?: string; birth: number; death: number | null }[]
}

function parseYears(years?: string): { birth: number; death: number | null } {
  if (!years) return { birth: 0, death: null }
  const parts = years.split('–')
  return { birth: parseInt(parts[0]) || 0, death: parts[1] ? parseInt(parts[1]) || null : null }
}

function yearToPercent(year: number, min: number, max: number): number {
  const t = (year - min) / (max - min)
  return Math.pow(t, 1.8) * 100 // compress early, stretch recent
}

// ===== Classical Timeline =====

const CLASSICAL_ERAS: Omit<EraEntry, 'artists'>[] = [
  { label: 'Renaissance', start: 1550, end: 1610, color: 'bg-stone-600' },
  { label: 'Baroque', start: 1600, end: 1760, color: 'bg-amber-700' },
  { label: 'Classical', start: 1730, end: 1830, color: 'bg-yellow-600' },
  { label: 'Romantic', start: 1800, end: 1910, color: 'bg-rose-700' },
  { label: 'Impressionist', start: 1870, end: 1930, color: 'bg-sky-700' },
  { label: 'Modern', start: 1900, end: 1980, color: 'bg-violet-700' },
  { label: 'Contemporary', start: 1950, end: 2030, color: 'bg-indigo-700' },
]

function buildClassicalEras(): EraEntry[] {
  return CLASSICAL_ERAS.map(era => {
    const artists = COMPOSERS
      .map(c => ({ ...parseYears(c.years), id: c.id, name: c.label, image: c.image }))
      .filter(a => a.birth >= era.start - 30 && a.birth < era.end - 20)
      .sort((a, b) => a.birth - b.birth)
    return { ...era, artists }
  })
}

export function ClassicalTimeline() {
  return <GenreTimeline eras={buildClassicalEras()} min={1550} max={2030} genre="classical" yearMarkers={[1600, 1700, 1800, 1850, 1900, 1950, 2000]} />
}

// ===== Jazz Timeline =====

const JAZZ_ERAS: Omit<EraEntry, 'artists'>[] = [
  { label: 'Early Jazz & Ragtime', start: 1890, end: 1930, color: 'bg-amber-700' },
  { label: 'Swing Era', start: 1925, end: 1950, color: 'bg-orange-700' },
  { label: 'Bebop', start: 1940, end: 1960, color: 'bg-red-700' },
  { label: 'Cool Jazz / Hard Bop', start: 1950, end: 1970, color: 'bg-blue-700' },
  { label: 'Free Jazz', start: 1958, end: 1975, color: 'bg-purple-700' },
  { label: 'Fusion', start: 1968, end: 1990, color: 'bg-emerald-700' },
  { label: 'Modern / Neo', start: 1980, end: 2030, color: 'bg-teal-700' },
]

function buildJazzEras(): EraEntry[] {
  return JAZZ_ERAS.map(era => {
    const artists = ARTISTS
      .map(a => ({ ...parseYears(a.years), id: a.id, name: a.label, image: a.image }))
      .filter(a => a.birth >= era.start - 15 && a.birth < era.end - 10)
      .sort((a, b) => a.birth - b.birth)
    return { ...era, artists }
  })
}

export function JazzTimeline() {
  return <GenreTimeline eras={buildJazzEras()} min={1890} max={2030} genre="jazz" yearMarkers={[1900, 1920, 1940, 1960, 1980, 2000, 2020]} />
}

// ===== Shared Timeline Renderer =====

function GenreTimeline({ eras, min, max, genre, yearMarkers }: {
  eras: EraEntry[]; min: number; max: number; genre: 'classical' | 'jazz'; yearMarkers: number[]
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)

  const handleSelect = async (id: string) => {
    if (selected === id) { setSelected(null); setTracks([]); return }
    setSelected(id)
    setLoading(true)
    const cat = genre === 'classical'
      ? COMPOSERS.find(c => c.id === id)
      : ARTISTS.find(a => a.id === id)
    if (cat) {
      const t = genre === 'classical'
        ? await getClassicalTracks(cat as ClassicalCategory, 15)
        : await getJazzTracks(cat as JazzCategory, 15)
      setTracks(t)
      if (t.length > 0) player.playTrack(t[0], t, 0)
    }
    setLoading(false)
  }

  const ytp = (year: number) => yearToPercent(year, min, max)

  return (
    <div>
      {/* Year axis */}
      <div className="relative h-6 px-4 md:px-6 mb-1">
        {yearMarkers.map(year => (
          <div key={year} className="absolute text-[8px] text-text-dim -translate-x-1/2" style={{ left: `${ytp(year)}%` }}>{year}</div>
        ))}
      </div>

      {/* Timeline bar */}
      <div className="relative h-1 mx-4 md:mx-6 bg-white/6 rounded-full mb-4">
        {yearMarkers.map(year => (
          <div key={year} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${ytp(year)}%` }} />
        ))}
      </div>

      {/* Era bands with nested artists */}
      <div className="space-y-3 px-4 md:px-6">
        {eras.map(era => (
          <div key={era.label}>
            {/* Era header bar */}
            <div className="relative mb-2">
              <div
                className={`${era.color} rounded-lg px-3 py-1.5 flex items-center justify-between`}
                style={{
                  marginLeft: `${ytp(era.start)}%`,
                  width: `${Math.max(ytp(era.end) - ytp(era.start), 15)}%`,
                }}
              >
                <span className="text-[10px] font-bold text-white/90 whitespace-nowrap">{era.label}</span>
                <span className="text-[8px] text-white/50 whitespace-nowrap ml-2">{era.start}–{era.end}</span>
              </div>
            </div>

            {/* Artists — one per line, positioned at birth year */}
            {era.artists.map(a => (
              <div key={a.id} className="relative h-8 mb-0.5">
                <button
                  onClick={() => handleSelect(a.id)}
                  className={`absolute flex items-center gap-1.5 py-0.5 px-1 rounded-lg text-left transition-all ${
                    selected === a.id ? 'bg-accent/20 ring-1 ring-accent' : 'hover:bg-white/6'
                  }`}
                  style={{ left: `${Math.min(ytp(a.birth), 75)}%` }}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/15">
                    {a.image ? (
                      <img src={a.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] bg-surface">{a.name[0]}</div>
                    )}
                  </div>
                  <span className="text-[10px] font-medium whitespace-nowrap">{a.name}</span>
                  <span className="text-[8px] text-text-dim whitespace-nowrap">{a.birth}</span>
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Selected artist tracks */}
      {selected && (
        <div className="mt-4">
          <div className="flex items-center justify-between px-4 md:px-6 mb-2">
            <h2 className="text-sm font-bold">{eras.flatMap(e => e.artists).find(a => a.id === selected)?.name}</h2>
            {tracks.length > 0 && <button onClick={() => player.playTrack(tracks[0], tracks, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-6"><Spinner /></div>
          ) : tracks.length > 0 ? (
            tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)
          ) : (
            <p className="text-xs text-text-muted px-4 md:px-6 py-4">No tracks found</p>
          )}
        </div>
      )}
    </div>
  )
}
