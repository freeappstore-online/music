import { useEffect, useState, useRef } from 'react'
import { getTopStations, advancedSearch, type RadioFilters } from '../services/radio'
import { getUserTags, addUserTag, removeUserTag } from '../services/usertags'
import type { RadioStation } from '../types'
import { StationRow } from './StationRow'
import { Spinner } from './ui/Spinner'

type GenreItem = { tag: string; count: number; icon: string }
type CountryItem = { name: string; flag: string }
type LangItem = { code: string; flag: string }

const GENRES: GenreItem[] = [
  { tag: 'pop', count: 5243, icon: '🎤' }, { tag: 'rock', count: 2804, icon: '🎸' }, { tag: 'news', count: 2604, icon: '📰' },
  { tag: 'classical', count: 1544, icon: '🎼' }, { tag: 'dance', count: 1389, icon: '💃' }, { tag: 'talk', count: 1351, icon: '🎙️' },
  { tag: 'oldies', count: 1243, icon: '📻' }, { tag: 'jazz', count: 1068, icon: '🎷' },
  { tag: 'christian', count: 881, icon: '✝️' }, { tag: 'electronic', count: 866, icon: '🎧' }, { tag: 'country', count: 645, icon: '🤠' },
  { tag: 'folk', count: 540, icon: '🪕' }, { tag: 'metal', count: 396, icon: '🤘' }, { tag: 'soul', count: 380, icon: '💜' },
  { tag: 'indie', count: 368, icon: '🎵' }, { tag: 'ambient', count: 314, icon: '🌊' }, { tag: 'sports', count: 313, icon: '⚽' },
  { tag: 'blues', count: 286, icon: '🎸' }, { tag: 'funk', count: 280, icon: '🪩' }, { tag: 'hiphop', count: 267, icon: '🎤' },
  { tag: 'reggae', count: 216, icon: '🌴' }, { tag: 'punk', count: 142, icon: '⚡' }, { tag: 'latin', count: 134, icon: '💃' },
  { tag: '80s', count: 1110, icon: '🕺' }, { tag: '90s', count: 876, icon: '📼' }, { tag: '70s', count: 527, icon: '🌈' },
  { tag: '60s', count: 241, icon: '☮️' },
]
const COUNTRIES: CountryItem[] = [
  { name: 'United States', flag: '🇺🇸' }, { name: 'United Kingdom', flag: '🇬🇧' }, { name: 'Germany', flag: '🇩🇪' },
  { name: 'France', flag: '🇫🇷' }, { name: 'Brazil', flag: '🇧🇷' }, { name: 'Japan', flag: '🇯🇵' },
  { name: 'Spain', flag: '🇪🇸' }, { name: 'Italy', flag: '🇮🇹' }, { name: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', flag: '🇦🇺' }, { name: 'Russia', flag: '🇷🇺' }, { name: 'Mexico', flag: '🇲🇽' },
  { name: 'India', flag: '🇮🇳' }, { name: 'Netherlands', flag: '🇳🇱' }, { name: 'Poland', flag: '🇵🇱' },
  { name: 'Greece', flag: '🇬🇷' }, { name: 'China', flag: '🇨🇳' }, { name: 'Turkey', flag: '🇹🇷' },
  { name: 'Argentina', flag: '🇦🇷' }, { name: 'South Korea', flag: '🇰🇷' },
]
const LANGUAGES: LangItem[] = [
  { code: 'english', flag: '🇬🇧' }, { code: 'spanish', flag: '🇪🇸' }, { code: 'german', flag: '🇩🇪' },
  { code: 'french', flag: '🇫🇷' }, { code: 'russian', flag: '🇷🇺' }, { code: 'italian', flag: '🇮🇹' },
  { code: 'portuguese', flag: '🇧🇷' }, { code: 'chinese', flag: '🇨🇳' }, { code: 'japanese', flag: '🇯🇵' },
  { code: 'arabic', flag: '🇸🇦' }, { code: 'dutch', flag: '🇳🇱' }, { code: 'polish', flag: '🇵🇱' },
  { code: 'greek', flag: '🇬🇷' }, { code: 'turkish', flag: '🇹🇷' }, { code: 'korean', flag: '🇰🇷' },
  { code: 'hindi', flag: '🇮🇳' },
]
const SORT_OPTIONS = [
  { id: 'clickcount', label: 'Popular' },
  { id: 'votes', label: 'Top Voted' },
  { id: 'clicktrend', label: 'Trending' },
  { id: 'changetimestamp', label: 'New' },
  { id: 'random', label: 'Random' },
]
const QUALITY_FILTERS = [
  { id: '', label: 'Any Quality' },
  { id: '128', label: '128+ kbps' },
  { id: '192', label: '192+ kbps' },
  { id: '320', label: '320 kbps (HD)' },
]

export function RadioTab() {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)
  const [nameQuery, setNameQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [country, setCountry] = useState('')
  const [language, setLanguage] = useState('')
  const [sortBy, setSortBy] = useState('clickcount')
  const [minBitrate, setMinBitrate] = useState('')
  const [taggingStation, setTaggingStation] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const hasFilters = !!(genre || country || language || minBitrate)

  useEffect(() => {
    getTopStations(60).then(s => { setStations(s); setLoading(false) })
  }, [])

  const doSearch = async () => {
    setLoading(true)
    const filters: RadioFilters = {}
    if (nameQuery.trim()) filters.name = nameQuery.trim()
    if (genre) filters.tag = genre
    if (country) filters.country = country
    if (language) filters.language = language
    if (!filters.name && !filters.tag && !filters.country && !filters.language) {
      setStations(await getTopStations(60))
    } else {
      setStations(await advancedSearch(filters, 60))
    }
    setLoading(false)
  }

  const clearAll = () => {
    setGenre(''); setCountry(''); setLanguage(''); setSortBy('clickcount'); setMinBitrate(''); setNameQuery('')
    setLoading(true)
    getTopStations(60).then(s => { setStations(s); setLoading(false) })
  }

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(doSearch, 300)
    return () => clearTimeout(timer.current)
  }, [genre, country, language, minBitrate])

  return (
    <div className="pb-4">
      <div className="px-4 md:px-6 pt-6 md:pt-10 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold">Radio</h1>
        <p className="text-sm text-text-muted mt-1">30,000+ stations · 237 countries · 620 languages</p>
      </div>

      {/* Search */}
      <form className="px-4 md:px-6 my-3" onSubmit={e => { e.preventDefault(); doSearch() }}>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5">
          <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="search" placeholder="Station name..." className="flex-1 bg-transparent outline-none text-sm placeholder-text-dim" value={nameQuery} onChange={e => setNameQuery(e.target.value)} />
        </div>
      </form>

      {/* Sort + Quality */}
      <div className="px-4 md:px-6 mb-2 space-y-2">
        <div>
          <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Sort by</div>
          <div className="flex gap-1 overflow-x-auto snap-x md:flex-wrap md:overflow-visible">
            {SORT_OPTIONS.map(s => (
              <button key={s.id} onClick={() => { setSortBy(s.id); doSearch() }}
                className={`flex-shrink-0 snap-start text-[11px] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${sortBy === s.id ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Quality</div>
          <div className="flex gap-1">
            {QUALITY_FILTERS.map(q => (
              <button key={q.id} onClick={() => setMinBitrate(minBitrate === q.id ? '' : q.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${minBitrate === q.id ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex gap-1.5 px-4 md:px-6 mb-2 flex-wrap">
          {genre && <Chip label={`${GENRES.find(g => g.tag === genre)?.icon || ''} ${genre}`} onRemove={() => setGenre('')} />}
          {country && <Chip label={`${COUNTRIES.find(c => c.name === country)?.flag || ''} ${country}`} onRemove={() => setCountry('')} />}
          {language && <Chip label={`${LANGUAGES.find(l => l.code === language)?.flag || ''} ${language}`} onRemove={() => setLanguage('')} />}
          {minBitrate && <Chip label={`${minBitrate}+ kbps`} onRemove={() => setMinBitrate('')} />}
          <button onClick={clearAll} className="text-[11px] text-text-muted hover:text-text px-2 py-1">Clear</button>
        </div>
      )}

      {/* Always-visible filters on desktop, scrollable on mobile */}
      <div className="px-4 md:px-6 mb-3 space-y-2">
        {/* Genre row */}
        <div>
          <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Genre</div>
          <div className="flex gap-1 overflow-x-auto pb-1 snap-x md:flex-wrap md:overflow-visible">
            {GENRES.map(g => (
              <button key={g.tag} onClick={() => setGenre(genre === g.tag ? '' : g.tag)}
                className={`flex-shrink-0 snap-start flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${genre === g.tag ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
                <span>{g.icon}</span>{g.tag}<span className="text-text-dim text-[9px]">{g.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Country row */}
        <div>
          <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Country</div>
          <div className="flex gap-1 overflow-x-auto pb-1 snap-x md:flex-wrap md:overflow-visible">
            {COUNTRIES.map(c => (
              <button key={c.name} onClick={() => setCountry(country === c.name ? '' : c.name)}
                className={`flex-shrink-0 snap-start text-[11px] px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${country === c.name ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
                {c.flag} {c.name.length > 12 ? c.name.slice(0, 10) + '…' : c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Language row */}
        <div>
          <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Language</div>
          <div className="flex gap-1 overflow-x-auto pb-1 snap-x md:flex-wrap md:overflow-visible">
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setLanguage(language === l.code ? '' : l.code)}
                className={`flex-shrink-0 snap-start text-[11px] px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${language === l.code ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}>
                {l.flag} {l.code.charAt(0).toUpperCase() + l.code.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {(() => {
        const filtered = minBitrate ? stations.filter(s => (s.bitrate || 0) >= parseInt(minBitrate)) : stations

        if (loading) return <div className="flex items-center justify-center py-12"><Spinner /></div>

        return <>
        <div className="px-4 md:px-6 mb-1"><span className="text-xs text-text-muted">{filtered.length} stations found</span></div>

        {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-2">
          <span className="text-sm">No stations match your filters</span>
          <button onClick={clearAll} className="text-xs text-accent hover:underline">Clear all filters</button>
        </div>
      ) : (
        filtered.map(station => (
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
      </>
      })()}
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
