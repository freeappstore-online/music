import { useState } from 'react'
import { COMPOSERS } from '../services/classical'
import { ARTISTS } from '../services/jazz'
import { getClassicalTracks } from '../services/classical'
import { getJazzTracks } from '../services/jazz'
import { player } from '../services/player'
import type { Track } from '../types'
import { Spinner } from './ui/Spinner'
import { TrackRow } from './TrackRow'

// Timeline data with birth years for positioning
type TimelineEntry = {
  id: string
  name: string
  image?: string
  birthYear: number
  deathYear: number | null
  genre: 'classical' | 'jazz'
  era: string
  influences?: string[] // IDs of who they influenced
}

function parseYear(years?: string): { birth: number; death: number | null } {
  if (!years) return { birth: 0, death: null }
  const parts = years.split('–')
  return {
    birth: parseInt(parts[0]) || 0,
    death: parts[1] && parts[1] !== '' ? parseInt(parts[1]) || null : null,
  }
}

// Build timeline entries from existing data
const TIMELINE: TimelineEntry[] = [
  // Classical
  ...COMPOSERS.map(c => {
    const { birth, death } = parseYear(c.years)
    return {
      id: c.id, name: c.label, image: c.image, birthYear: birth, deathYear: death,
      genre: 'classical' as const,
      era: birth < 1600 ? 'Renaissance' : birth < 1750 ? 'Baroque' : birth < 1820 ? 'Classical' : birth < 1900 ? 'Romantic' : 'Modern',
    }
  }),
  // Jazz
  ...ARTISTS.map(a => {
    const { birth, death } = parseYear(a.years)
    return {
      id: a.id, name: a.label, image: a.image, birthYear: birth, deathYear: death,
      genre: 'jazz' as const,
      era: birth < 1910 ? 'Early Jazz' : birth < 1920 ? 'Swing Era' : birth < 1935 ? 'Bebop' : birth < 1945 ? 'Hard Bop' : 'Modern',
    }
  }),
].filter(e => e.birthYear > 0).sort((a, b) => a.birthYear - b.birthYear)

// Influence connections (who influenced whom)
const INFLUENCES: [string, string][] = [
  // Classical lineage
  ['monteverdi', 'bach'], ['bach', 'mozart'], ['bach', 'beethoven'],
  ['mozart', 'beethoven'], ['beethoven', 'brahms'], ['beethoven', 'schubert'],
  ['beethoven', 'liszt'], ['liszt', 'wagner'], ['liszt', 'debussy'],
  ['chopin', 'liszt'], ['chopin', 'debussy'], ['chopin', 'rachmaninoff'],
  ['wagner', 'mahler'], ['wagner', 'strauss'], ['brahms', 'dvorak'],
  ['debussy', 'ravel'], ['debussy', 'satie'], ['debussy', 'stravinsky'],
  ['rimsky-korsakov', 'stravinsky'], ['rimsky-korsakov', 'prokofiev'],
  ['stravinsky', 'bartok'], ['stravinsky', 'shostakovich'],
  ['bach', 'handel'], ['handel', 'haydn'], ['haydn', 'mozart'],
  ['mozart', 'schubert'], ['schubert', 'schumann'], ['schumann', 'brahms'],
  ['berlioz', 'wagner'], ['vivaldi', 'bach'], ['telemann', 'bach'],
  ['grieg', 'sibelius'], ['borodin', 'rimsky-korsakov'],
  ['copland', 'glass'],
  // Jazz lineage
  ['louis-armstrong', 'duke-ellington'], ['louis-armstrong', 'billie-holiday'],
  ['duke-ellington', 'charlie-parker'], ['charlie-parker', 'miles-davis'],
  ['charlie-parker', 'dizzy-gillespie'], ['charlie-parker', 'john-coltrane'],
  ['miles-davis', 'john-coltrane'], ['miles-davis', 'herbie-hancock'],
  ['miles-davis', 'wayne-shorter'], ['miles-davis', 'keith-jarrett'],
  ['john-coltrane', 'pharoah-sanders'], ['john-coltrane', 'mccoy-tyner'],
  ['thelonious-monk', 'john-coltrane'], ['thelonious-monk', 'miles-davis'],
  ['dizzy-gillespie', 'charlie-parker'], ['art-blakey', 'wayne-shorter'],
  ['duke-ellington', 'count-basie'], ['ella-fitzgerald', 'sarah-vaughan'],
  ['charlie-parker', 'ornette-coleman'], ['ornette-coleman', 'pharoah-sanders'],
  ['bill-evans', 'keith-jarrett'], ['bill-evans', 'herbie-hancock'],
  ['benny-goodman', 'charlie-parker'], ['django-reinhardt', 'wes-montgomery'],
  ['wes-montgomery', 'pat-metheny'], ['herbie-hancock', 'chick-corea'],
  ['charles-mingus', 'ornette-coleman'],
  // Cross-genre
  ['debussy', 'duke-ellington'], ['stravinsky', 'charlie-parker'],
]

