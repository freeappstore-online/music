import { useState } from 'react'
import { searchTracks as searchJamendo } from '../services/jamendo'
import { searchTracks as searchArchive } from '../services/archive'
import { searchTracks as searchCCMixter } from '../services/ccmixter'
import { searchStations } from '../services/radio'
import type { Track, RadioStation } from '../types'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'

export function SearchTab() {
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState<Track[]>([])
  const [stations, setStations] = useState<RadioStation[]>([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const doSearch = async () => {
    const q = query.trim()
    if (!q) return
    setSearching(true)
    setHasSearched(true)
    const [j, ia, cc, radio] = await Promise.all([
      searchJamendo(q, 15),
      searchArchive(q, 10),
      searchCCMixter(q, 10),
      searchStations(q, 10),
    ])
    setTracks([...j, ...cc, ...ia])
    setStations(radio)
    setSearching(false)
  }

  const hasResults = tracks.length > 0 || stations.length > 0

  return (
    <div className="pb-4">
      <h1 className="text-2xl font-bold px-4 pt-4 pb-3">Search</h1>

      <form className="px-4 mb-4" onSubmit={(e) => { e.preventDefault(); doSearch() }}>
        <div className="flex items-center gap-2 bg-[var(--surface)] rounded-xl px-3 py-2.5 border border-[var(--border)]">
          <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="search"
            placeholder="Songs, artists, stations..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      {searching ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[var(--text-muted)]">Searching all sources...</span>
        </div>
      ) : !hasSearched ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--text-muted)]">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
          <span className="text-sm">Search tracks, artists, and radio stations</span>
        </div>
      ) : !hasResults ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--text-muted)]">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="text-sm">No results found</span>
        </div>
      ) : (
        <>
          {tracks.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 mb-1">Tracks</h2>
              {tracks.map((track, i) => (
                <TrackRow key={track.id} track={track} queue={tracks} index={i} />
              ))}
            </>
          )}
          {stations.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 mb-1 mt-4">Radio Stations</h2>
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
