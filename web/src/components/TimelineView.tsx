import { useState } from 'react'
import { COMPOSERS, ERAS as CLASSICAL_ERA_CATS, getClassicalTracks, type ClassicalCategory } from '../services/classical'
import { ARTISTS, ERAS as JAZZ_ERA_CATS, getJazzTracks, type JazzCategory } from '../services/jazz'
import { player } from '../services/player'
import type { Track } from '../types'
import { TrackRow } from './TrackRow'
import { Spinner } from './ui/Spinner'

// ===== Shared types =====

type ArtistEntry = { id: string; name: string; image?: string; birth: number; death: number | null }

type EraEntry = {
  label: string
  start: number
  end: number
  color: string
  tag: string // Jamendo tag for playing era music
  artists: ArtistEntry[]
}

// Influence connections
const CLASSICAL_INFLUENCES: [string, string][] = [
  ['monteverdi', 'bach'], ['vivaldi', 'bach'], ['telemann', 'bach'],
  ['bach', 'mozart'], ['bach', 'beethoven'], ['handel', 'haydn'],
  ['haydn', 'mozart'], ['mozart', 'beethoven'], ['mozart', 'schubert'],
  ['beethoven', 'brahms'], ['beethoven', 'schubert'], ['beethoven', 'liszt'],
  ['schubert', 'schumann'], ['schumann', 'brahms'], ['chopin', 'liszt'],
  ['chopin', 'debussy'], ['chopin', 'rachmaninoff'],
  ['liszt', 'wagner'], ['liszt', 'debussy'],
  ['berlioz', 'wagner'], ['wagner', 'mahler'], ['wagner', 'strauss'],
  ['brahms', 'dvorak'], ['debussy', 'ravel'], ['debussy', 'satie'],
  ['debussy', 'stravinsky'], ['rimsky-korsakov', 'stravinsky'],
  ['rimsky-korsakov', 'prokofiev'], ['stravinsky', 'bartok'],
  ['stravinsky', 'shostakovich'], ['grieg', 'sibelius'],
  ['borodin', 'rimsky-korsakov'], ['copland', 'glass'],
]

const JAZZ_INFLUENCES: [string, string][] = [
  ['louis-armstrong', 'duke-ellington'], ['louis-armstrong', 'billie-holiday'],
  ['duke-ellington', 'charlie-parker'], ['duke-ellington', 'count-basie'],
  ['benny-goodman', 'charlie-parker'],
  ['charlie-parker', 'miles-davis'], ['charlie-parker', 'dizzy-gillespie'],
  ['charlie-parker', 'john-coltrane'], ['charlie-parker', 'ornette-coleman'],
  ['thelonious-monk', 'john-coltrane'], ['thelonious-monk', 'miles-davis'],
  ['miles-davis', 'john-coltrane'], ['miles-davis', 'herbie-hancock'],
  ['miles-davis', 'wayne-shorter'], ['miles-davis', 'keith-jarrett'],
  ['john-coltrane', 'pharoah-sanders'], ['john-coltrane', 'mccoy-tyner'],
  ['dizzy-gillespie', 'charlie-parker'],
  ['ella-fitzgerald', 'sarah-vaughan'],
  ['bill-evans', 'keith-jarrett'], ['bill-evans', 'herbie-hancock'],
  ['art-blakey', 'wayne-shorter'], ['ornette-coleman', 'pharoah-sanders'],
  ['django-reinhardt', 'wes-montgomery'], ['wes-montgomery', 'pat-metheny'],
  ['herbie-hancock', 'chick-corea'], ['charles-mingus', 'ornette-coleman'],
]

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
  { label: 'Renaissance', start: 1550, end: 1610, color: 'bg-stone-600', tag: 'renaissance' },
  { label: 'Baroque', start: 1600, end: 1760, color: 'bg-amber-700', tag: 'baroque' },
  { label: 'Classical', start: 1730, end: 1830, color: 'bg-yellow-600', tag: 'classical' },
  { label: 'Romantic', start: 1800, end: 1910, color: 'bg-rose-700', tag: 'romantic+classical' },
  { label: 'Impressionist', start: 1870, end: 1930, color: 'bg-sky-700', tag: 'impressionist' },
  { label: 'Modern', start: 1900, end: 1980, color: 'bg-violet-700', tag: 'contemporary+classical' },
  { label: 'Contemporary', start: 1950, end: 2030, color: 'bg-indigo-700', tag: 'contemporary+classical' },
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
  return <GenreTimeline eras={buildClassicalEras()} min={1550} max={2030} genre="classical" yearMarkers={[1600, 1700, 1800, 1850, 1900, 1950, 2000]} influences={CLASSICAL_INFLUENCES} />
}

// ===== Jazz Timeline =====

