import { useEffect, useState, useRef } from 'react'
import { getTopStations, advancedSearch, type RadioFilters } from '../services/radio'
import { getUserTags, addUserTag, removeUserTag } from '../services/usertags'
import type { RadioStation } from '../types'
import { StationRow } from './StationRow'
import { Spinner } from './ui/Spinner'

const GENRES: { tag: string; count: number }[] = [
  { tag: 'pop', count: 5243 }, { tag: 'rock', count: 2804 }, { tag: 'news', count: 2604 },
  { tag: 'classical', count: 1544 }, { tag: 'dance', count: 1389 }, { tag: 'talk', count: 1351 },
  { tag: 'oldies', count: 1243 }, { tag: '80s', count: 1110 }, { tag: 'jazz', count: 1068 },
  { tag: 'electronic', count: 866 }, { tag: 'christian', count: 881 }, { tag: 'country', count: 645 },
  { tag: 'folk', count: 540 }, { tag: 'metal', count: 396 }, { tag: 'soul', count: 380 },
  { tag: 'indie', count: 368 }, { tag: 'ambient', count: 314 }, { tag: 'sports', count: 313 },
  { tag: 'blues', count: 286 }, { tag: 'funk', count: 280 }, { tag: 'hiphop', count: 267 },
  { tag: 'reggae', count: 216 }, { tag: 'r&b', count: 144 }, { tag: 'punk', count: 142 },
  { tag: 'latin', count: 134 },
]
const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'France', 'Brazil', 'Japan', 'Spain', 'Italy', 'Canada', 'Australia', 'Russia', 'Mexico', 'India', 'Netherlands', 'Poland', 'Greece', 'China', 'Turkey', 'Argentina', 'South Korea']
const LANGUAGES = ['english', 'spanish', 'german', 'french', 'russian', 'italian', 'portuguese', 'chinese', 'japanese', 'arabic', 'dutch', 'polish', 'greek', 'turkish', 'korean', 'hindi']
const DECADES: { tag: string; count: number }[] = [
  { tag: '80s', count: 1110 }, { tag: '90s', count: 876 }, { tag: '70s', count: 527 },
  { tag: '60s', count: 241 }, { tag: '00s', count: 162 },
]
const SORT_OPTIONS = [
  { id: 'clickcount', label: 'Most Popular' },
  { id: 'votes', label: 'Most Voted' },
  { id: 'clicktrend', label: 'Trending Now' },
  { id: 'changetimestamp', label: 'Recently Updated' },
  { id: 'random', label: 'Random' },
]

