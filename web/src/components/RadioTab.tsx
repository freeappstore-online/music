import { useEffect, useState } from 'react'
import { getTopStations, searchStations, getByGenre, getByCountry } from '../services/radio'
import type { RadioStation } from '../types'
import { StationRow } from './StationRow'

const GENRES = ['pop', 'rock', 'jazz', 'classical', 'electronic', 'dance', 'hiphop', 'blues', 'oldies', '80s', 'country', 'reggae']
const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'France', 'Brazil', 'Japan', 'Spain', 'Italy', 'Canada', 'Australia']

type BrowseMode = 'top' | 'genre' | 'country'

export function RadioTab() {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<BrowseMode>('top')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    getTopStations(40).then(s => { setStations(s); setLoading(false) })
  }, [])

  const doSearch = async () => {
    const q = query.trim()
    if (!q) { loadTop(); return }
    setLoading(true)
    setSelected(null)
    const s = await searchStations(q, 40)
    setStations(s)
    setLoading(false)
  }

  const loadTop = async () => {
    setMode('top'); setSelected(null); setLoading(true)
    setStations(await getTopStations(40))
    setLoading(false)
  }

  const loadGenre = async (genre: string) => {
    setMode('genre'); setSelected(genre); setLoading(true); setQuery('')
    setStations(await getByGenre(genre, 40))
    setLoading(false)
  }

  const loadCountry = async (country: string) => {
    setMode('country'); setSelected(country); setLoading(true); setQuery('')
    setStations(await getByCountry(country, 40))
    setLoading(false)
  }

  return (
    <div className="pb-4">
      <h1 className="text-2xl md:text-3xl font-bold px-4 md:px-6 pt-4 md:pt-8 pb-3">Radio</h1>

      {/* Search */}
      <form className="px-4 md:px-6 mb-3" onSubmit={(e) => { e.preventDefault(); doSearch() }}>
        <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2.5 border border-border">
          <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="search"
            placeholder="Search stations..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      {/* Browse filters */}
      <div className="px-4 md:px-6 mb-1">
        <div className="flex gap-2 mb-2">
          <button onClick={loadTop} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${mode === 'top' && !selected ? 'bg-accent text-bg' : 'bg-surface text-muted'}`}>Top</button>
          <button onClick={() => setMode(mode === 'genre' ? 'top' : 'genre')} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${mode === 'genre' ? 'bg-accent text-bg' : 'bg-surface text-muted'}`}>Genre</button>
          <button onClick={() => setMode(mode === 'country' ? 'top' : 'country')} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${mode === 'country' ? 'bg-accent text-bg' : 'bg-surface text-muted'}`}>Country</button>
        </div>

        {mode === 'genre' && (
          <div className="flex gap-1.5 overflow-x-auto pb-2 snap-x">
            {GENRES.map(g => (
              <button key={g} onClick={() => loadGenre(g)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full snap-start transition-colors ${selected === g ? 'bg-accent/20 text-accent ring-1 ring-accent' : 'bg-surface text-muted'}`}>
                {g === '80s' ? "80's" : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        )}

        {mode === 'country' && (
          <div className="flex gap-1.5 overflow-x-auto pb-2 snap-x">
            {COUNTRIES.map(c => (
              <button key={c} onClick={() => loadCountry(c)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full snap-start whitespace-nowrap transition-colors ${selected === c ? 'bg-accent/20 text-accent ring-1 ring-accent' : 'bg-surface text-muted'}`}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <span className="text-sm">No stations found</span>
        </div>
      ) : (
        stations.map(station => <StationRow key={station.id} station={station} />)
      )}
    </div>
  )
}