const JAZZ_ERAS: Omit<EraEntry, 'artists'>[] = [
  { label: 'Early Jazz & Ragtime', start: 1890, end: 1930, color: 'bg-amber-700', tag: 'dixieland' },
  { label: 'Swing Era', start: 1925, end: 1950, color: 'bg-orange-700', tag: 'swing' },
  { label: 'Bebop', start: 1940, end: 1960, color: 'bg-red-700', tag: 'bebop' },
  { label: 'Cool Jazz / Hard Bop', start: 1950, end: 1970, color: 'bg-blue-700', tag: 'cool+jazz' },
  { label: 'Free Jazz', start: 1958, end: 1975, color: 'bg-purple-700', tag: 'free+jazz' },
  { label: 'Fusion', start: 1968, end: 1990, color: 'bg-emerald-700', tag: 'fusion' },
  { label: 'Modern / Neo', start: 1980, end: 2030, color: 'bg-teal-700', tag: 'contemporary+jazz' },
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
  return <GenreTimeline eras={buildJazzEras()} min={1890} max={2030} genre="jazz" yearMarkers={[1900, 1920, 1940, 1960, 1980, 2000, 2020]} influences={JAZZ_INFLUENCES} />
}

// ===== Shared Timeline Renderer =====

function GenreTimeline({ eras, min, max, genre, yearMarkers, influences }: {
  eras: EraEntry[]; min: number; max: number; genre: 'classical' | 'jazz'; yearMarkers: number[]; influences: [string, string][]
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedLabel, setSelectedLabel] = useState('')
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'timeline' | 'influences'>('timeline')

  const handleSelectArtist = async (id: string, name: string) => {
    if (selected === id) { setSelected(null); setTracks([]); return }
    setSelected(id)
    setSelectedLabel(name)
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

  const handleSelectEra = async (era: EraEntry) => {
    setSelected('era-' + era.label)
    setSelectedLabel(era.label)
    setLoading(true)
    const eraCats = genre === 'classical' ? CLASSICAL_ERA_CATS : JAZZ_ERA_CATS
    const cat = eraCats.find(c => c.label.toLowerCase().includes(era.label.split(' ')[0].toLowerCase()))
    if (cat) {
      const t = genre === 'classical'
        ? await getClassicalTracks(cat as ClassicalCategory, 20)
        : await getJazzTracks(cat as JazzCategory, 20)
      setTracks(t)
      if (t.length > 0) player.playTrack(t[0], t, 0)
    }
    setLoading(false)
  }

  const ytp = (year: number) => yearToPercent(year, min, max)
  const allArtists = eras.flatMap(e => e.artists)

  return (
    <div>
      {/* View toggle */}
      <div className="flex gap-1 px-4 md:px-6 mb-4">
        <button onClick={() => setView('timeline')} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${view === 'timeline' ? 'bg-accent text-base' : 'bg-white/4 text-text-muted'}`}>Timeline</button>
        <button onClick={() => setView('influences')} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${view === 'influences' ? 'bg-accent text-base' : 'bg-white/4 text-text-muted'}`}>Influences</button>
      </div>

      {view === 'timeline' ? (
        <>
          {/* Year axis */}
          <div className="relative h-6 px-4 md:px-6 mb-1">
            {yearMarkers.map(year => (
              <div key={year} className="absolute text-[8px] text-text-dim -translate-x-1/2" style={{ left: `${ytp(year)}%` }}>{year}</div>
            ))}
          </div>
          <div className="relative h-1 mx-4 md:mx-6 bg-white/6 rounded-full mb-4">
            {yearMarkers.map(year => (
              <div key={year} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${ytp(year)}%` }} />
            ))}
          </div>

          {/* Era bands with artists */}
          <div className="space-y-2 px-4 md:px-6">
            {eras.map(era => (
              <div key={era.label}>
                <button
                  onClick={() => handleSelectEra(era)}
                  className={`relative mb-1 w-full text-left group ${selected === 'era-' + era.label ? 'ring-1 ring-accent rounded-lg' : ''}`}
                >
                  <div
                    className={`${era.color} rounded-lg px-3 py-1.5 flex items-center justify-between hover:brightness-125 transition-all`}
                    style={{ marginLeft: `${ytp(era.start)}%`, width: `${Math.max(ytp(era.end) - ytp(era.start), 15)}%` }}
                  >
                    <span className="text-[10px] font-bold text-white/90 whitespace-nowrap">{era.label}</span>
                    <span className="text-[8px] text-white/50 whitespace-nowrap ml-2">&#9654; {era.start}–{era.end}</span>
                  </div>
                </button>
                {era.artists.map(a => (
                  <div key={a.id} className="relative h-7">
                    <button
                      onClick={() => handleSelectArtist(a.id, a.name)}
                      className={`absolute flex items-center gap-1.5 py-0.5 px-1 rounded-lg transition-all ${selected === a.id ? 'bg-accent/20 ring-1 ring-accent' : 'hover:bg-white/6'}`}
                      style={{ left: `${Math.min(ytp(a.birth), 75)}%` }}
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/15">
                        {a.image ? <img src={a.image} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-[7px] bg-surface">{a.name[0]}</div>}
                      </div>
                      <span className="text-[9px] font-medium whitespace-nowrap">{a.name}</span>
                      <span className="text-[7px] text-text-dim">{a.birth}</span>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ===== INFLUENCE GRAPH ===== */
        <div className="px-4 md:px-6">
          <p className="text-xs text-text-muted mb-4">Tap an artist to see connections. Lines show who influenced whom.</p>

          {/* SVG graph */}
          <div className="relative bg-surface/50 rounded-xl p-4 mb-4 overflow-x-auto">
            <svg width="100%" viewBox="0 0 800 400" className="min-w-[600px]">
              {/* Draw influence lines */}
              {influences.map(([fromId, toId], i) => {
                const from = allArtists.find(a => a.id === fromId)
                const to = allArtists.find(a => a.id === toId)
                if (!from || !to) return null
                const fromIdx = allArtists.indexOf(from)
                const toIdx = allArtists.indexOf(to)
                const x1 = (from.birth - min) / (max - min) * 700 + 50
                const y1 = fromIdx * (380 / Math.max(allArtists.length - 1, 1)) + 10
                const x2 = (to.birth - min) / (max - min) * 700 + 50
                const y2 = toIdx * (380 / Math.max(allArtists.length - 1, 1)) + 10
                const isHighlighted = selected === fromId || selected === toId
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isHighlighted ? '#6ECE9E' : '#ffffff15'}
                    strokeWidth={isHighlighted ? 2 : 1}
                  />
                )
              })}
              {/* Draw artist dots */}
              {allArtists.map((a, i) => {
                const x = (a.birth - min) / (max - min) * 700 + 50
                const y = i * (380 / Math.max(allArtists.length - 1, 1)) + 10
                const isSelected = selected === a.id
                const hasConnection = influences.some(([f, t]) => (f === a.id || t === a.id) && (f === selected || t === selected))
                return (
                  <g key={a.id} onClick={() => handleSelectArtist(a.id, a.name)} className="cursor-pointer">
                    <circle cx={x} cy={y} r={isSelected ? 8 : hasConnection ? 6 : 4}
                      fill={isSelected ? '#6ECE9E' : hasConnection ? '#6ECE9E80' : '#ffffff30'}
                    />
                    <text x={x + 12} y={y + 4} fill={isSelected ? '#f0f0f2' : '#9090a0'} fontSize={isSelected ? 11 : 9} fontWeight={isSelected ? 700 : 400}>
                      {a.name}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Selected artist influence details */}
          {selected && !selected.startsWith('era-') && (() => {
            const influencedBy = influences.filter(([, to]) => to === selected).map(([from]) => allArtists.find(a => a.id === from)).filter(Boolean) as ArtistEntry[]
            const influenced = influences.filter(([from]) => from === selected).map(([, to]) => allArtists.find(a => a.id === to)).filter(Boolean) as ArtistEntry[]
            return (
              <div className="bg-surface border border-border rounded-xl p-4 mb-4">
                <div className="font-semibold mb-2">{selectedLabel}</div>
                {influencedBy.length > 0 && (
                  <div className="mb-2">
                    <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Influenced by</div>
                    <div className="flex flex-wrap gap-1.5">
                      {influencedBy.map(a => (
                        <button key={a.id} onClick={() => handleSelectArtist(a.id, a.name)} className="flex items-center gap-1 px-2 py-1 rounded bg-white/4 text-xs hover:bg-white/8">
                          {a.image && <img src={a.image} alt="" className="w-4 h-4 rounded-full object-cover" />}
                          {a.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {influenced.length > 0 && (
                  <div>
                    <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Influenced</div>
                    <div className="flex flex-wrap gap-1.5">
                      {influenced.map(a => (
                        <button key={a.id} onClick={() => handleSelectArtist(a.id, a.name)} className="flex items-center gap-1 px-2 py-1 rounded bg-white/4 text-xs hover:bg-white/8">
                          {a.image && <img src={a.image} alt="" className="w-4 h-4 rounded-full object-cover" />}
                          {a.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* Selected tracks */}
      {selected && tracks.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between px-4 md:px-6 mb-2">
            <h2 className="text-sm font-bold">{selectedLabel}</h2>
            <button onClick={() => player.playTrack(tracks[0], tracks, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-6"><Spinner /></div>
          ) : (
            tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)
          )}
        </div>
      )}
      {selected && loading && (
        <div className="flex items-center justify-center py-6"><Spinner /></div>
      )}
    </div>
  )
}
