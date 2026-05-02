import { useState, useEffect, useRef } from 'react'
import { advancedSearch, type TrackFilters } from '../services/jamendo'
import { searchTracks as searchArchive } from '../services/archive'
import { searchStations } from '../services/radio'
import { player } from '../services/player'
import type { Track, RadioStation } from '../types'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'
import { Spinner } from './ui/Spinner'

const GENRES = [
  { tag: 'pop', icon: '🎤' }, { tag: 'rock', icon: '🎸' }, { tag: 'electronic', icon: '🎧' },
  { tag: 'jazz', icon: '🎷' }, { tag: 'classical', icon: '🎼' }, { tag: 'hiphop', icon: '🎤' },
  { tag: 'ambient', icon: '🌊' }, { tag: 'metal', icon: '🤘' }, { tag: 'blues', icon: '🎸' },
  { tag: 'folk', icon: '🪕' }, { tag: 'reggae', icon: '🌴' }, { tag: 'latin', icon: '💃' },
  { tag: 'country', icon: '🤠' }, { tag: 'soul', icon: '💜' }, { tag: 'funk', icon: '🪩' },
  { tag: 'punk', icon: '⚡' }, { tag: 'indie', icon: '🎵' }, { tag: 'rnb', icon: '🎶' },
]
const SPEEDS = [
  { id: 'low', label: 'Slow', icon: '🐢' },
  { id: 'medium', label: 'Medium', icon: '🚶' },
  { id: 'high', label: 'Fast', icon: '🏃' },
  { id: 'veryhigh', label: 'Very Fast', icon: '⚡' },
]
const VOCAL = [
  { id: 'vocal', label: 'Vocal', icon: '🎤' },
  { id: 'instrumental', label: 'Instrumental', icon: '🎹' },
]
const ACOUSTIC = [
  { id: 'acoustic', label: 'Acoustic', icon: '🪕' },
  { id: 'electric', label: 'Electric', icon: '🔌' },
]
const SORT_OPTIONS = [
  { id: 'popularity_week', label: 'Popular' },
  { id: 'releasedate_desc', label: 'Newest' },
  { id: 'downloads_week', label: 'Most Downloaded' },
  { id: 'listens_week', label: 'Most Played' },
]
const QUICK_SEARCHES = [
  'chill beats', 'piano solo', 'guitar acoustic', 'lo-fi', 'cinematic',
  'happy vibes', 'meditation', 'workout energy', 'jazz cafe', 'nature sounds',
  'epic orchestral', 'indie folk', 'funky groove',
]

const HISTORY_KEY = 'fm-search-history'
const MAX_HISTORY = 15

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}
function addToHistory(q: string) {
  const h = getHistory().filter(x => x !== q)
  h.unshift(q)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, MAX_HISTORY)))
}
function removeFromHistory(q: string) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(x => x !== q)))
}

