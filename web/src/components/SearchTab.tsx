import { useState, useRef } from 'react'
import { advancedSearch, type TrackFilters } from '../services/jamendo'
import { searchTracks as searchArchive } from '../services/archive'
import { searchStations } from '../services/radio'
import type { Track, RadioStation } from '../types'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'
import { Spinner } from './ui/Spinner'

const GENRES = ['rock', 'pop', 'electronic', 'jazz', 'classical', 'hiphop', 'ambient', 'metal', 'blues', 'folk', 'reggae', 'latin', 'country', 'soul', 'funk', 'punk']
const SPEEDS = [
  { id: 'low', label: 'Slow' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'Fast' },
  { id: 'veryhigh', label: 'Very Fast' },
] as const
const VOCAL = [
  { id: 'vocal', label: 'Vocal' },
  { id: 'instrumental', label: 'Instrumental' },
] as const
const ACOUSTIC = [
  { id: 'acoustic', label: 'Acoustic' },
  { id: 'electric', label: 'Electric' },
] as const

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
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [history, setHistory] = useState(getHistory)
  const [showFilters, setShowFilters] = useState(false)
  const [genre, setGenre] = useState('')
  const [speed, setSpeed] = useState('')
  const [vocal, setVocal] = useState('')
  const [acoustic, setAcoustic] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const hasFilters = !!(genre || speed || vocal || acoustic)

  const doSearch = async (q?: string) => {
    const term = (q ?? query).trim()
    if (!term && !hasFilters) return
    if (term) { setQuery(term); addToHistory(term); setHistory(getHistory()) }
    setSearching(true)
    setHasSearched(true)

    const filters: TrackFilters = {}
    if (term) filters.search = term
    if (genre) filters.tags = genre
    if (speed) filters.speed = speed as TrackFilters['speed']
    if (vocal) filters.vocalinstrumental = vocal as TrackFilters['vocalinstrumental']
    if (acoustic) filters.acousticelectric = acoustic as TrackFilters['acousticelectric']

    const [j, ia, radio] = await Promise.all([
      advancedSearch(filters, 20),
      term ? searchArchive(term, 8) : Promise.resolve([]),
      term ? searchStations(term, 8) : Promise.resolve([]),
    ])
    setTracks([...j, ...ia])
    setStations(radio)
    setSearching(false)
  }

  const clearFilters = () => {
    setGenre(''); setSpeed(''); setVocal(''); setAcoustic('')
  }

  const onFilterChange = () => {
    if (hasSearched) {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => doSearch(), 300)
    }
  }

  const showHistory = !hasSearched && !hasFilters && history.length > 0
  const hasResults = tracks.length > 0 || stations.length > 0

  return (
    <div className="pb-4">
      <h1 className="text-2xl md:text-3xl font-bold px-4 md:px-6 pt-6 md:pt-10 pb-3">Search</h1>

      <form className="px-4 md:px-6 mb-3" onSubmit={(e) => { e.preventDefault(); doSearch() }}>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5">
          <svg className="w-5 h-5 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="search"
            placeholder="Songs, artists, albums..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-text-dim"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition-colors ${showFilters || hasFilters ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text'}`}
            aria-label="Toggle filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          </button>
        </div>
      </form>

      {hasFilters && (
        <div className="flex gap-1.5 px-4 md:px-6 mb-3 flex-wrap">
          {genre && <Chip label={genre} onRemove={() => { setGenre(''); onFilterChange() }} />}
          {speed && <Chip label={SPEEDS.find(s => s.id === speed)?.label || speed} onRemove={() => { setSpeed(''); onFilterChange() }} />}
          {vocal && <Chip label={vocal} onRemove={() => { setVocal(''); onFilterChange() }} />}
          {acoustic && <Chip label={acoustic} onRemove={() => { setAcoustic(''); onFilterChange() }} />}
          <button onClick={() => { clearFilters(); onFilterChange() }} className="text-[11px] text-text-muted hover:text-text px-2 py-1">Clear all</button>
        </div>
      )}

      {showFilters && (
        <div className="mx-4 md:mx-6 mb-4 bg-surface border border-border rounded-xl p-4 space-y-4">
          <FilterRow label="Genre" items={GENRES} selected={genre} onSelect={(v) => { setGenre(genre === v ? '' : v); onFilterChange() }} />
          <FilterRow label="Tempo" items={SPEEDS} selected={speed} onSelect={(v) => { setSpeed(speed === v ? '' : v); onFilterChange() }} />
          <FilterRow label="Type" items={VOCAL} selected={vocal} onSelect={(v) => { setVocal(vocal === v ? '' : v); onFilterChange() }} />
          <FilterRow label="Sound" items={ACOUSTIC} selected={acoustic} onSelect={(v) => { setAcoustic(acoustic === v ? '' : v); onFilterChange() }} />
        </div>
      )}

      {searching ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Spinner />
          <span className="text-sm text-text-muted">Searching...</span>
        </div>
      ) : showHistory ? (
        <div>
          <div className="flex items-center justify-between px-4 md:px-6 mb-2">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Recent</h2>
            <button onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]) }} className="text-[11px] text-text-muted hover:text-text">Clear all</button>
          </div>
          {history.map(h => (
            <button key={h} className="flex items-center gap-3 w-full px-4 md:px-6 py-2.5 hover:bg-white/3 text-left group" onClick={() => doSearch(h)}>
              <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="flex-1 text-sm">{h}</span>
              <button className="p-1 rounded-full opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-white/6 transition-opacity" onClick={(e) => { e.stopPropagation(); removeFromHistory(h); setHistory(getHistory()) }} aria-label={`Remove ${h}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </button>
          ))}
        </div>
      ) : !hasSearched ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-muted">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="text-sm">Search tracks, artists, and radio stations</span>
          <span className="text-xs text-text-dim">Use filters to narrow by genre, tempo, vocal/instrumental</span>
        </div>
      ) : !hasResults ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-muted">
          <span className="text-sm">No results found</span>
          {hasFilters && <button onClick={() => { clearFilters(); doSearch() }} className="text-xs text-accent hover:underline">Clear filters and retry</button>}
        </div>
      ) : (
        <>
          {tracks.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-4 md:px-6 mb-1">Tracks ({tracks.length})</h2>
              {tracks.map((track, i) => <TrackRow key={track.id} track={track} queue={tracks} index={i} />)}
            </>
          )}
          {stations.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-4 md:px-6 mb-1 mt-4">Radio Stations</h2>
              {stations.map(station => <StationRow key={station.id} station={station} />)}
            </>
          )}
        </>
      )}
    </div>
  )
}

function FilterRow({ label, items, selected, onSelect }: {
  label: string; items: readonly { id: string; label: string }[] | string[]; selected: string; onSelect: (v: string) => void
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">{label}</label>
      <div className="flex gap-1.5 flex-wrap">
        {(items as any[]).map(item => {
          const id = typeof item === 'string' ? item : item.id
          const lbl = typeof item === 'string' ? item : item.label
          return (
            <button key={id} onClick={() => onSelect(id)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${selected === id ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
              {lbl}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-medium inline-flex items-center gap-1">
      {label}
      <button onClick={onRemove} className="opacity-60 hover:opacity-100">&times;</button>
    </span>
  )
}
