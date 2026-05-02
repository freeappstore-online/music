import { useState } from 'react'
import { searchTracks as searchJamendo } from '../services/jamendo'
import { searchTracks as searchArchive } from '../services/archive'
import { searchTracks as searchCCMixter } from '../services/ccmixter'
import { searchStations } from '../services/radio'
import type { Track, RadioStation } from '../types'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'
import { Spinner } from './ui/Spinner'

const HISTORY_KEY = 'fm-search-history'
const MAX_HISTORY = 15

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}

function addToHistory(q: string) {
  const history = getHistory().filter(h => h !== q)
  history.unshift(q)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
}

function removeFromHistory(q: string) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(h => h !== q)))
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export function SearchTab() {
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState<Track[]>([])
  const [stations, setStations] = useState<RadioStation[]>([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [history, setHistory] = useState(getHistory)

  const doSearch = async (q?: string) => {
    const term = (q ?? query).trim()
    if (!term) return
    setQuery(term)
    setSearching(true)
    setHasSearched(true)
    addToHistory(term)
    setHistory(getHistory())
    const [j, ia, cc, radio] = await Promise.all([
      searchJamendo(term, 15),
      searchArchive(term, 10),
      searchCCMixter(term, 10),
      searchStations(term, 10),
    ])
    setTracks([...j, ...cc, ...ia])
    setStations(radio)
    setSearching(false)
  }

  const handleRemove = (q: string) => {
    removeFromHistory(q)
    setHistory(getHistory())
  }

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  const hasResults = tracks.length > 0 || stations.length > 0
  const showHistory = !hasSearched && history.length > 0

  return (
    <div className="pb-4">
      <h1 className="text-2xl md:text-3xl font-bold px-4 md:px-6 pt-4 md:pt-8 pb-3">Search</h1>

      <form className="px-4 md:px-6 mb-4" onSubmit={(e) => { e.preventDefault(); doSearch() }}>
        <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2.5 border border-border">
          <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="search"
            placeholder="Songs, artists, stations..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
        </div>
      </form>

      {searching ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Spinner />
          <span className="text-sm text-muted">Searching all sources...</span>
        </div>
      ) : showHistory ? (
        /* Recent searches */
        <div>
          <div className="flex items-center justify-between px-4 md:px-6 mb-2">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Recent</h2>
            <button onClick={handleClear} className="text-[11px] text-muted hover:text-txt">Clear all</button>
          </div>
          {history.map(h => (
            <button
              key={h}
              className="flex items-center gap-3 w-full px-4 md:px-6 py-2.5 hover:bg-white/3 text-left group"
              onClick={() => doSearch(h)}
            >
              <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="flex-1 text-sm">{h}</span>
              <button
                className="p-1 rounded-full opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-white/6 transition-opacity"
                onClick={(e) => { e.stopPropagation(); handleRemove(h) }}
                aria-label={`Remove ${h}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </button>
          ))}
        </div>
      ) : !hasSearched ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="text-sm">Search tracks, artists, and radio stations</span>
        </div>
      ) : !hasResults ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="text-sm">No results found</span>
        </div>
      ) : (
        <>
          {tracks.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-4 md:px-6 mb-1">Tracks</h2>
              {tracks.map((track, i) => (
                <TrackRow key={track.id} track={track} queue={tracks} index={i} />
              ))}
            </>
          )}
          {stations.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-4 md:px-6 mb-1 mt-4">Radio Stations</h2>
              {stations.map(station => (
                <StationRow key={station.id} station={station} />
              ))}
            </>
          )}
        </>
      )}
    </div>
  )
}