export function SearchTab() {
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState<Track[]>([])
  const [stations, setStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [history, setHistory] = useState(getHistory)
  const [genre, setGenre] = useState('')
  const [speed, setSpeed] = useState('')
  const [vocal, setVocal] = useState('')
  const [acoustic, setAcoustic] = useState('')
  const [sortBy, setSortBy] = useState('popularity_week')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const hasFilters = !!(genre || speed || vocal || acoustic)

  const doSearch = async (q?: string) => {
    const term = (q ?? query).trim()
    if (!term && !hasFilters) return
    if (term) { setQuery(term); addToHistory(term); setHistory(getHistory()) }
    setLoading(true)
    setHasSearched(true)

    const filters: TrackFilters = {}
    if (term) filters.search = term
    if (genre) filters.tags = genre
    if (speed) filters.speed = speed as TrackFilters['speed']
    if (vocal) filters.vocalinstrumental = vocal as TrackFilters['vocalinstrumental']
    if (acoustic) filters.acousticelectric = acoustic as TrackFilters['acousticelectric']

    const [j, ia, radio] = await Promise.all([
      advancedSearch(filters, 30),
      term ? searchArchive(term, 10) : Promise.resolve([]),
      term ? searchStations(term, 10) : Promise.resolve([]),
    ])
    setTracks([...j, ...ia])
    setStations(radio)
    setLoading(false)
  }

  const clearAll = () => {
    setGenre(''); setSpeed(''); setVocal(''); setAcoustic('')
    setSortBy('popularity_week')
  }

  // Auto-search when filters change
  useEffect(() => {
    if (!hasSearched && !hasFilters) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => doSearch(), 300)
    return () => clearTimeout(timer.current)
  }, [genre, speed, vocal, acoustic])

  const hasResults = tracks.length > 0 || stations.length > 0

  return (
    <div className="pb-4">
      <div className="px-4 md:px-6 pt-6 md:pt-10 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold">Search</h1>
        <p className="text-sm text-text-muted mt-1">600K+ tracks · 63K+ classical · 30K+ radio stations</p>
      </div>

      {/* Search bar */}
      <form className="px-4 md:px-6 my-3" onSubmit={e => { e.preventDefault(); doSearch() }}>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5">
          <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="search"
            placeholder="Songs, artists, albums, stations..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-text-dim"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {(query || hasFilters) && (
            <button type="button" onClick={() => { setQuery(''); clearAll(); setHasSearched(false); setTracks([]); setStations([]) }}
              className="text-text-muted hover:text-text p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </form>

      {/* Sort */}
      <div className="px-4 md:px-6 mb-2">
        <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Sort by</div>
        <div className="flex gap-1 overflow-x-auto snap-x md:flex-wrap md:overflow-visible">
          {SORT_OPTIONS.map(s => (
            <button key={s.id} onClick={() => { setSortBy(s.id); if (hasSearched) doSearch() }}
              className={`flex-shrink-0 snap-start text-[11px] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${sortBy === s.id ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre */}
      <div className="px-4 md:px-6 mb-2">
        <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Genre</div>
        <div className="flex gap-1 overflow-x-auto pb-1 snap-x md:flex-wrap md:overflow-visible">
          {GENRES.map(g => (
            <button key={g.tag} onClick={() => setGenre(genre === g.tag ? '' : g.tag)}
              className={`flex-shrink-0 snap-start flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${genre === g.tag ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
              <span>{g.icon}</span>{g.tag}
            </button>
          ))}
        </div>
      </div>

      {/* Tempo */}
      <div className="px-4 md:px-6 mb-2">
        <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Tempo</div>
        <div className="flex gap-1 overflow-x-auto snap-x md:flex-wrap md:overflow-visible">
          {SPEEDS.map(s => (
            <button key={s.id} onClick={() => setSpeed(speed === s.id ? '' : s.id)}
              className={`flex-shrink-0 snap-start flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${speed === s.id ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
              <span>{s.icon}</span>{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type + Sound side by side */}
      <div className="px-4 md:px-6 mb-2 flex gap-6">
        <div>
          <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Type</div>
          <div className="flex gap-1">
            {VOCAL.map(v => (
              <button key={v.id} onClick={() => setVocal(vocal === v.id ? '' : v.id)}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${vocal === v.id ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
                <span>{v.icon}</span>{v.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Sound</div>
          <div className="flex gap-1">
            {ACOUSTIC.map(a => (
              <button key={a.id} onClick={() => setAcoustic(acoustic === a.id ? '' : a.id)}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${acoustic === a.id ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
                <span>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex gap-1.5 px-4 md:px-6 mb-2 flex-wrap">
          {genre && <Chip label={`${GENRES.find(g => g.tag === genre)?.icon || ''} ${genre}`} onRemove={() => setGenre('')} />}
          {speed && <Chip label={`${SPEEDS.find(s => s.id === speed)?.icon || ''} ${SPEEDS.find(s => s.id === speed)?.label || speed}`} onRemove={() => setSpeed('')} />}
          {vocal && <Chip label={VOCAL.find(v => v.id === vocal)?.label || vocal} onRemove={() => setVocal('')} />}
          {acoustic && <Chip label={ACOUSTIC.find(a => a.id === acoustic)?.label || acoustic} onRemove={() => setAcoustic('')} />}
          <button onClick={() => { clearAll(); if (hasSearched) doSearch() }} className="text-[11px] text-text-muted hover:text-text px-2 py-1">Clear</button>
        </div>
      )}

      {/* Results / Empty states */}
      {loading ? (
        <div className="flex items-center justify-center py-12"><Spinner /></div>
      ) : hasSearched && hasResults ? (
        <>
          <div className="px-4 md:px-6 mb-1 flex items-center justify-between">
            <span className="text-xs text-text-muted">{tracks.length} tracks{stations.length > 0 ? ` · ${stations.length} stations` : ''}</span>
            {tracks.length > 0 && (
              <button onClick={() => player.playTrack(tracks[0], tracks, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>
            )}
          </div>
          {tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)}
          {stations.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-4 md:px-6 mb-1 mt-4">Radio Stations</h2>
              {stations.map(s => <StationRow key={s.id} station={s} />)}
            </>
          )}
        </>
      ) : hasSearched && !hasResults ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-text-muted">
          <span className="text-sm">No results found</span>
          {hasFilters && <button onClick={() => { clearAll(); doSearch() }} className="text-xs text-accent hover:underline">Clear filters and retry</button>}
        </div>
      ) : (
        /* Pre-search state: history + quick searches */
        <div className="mt-2">
          {/* Recent searches */}
          {history.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between px-4 md:px-6 mb-1">
                <div className="text-[10px] text-text-dim uppercase tracking-wider">Recent</div>
                <button onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]) }} className="text-[10px] text-text-muted hover:text-text">Clear</button>
              </div>
              <div className="flex gap-1.5 overflow-x-auto px-4 md:px-6 pb-1 snap-x md:flex-wrap md:overflow-visible">
                {history.map(h => (
                  <button key={h} onClick={() => doSearch(h)}
                    className="flex-shrink-0 snap-start flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg bg-white/4 text-text-muted hover:text-text transition-colors group">
                    <svg className="w-3 h-3 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {h}
                    <span className="opacity-0 group-hover:opacity-60 hover:!opacity-100" onClick={e => { e.stopPropagation(); removeFromHistory(h); setHistory(getHistory()) }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick searches */}
          <div>
            <div className="text-[10px] text-text-dim uppercase tracking-wider px-4 md:px-6 mb-1.5">Try searching</div>
            <div className="flex gap-1.5 flex-wrap px-4 md:px-6">
              {QUICK_SEARCHES.map(q => (
                <button key={q} onClick={() => doSearch(q)}
                  className="text-[11px] px-3 py-1.5 rounded-lg bg-surface border border-border text-text-muted hover:text-text hover:border-accent/40 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-medium inline-flex items-center gap-1">
      {label}<button onClick={onRemove} className="opacity-60 hover:opacity-100">&times;</button>
    </span>
  )
}