export function RadioTab() {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)
  const [nameQuery, setNameQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [country, setCountry] = useState('')
  const [language, setLanguage] = useState('')
  const [sortBy, setSortBy] = useState('clickcount')
  const [showFilters, setShowFilters] = useState(false)
  const [activeSection, setActiveSection] = useState<'genre' | 'country' | 'language' | 'sort' | null>(null)
  const [taggingStation, setTaggingStation] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const hasFilters = !!(genre || country || language || sortBy !== 'clickcount')
  const filterCount = [genre, country, language, sortBy !== 'clickcount' ? 'x' : ''].filter(Boolean).length

  useEffect(() => {
    getTopStations(50).then(s => { setStations(s); setLoading(false) })
  }, [])

  const doSearch = async () => {
    setLoading(true)
    const filters: RadioFilters = {}
    if (nameQuery.trim()) filters.name = nameQuery.trim()
    if (genre) filters.tag = genre
    if (country) filters.country = country
    if (language) filters.language = language
    if (!filters.name && !filters.tag && !filters.country && !filters.language) {
      setStations(await getTopStations(50))
    } else {
      setStations(await advancedSearch(filters, 50))
    }
    setLoading(false)
  }

  const clearFilters = () => {
    setGenre(''); setCountry(''); setLanguage(''); setSortBy('clickcount'); setNameQuery('')
    setActiveSection(null)
    setLoading(true)
    getTopStations(50).then(s => { setStations(s); setLoading(false) })
  }

  useEffect(() => {
    if (!loading) {
      clearTimeout(timer.current)
      timer.current = setTimeout(doSearch, 250)
    }
    return () => clearTimeout(timer.current)
  }, [genre, country, language, sortBy])

  const toggleSection = (s: typeof activeSection) => setActiveSection(activeSection === s ? null : s)

  return (
    <div className="pb-4">
      <div className="px-4 md:px-6 pt-6 md:pt-10 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold">Radio</h1>
        <p className="text-sm text-text-muted mt-1">30,000+ stations from 237 countries</p>
      </div>

      {/* Search */}
      <form className="px-4 md:px-6 my-3" onSubmit={e => { e.preventDefault(); doSearch() }}>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5">
          <svg className="w-5 h-5 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="search" placeholder="Search stations..." className="flex-1 bg-transparent outline-none text-sm placeholder-text-dim" value={nameQuery} onChange={e => setNameQuery(e.target.value)} />
          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition-colors relative ${showFilters || hasFilters ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            {filterCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-base text-[9px] font-bold rounded-full flex items-center justify-center">{filterCount}</span>}
          </button>
        </div>
      </form>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex gap-1.5 px-4 md:px-6 mb-2 flex-wrap">
          {genre && <Chip label={genre} onRemove={() => setGenre('')} />}
          {country && <Chip label={country} onRemove={() => setCountry('')} />}
          {language && <Chip label={language} onRemove={() => setLanguage('')} />}
          {sortBy !== 'clickcount' && <Chip label={SORT_OPTIONS.find(s => s.id === sortBy)?.label || sortBy} onRemove={() => setSortBy('clickcount')} />}
          <button onClick={clearFilters} className="text-[11px] text-text-muted hover:text-text px-2 py-1">Clear all</button>
        </div>
      )}

      {/* Filter panel */}
      {showFilters && (
        <div className="mx-4 md:mx-6 mb-3 bg-surface border border-border rounded-xl overflow-hidden">
          <div className="flex border-b border-border">
            {([
              { id: 'genre' as const, label: 'Genre' },
              { id: 'country' as const, label: 'Country' },
              { id: 'language' as const, label: 'Language' },
              { id: 'sort' as const, label: 'Sort' },
            ]).map(s => (
              <button key={s.id} onClick={() => toggleSection(s.id)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${activeSection === s.id ? 'text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text'}`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="p-3">
            {activeSection === 'genre' && (
              <div className="flex gap-1.5 flex-wrap">{GENRES.map(g => <Pill key={g.tag} label={`${g.tag} (${g.count})`} active={genre === g.tag} onClick={() => setGenre(genre === g.tag ? '' : g.tag)} />)}</div>
            )}
            {activeSection === 'country' && (
              <div className="flex gap-1.5 flex-wrap">{COUNTRIES.map(c => <Pill key={c} label={c} active={country === c} onClick={() => setCountry(country === c ? '' : c)} />)}</div>
            )}
            {activeSection === 'language' && (
              <div className="flex gap-1.5 flex-wrap">{LANGUAGES.map(l => <Pill key={l} label={l.charAt(0).toUpperCase() + l.slice(1)} active={language === l} onClick={() => setLanguage(language === l ? '' : l)} />)}</div>
            )}
            {activeSection === 'sort' && (
              <div className="flex gap-1.5 flex-wrap">{SORT_OPTIONS.map(s => <Pill key={s.id} label={s.label} active={sortBy === s.id} onClick={() => setSortBy(s.id)} />)}</div>
            )}
            {activeSection === null && <p className="text-xs text-text-dim text-center py-2">Tap a category above to filter</p>}
          </div>

          <div className="px-3 pb-3 border-t border-border pt-2">
            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1.5">Decade</div>
            <div className="flex gap-1.5">{DECADES.map(d => <Pill key={d.tag} label={`${d.tag} (${d.count})`} active={genre === d.tag} onClick={() => setGenre(genre === d.tag ? '' : d.tag)} />)}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && <div className="px-4 md:px-6 mb-2"><span className="text-xs text-text-muted">{stations.length} stations</span></div>}

      {loading ? (
        <div className="flex items-center justify-center py-12"><Spinner /></div>
      ) : stations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-2">
          <span className="text-sm">No stations found</span>
          {hasFilters && <button onClick={clearFilters} className="text-xs text-accent hover:underline">Clear filters</button>}
        </div>
      ) : (
        stations.map(station => (
          <div key={station.id}>
            <StationRow station={station} />
            <div className="px-4 md:px-6 -mt-1 mb-1 flex items-center gap-1 flex-wrap">
              {getUserTags(station.id).map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent inline-flex items-center gap-1">
                  {tag}<button onClick={() => removeUserTag(station.id, tag)} className="opacity-60 hover:opacity-100">&times;</button>
                </span>
              ))}
              {taggingStation === station.id ? (
                <form onSubmit={e => { e.preventDefault(); if (newTag.trim()) { addUserTag(station.id, newTag.trim().toLowerCase()); setNewTag(''); setTaggingStation(null) } }} className="inline-flex">
                  <input autoFocus value={newTag} onChange={e => setNewTag(e.target.value)} onBlur={() => { if (!newTag) setTaggingStation(null) }}
                    placeholder="e.g. ad-free" className="text-[10px] w-20 bg-white/4 rounded-full px-2 py-0.5 outline-none border border-border" />
                </form>
              ) : (
                <button onClick={() => setTaggingStation(station.id)} className="text-[10px] px-1.5 py-0.5 rounded-full text-text-muted hover:text-text hover:bg-white/4 transition-colors">+ tag</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`text-[11px] px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${active ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
      {label}
    </button>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-medium inline-flex items-center gap-1">
      {label}<button onClick={onRemove} className="opacity-60 hover:opacity-100">&times;</button>
    </span>
  )
}
