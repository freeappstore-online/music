import { useEffect, useState, useRef } from 'react'
import { getTopStations, advancedSearch, type RadioFilters } from '../services/radio'
import { getUserTags, addUserTag, removeUserTag } from '../services/usertags'
import type { RadioStation } from '../types'
import { StationRow } from './StationRow'
import { Spinner } from './ui/Spinner'

const GENRES = ['pop', 'rock', 'jazz', 'classical', 'electronic', 'dance', 'hiphop', 'blues', 'oldies', '80s', 'country', 'reggae', 'metal', 'ambient', 'folk', 'latin']
const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'France', 'Brazil', 'Japan', 'Spain', 'Italy', 'Canada', 'Australia', 'Russia', 'Mexico', 'India', 'Netherlands']
const LANGUAGES = ['english', 'spanish', 'german', 'french', 'russian', 'italian', 'portuguese', 'chinese', 'japanese', 'arabic']

export function RadioTab() {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)
  const [nameQuery, setNameQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [country, setCountry] = useState('')
  const [language, setLanguage] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [taggingStation, setTaggingStation] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const hasFilters = !!(genre || country || language)

  useEffect(() => {
    getTopStations(40).then(s => { setStations(s); setLoading(false) })
  }, [])

  const doSearch = async () => {
    setLoading(true)
    const filters: RadioFilters = {}
    if (nameQuery.trim()) filters.name = nameQuery.trim()
    if (genre) filters.tag = genre
    if (country) filters.country = country
    if (language) filters.language = language

    if (!filters.name && !filters.tag && !filters.country && !filters.language) {
      setStations(await getTopStations(40))
    } else {
      setStations(await advancedSearch(filters, 40))
    }
    setLoading(false)
  }

  const clearFilters = () => {
    setGenre(''); setCountry(''); setLanguage(''); setNameQuery('')
    setLoading(true)
    getTopStations(40).then(s => { setStations(s); setLoading(false) })
  }

  // Debounced search on filter change
  useEffect(() => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(doSearch, 200)
    return () => clearTimeout(searchTimer.current)
  }, [genre, country, language])

  const handleAddTag = (stationId: string) => {
    if (newTag.trim()) {
      addUserTag(stationId, newTag.trim().toLowerCase())
      setNewTag('')
      setTaggingStation(null)
    }
  }

  return (
    <div className="pb-4">
      <h1 className="text-2xl font-bold px-4 pt-4 pb-1">Radio</h1>
      <p className="text-xs text-text-muted px-4 pb-3">30,000+ stations worldwide</p>

      {/* Search bar */}
      <form className="px-4 mb-2" onSubmit={(e) => { e.preventDefault(); doSearch() }}>
        <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2.5 border border-border">
          <svg className="w-5 h-5 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="search"
            placeholder="Search by name..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            aria-label="Search stations by name"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition-colors ${showFilters || hasFilters ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text'}`}
            aria-label="Toggle filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          </button>
        </div>
      </form>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex gap-1.5 px-4 mb-2 flex-wrap">
          {genre && <FilterChip label={genre} onRemove={() => setGenre('')} />}
          {country && <FilterChip label={country} onRemove={() => setCountry('')} />}
          {language && <FilterChip label={language} onRemove={() => setLanguage('')} />}
          <button onClick={clearFilters} className="text-[11px] text-text-muted hover:text-text px-2 py-1">Clear all</button>
        </div>
      )}

      {/* Filter panel */}
      {showFilters && (
        <div className="mx-4 mb-3 bg-surface border border-border rounded-2xl p-3 space-y-3">
          <FilterSection label="Genre" items={GENRES} selected={genre} onSelect={(g) => setGenre(genre === g ? '' : g)} />
          <FilterSection label="Country" items={COUNTRIES} selected={country} onSelect={(c) => setCountry(country === c ? '' : c)} />
          <FilterSection label="Language" items={LANGUAGES} selected={language} onSelect={(l) => setLanguage(language === l ? '' : l)} capitalize />
        </div>
      )}

      {/* Results */}
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
            {/* User tags */}
            <div className="px-4 -mt-1 mb-1 flex items-center gap-1 flex-wrap">
              {getUserTags(station.id).map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent inline-flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeUserTag(station.id, tag)} className="opacity-60 hover:opacity-100">&times;</button>
                </span>
              ))}
              {taggingStation === station.id ? (
                <form onSubmit={(e) => { e.preventDefault(); handleAddTag(station.id) }} className="inline-flex">
                  <input
                    autoFocus
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onBlur={() => { if (!newTag) setTaggingStation(null) }}
                    placeholder="e.g. ad-free"
                    className="text-[10px] w-20 bg-white/4 rounded-full px-2 py-0.5 outline-none border border-border"
                  />
                </form>
              ) : (
                <button
                  onClick={() => setTaggingStation(station.id)}
                  className="text-[10px] px-1.5 py-0.5 rounded-full text-text-muted hover:text-text hover:bg-white/4 transition-colors"
                >
                  + tag
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function FilterSection({ label, items, selected, onSelect, capitalize }: {
  label: string; items: string[]; selected: string; onSelect: (v: string) => void; capitalize?: boolean
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5 block">{label}</label>
      <div className="flex gap-1.5 flex-wrap">
        {items.map(item => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={`text-[11px] px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${selected === item ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}
          >
            {capitalize ? item.charAt(0).toUpperCase() + item.slice(1) : item}
          </button>
        ))}
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="text-[11px] px-2.5 py-1 rounded-full bg-accent/15 text-accent font-medium inline-flex items-center gap-1">
      {label}
      <button onClick={onRemove} className="opacity-60 hover:opacity-100">&times;</button>
    </span>
  )
}
