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


const MIN_YEAR = 1550
const MAX_YEAR = 2030

// Non-linear scale: compress early centuries, expand recent decades
// t^2 means: 1550-1790 (half the range) gets only 25% of width
// while 1790-2030 gets 75%. More room for the crowded modern era.
function yearToPercent(year: number): number {
  const t = (year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)
  return Math.pow(t, 2) * 100
}

// Musical era definitions for horizontal bars
const ERA_BANDS: { label: string; start: number; end: number; color: string }[] = [
  { label: 'Renaissance', start: 1550, end: 1600, color: 'bg-stone-700/40' },
  { label: 'Baroque', start: 1600, end: 1750, color: 'bg-amber-800/40' },
  { label: 'Classical', start: 1730, end: 1820, color: 'bg-yellow-700/40' },
  { label: 'Romantic', start: 1800, end: 1910, color: 'bg-rose-800/40' },
  { label: 'Impressionist', start: 1875, end: 1925, color: 'bg-sky-800/40' },
  { label: 'Modern', start: 1900, end: 1975, color: 'bg-violet-800/40' },
  { label: 'Contemporary', start: 1950, end: 2030, color: 'bg-indigo-800/40' },
  { label: 'Early Jazz', start: 1895, end: 1930, color: 'bg-amber-600/30' },
  { label: 'Swing', start: 1925, end: 1945, color: 'bg-orange-700/30' },
  { label: 'Bebop', start: 1940, end: 1960, color: 'bg-red-800/30' },
  { label: 'Cool/Hard Bop', start: 1950, end: 1970, color: 'bg-blue-800/30' },
  { label: 'Free/Fusion', start: 1960, end: 1985, color: 'bg-purple-800/30' },
  { label: 'Modern Jazz', start: 1980, end: 2030, color: 'bg-teal-800/30' },
]

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
        <div className="px-4 md:px-6 overflow-x-auto">
          {/* Era bars — overlapping horizontal bands */}
          <div className="relative mb-2" style={{ minHeight: `${(filter === 'jazz' ? 6 : filter === 'classical' ? 7 : 13) * 18 + 8}px` }}>
            {ERA_BANDS
              .filter(era => {
                if (filter === 'classical') return !['Early Jazz','Swing','Bebop','Cool/Hard Bop','Free/Fusion','Modern Jazz'].includes(era.label)
                if (filter === 'jazz') return ['Early Jazz','Swing','Bebop','Cool/Hard Bop','Free/Fusion','Modern Jazz'].includes(era.label)
                return true
              })
              .map((era, i) => (
              <div
                key={era.label}
                className={`absolute h-4 rounded-full ${era.color} flex items-center overflow-hidden`}
                style={{
                  left: `${yearToPercent(era.start)}%`,
                  width: `${yearToPercent(era.end) - yearToPercent(era.start)}%`,
                  top: `${i * 18}px`,
                }}
              >
                <span className="text-[8px] font-medium text-white/70 px-2 whitespace-nowrap">{era.label}</span>
              </div>
            ))}
          </div>

          {/* Year axis */}
          <div className="relative h-6 mb-1">
            {[1600, 1700, 1800, 1850, 1900, 1920, 1940, 1960, 1980, 2000].map(year => (
              <div key={year} className="absolute text-[8px] text-text-dim -translate-x-1/2" style={{ left: `${yearToPercent(year)}%` }}>
                {year}
              </div>
            ))}
          </div>

          {/* Timeline bar */}
          <div className="relative bg-white/4 rounded-full h-1.5 mb-4">
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