const ERA_COLORS: Record<string, string> = {
  'Renaissance': 'bg-stone-600', 'Baroque': 'bg-amber-700', 'Classical': 'bg-yellow-600',
  'Romantic': 'bg-rose-600', 'Modern': 'bg-violet-600',
  'Early Jazz': 'bg-amber-600', 'Swing Era': 'bg-orange-600', 'Bebop': 'bg-red-600',
  'Hard Bop': 'bg-blue-600',
}

const MIN_YEAR = 1550
const MAX_YEAR = 2030

// Non-linear scale: earlier centuries compressed, recent decades expanded
// This gives ~15% to 1550-1750 (Baroque), ~20% to 1750-1850, ~30% to 1850-1950, ~35% to 1950-2030
function yearToPercent(year: number): number {
  const t = (year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR) // 0..1 linear
  // Power curve: raise to 0.6 to compress early years, expand recent
  return Math.pow(t, 0.55) * 100
}

type Filter = 'all' | 'classical' | 'jazz'

export function TimelineView() {
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<TimelineEntry | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'timeline' | 'influences'>('timeline')

  const filtered = TIMELINE.filter(e => filter === 'all' || e.genre === filter)

  const handleSelect = async (entry: TimelineEntry) => {
    if (selected?.id === entry.id) { setSelected(null); setTracks([]); return }
    setSelected(entry)
    setLoading(true)
    const cat = entry.genre === 'classical'
      ? COMPOSERS.find(c => c.id === entry.id)
      : ARTISTS.find(a => a.id === entry.id)
    if (cat) {
      const t = entry.genre === 'classical'
        ? await getClassicalTracks(cat as any, 10)
        : await getJazzTracks(cat as any, 10)
      setTracks(t)
      if (t.length > 0) player.playTrack(t[0], t, 0)
    }
    setLoading(false)
  }


  return (
    <div className="pb-4">
      {/* Controls */}
      <div className="flex items-center gap-2 px-4 md:px-6 mb-4">
        <div className="flex gap-1">
          <button onClick={() => setView('timeline')} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${view === 'timeline' ? 'bg-accent text-base' : 'bg-white/4 text-text-muted'}`}>Timeline</button>
          <button onClick={() => setView('influences')} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${view === 'influences' ? 'bg-accent text-base' : 'bg-white/4 text-text-muted'}`}>Influences</button>
        </div>
        <div className="flex gap-1 ml-auto">
          {(['all', 'classical', 'jazz'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`text-xs px-2.5 py-1 rounded-lg ${filter === f ? 'bg-white/10 text-text' : 'text-text-muted'}`}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {view === 'timeline' ? (
        /* ===== TIMELINE VIEW ===== */
        <div className="px-4 md:px-6">
          {/* Year axis */}
          <div className="relative h-8 mb-2">
            {[1600, 1700, 1800, 1850, 1900, 1920, 1940, 1960, 1980, 2000].map(year => (
              <div key={year} className="absolute text-[9px] text-text-dim -translate-x-1/2" style={{ left: `${yearToPercent(year)}%` }}>
                {year}
              </div>
            ))}
          </div>

          {/* Timeline bar */}
          <div className="relative bg-white/4 rounded-full h-2 mb-6">
            {[1600, 1700, 1800, 1850, 1900, 1920, 1940, 1960, 1980, 2000].map(year => (
              <div key={year} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${yearToPercent(year)}%` }} />
            ))}
          </div>

          {/* Entries */}
          <div className="relative" style={{ minHeight: `${Math.ceil(filtered.length / 2) * 56}px` }}>
            {filtered.map((entry, i) => {
              const left = yearToPercent(entry.birthYear)
              const row = i % 2
              return (
                <button
                  key={entry.id}
                  onClick={() => handleSelect(entry)}
                  className={`absolute flex items-center gap-1.5 transition-all ${selected?.id === entry.id ? 'z-10 scale-110' : 'hover:scale-105'}`}
                  style={{
                    left: `${Math.min(left, 85)}%`,
                    top: `${Math.floor(i / 2) * 56 + row * 28}px`,
                  }}
                  title={`${entry.name} (${entry.birthYear}–${entry.deathYear || 'present'})`}
                >
                  <div className={`w-8 h-8 rounded-full overflow-hidden ring-2 flex-shrink-0 ${selected?.id === entry.id ? 'ring-accent' : entry.genre === 'classical' ? 'ring-amber-500/50' : 'ring-blue-500/50'}`}>
                    {entry.image ? (
                      <img src={entry.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-xs ${entry.genre === 'classical' ? 'bg-amber-900' : 'bg-blue-900'}`}>
                        {entry.name[0]}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-medium whitespace-nowrap">{entry.name}</span>
                </button>
              )
            })}
          </div>

          {/* Era legend */}
          <div className="flex gap-2 flex-wrap mt-6">
            {Object.entries(ERA_COLORS).map(([era, color]) => (
              <span key={era} className="flex items-center gap-1 text-[9px] text-text-dim">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                {era}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* ===== INFLUENCE GRAPH ===== */
        <div className="px-4 md:px-6">
          <p className="text-xs text-text-muted mb-4">Tap an artist to see who they influenced and who influenced them.</p>

          {/* Artist chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filtered.map(entry => {
              const isInfluencer = INFLUENCES.some(([from]) => from === entry.id)
              const isInfluenced = INFLUENCES.some(([, to]) => to === entry.id)
              if (!isInfluencer && !isInfluenced) return null
              return (
                <button
                  key={entry.id}
                  onClick={() => handleSelect(entry)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${
                    selected?.id === entry.id ? 'bg-accent/20 ring-1 ring-accent' : 'bg-surface hover:bg-surface-hover'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                    {entry.image ? (
                      <img src={entry.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-[8px] ${entry.genre === 'classical' ? 'bg-amber-900' : 'bg-blue-900'}`}>{entry.name[0]}</div>
                    )}
                  </div>
                  {entry.name}
                </button>
              )
            })}
          </div>

          {/* Influence details for selected */}
          {selected && (
            <div className="bg-surface border border-border rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-accent">
                  {selected.image ? (
                    <img src={selected.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg bg-surface">{selected.name[0]}</div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{selected.name}</div>
                  <div className="text-xs text-text-muted">{selected.birthYear}–{selected.deathYear || 'present'} · {selected.era}</div>
                </div>
              </div>

              {/* Influenced by */}
              {(() => {
                const influencedBy = INFLUENCES.filter(([, to]) => to === selected.id).map(([from]) => TIMELINE.find(e => e.id === from)).filter(Boolean)
                if (influencedBy.length === 0) return null
                return (
                  <div className="mb-3">
                    <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1.5">Influenced by</div>
                    <div className="flex flex-wrap gap-1.5">
                      {influencedBy.map(e => e && (
                        <button key={e.id} onClick={() => handleSelect(e)} className="flex items-center gap-1 px-2 py-1 rounded bg-white/4 text-xs hover:bg-white/6">
                          {e.image && <img src={e.image} alt="" className="w-4 h-4 rounded-full object-cover" />}
                          {e.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Influenced */}
              {(() => {
                const influenced = INFLUENCES.filter(([from]) => from === selected.id).map(([, to]) => TIMELINE.find(e => e.id === to)).filter(Boolean)
                if (influenced.length === 0) return null
                return (
                  <div>
                    <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1.5">Influenced</div>
                    <div className="flex flex-wrap gap-1.5">
                      {influenced.map(e => e && (
                        <button key={e.id} onClick={() => handleSelect(e)} className="flex items-center gap-1 px-2 py-1 rounded bg-white/4 text-xs hover:bg-white/6">
                          {e.image && <img src={e.image} alt="" className="w-4 h-4 rounded-full object-cover" />}
                          {e.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}

      {/* Selected artist tracks */}
      {selected && (
        <div className="mt-2">
          <div className="flex items-center justify-between px-4 md:px-6 mb-2">
            <h2 className="text-sm font-bold">{selected.name}</h2>
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
