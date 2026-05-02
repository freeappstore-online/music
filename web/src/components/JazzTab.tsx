import { useState } from 'react'
import { ARTISTS, STYLES, INSTRUMENTS, MOODS, ERAS, getJazzTracks, getJazzRadio, searchJazz, type JazzCategory } from '../services/jazz'
import type { Track, RadioStation } from '../types'
import { player } from '../services/player'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'
import { Spinner } from './ui/Spinner'

type Section = 'artists' | 'styles' | 'instruments' | 'moods' | 'eras' | 'radio'

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'artists', label: 'Artists' },
  { id: 'styles', label: 'Styles' },
  { id: 'eras', label: 'Eras' },
  { id: 'instruments', label: 'Instruments' },
  { id: 'moods', label: 'Moods' },
  { id: 'radio', label: 'Radio' },
]

function getItems(section: Section): JazzCategory[] {
  switch (section) {
    case 'artists': return ARTISTS
    case 'styles': return STYLES
    case 'instruments': return INSTRUMENTS
    case 'moods': return MOODS
    case 'eras': return ERAS
    default: return []
  }
}

export function JazzTab() {
  const [section, setSection] = useState<Section>('artists')
  const [selected, setSelected] = useState<JazzCategory | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [stations, setStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [searching, setSearching] = useState(false)

  const handleSelect = async (cat: JazzCategory) => {
    if (selected?.id === cat.id) { setSelected(null); setTracks([]); return }
    setSelected(cat)
    setLoading(true)
    setSearchResults([])
    const t = await getJazzTracks(cat, 20)
    setTracks(t)
    setLoading(false)
    if (t.length > 0) player.playTrack(t[0], t, 0)
  }

  const handleRadio = async () => {
    setSection('radio')
    setSelected(null)
    setLoading(true)
    const s = await getJazzRadio(20)
    setStations(s)
    setLoading(false)
  }

  const doSearch = async () => {
    const q = searchQuery.trim()
    if (!q) return
    setSearching(true)
    setSelected(null)
    const t = await searchJazz(q, 20)
    setSearchResults(t)
    setSearching(false)
  }

  const items = getItems(section)

  return (
    <div className="pb-4">
      <div className="px-4 md:px-6 pt-6 md:pt-10 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold font-display italic">Jazz</h1>
        <p className="text-sm text-text-muted mt-1">The art of improvisation</p>
      </div>

      <form className="px-4 md:px-6 my-4" onSubmit={e => { e.preventDefault(); doSearch() }}>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5">
          <svg className="w-5 h-5 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="search"
            placeholder="Search jazz... (e.g. Take Five, Blue in Green)"
            className="flex-1 bg-transparent outline-none text-sm placeholder-text-dim"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {searching ? (
        <div className="flex items-center justify-center py-8"><Spinner /></div>
      ) : searchResults.length > 0 ? (
        <div className="mb-4">
          <div className="flex items-center justify-between px-4 md:px-6 mb-2">
            <h2 className="text-sm font-bold">Results for "{searchQuery}"</h2>
            <button onClick={() => player.playTrack(searchResults[0], searchResults, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>
          </div>
          {searchResults.map((t, i) => <TrackRow key={t.id} track={t} queue={searchResults} index={i} />)}
        </div>
      ) : (
        <>
          <div className="flex gap-1.5 overflow-x-auto px-4 md:px-6 pb-4 snap-x">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => { setSection(s.id); setSelected(null); setTracks([]); if (s.id === 'radio') handleRadio() }}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg snap-start transition-colors ${
                  section === s.id ? 'bg-accent text-base' : 'bg-white/4 text-text-muted hover:text-text'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Artist grid with portraits */}
          {section === 'artists' && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 px-4 md:px-6 mb-4">
              {items.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-colors ${
                    selected?.id === cat.id ? 'bg-accent/15 ring-1 ring-accent' : 'hover:bg-surface-hover'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10 bg-surface">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">{cat.icon}</div>
                    )}
                  </div>
                  <span className="text-xs font-semibold truncate w-full text-center">{cat.label}</span>
                  {cat.years && <span className="text-[9px] text-text-dim">{cat.years}</span>}
                </button>
              ))}
            </div>
          )}

          {/* Other categories */}
          {section !== 'radio' && section !== 'artists' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 md:px-6 mb-4">
              {items.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat)}
                  className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-left transition-colors ${
                    selected?.id === cat.id ? 'bg-accent/15 ring-1 ring-accent' : 'bg-surface hover:bg-surface-hover'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm font-medium truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8"><Spinner /></div>
          ) : selected && tracks.length > 0 ? (
            <div>
              <div className="flex items-center justify-between px-4 md:px-6 mb-2">
                <h2 className="text-sm font-bold">{selected.icon} {selected.label}</h2>
                <button onClick={() => player.playTrack(tracks[0], tracks, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>
              </div>
              {tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)}
            </div>
          ) : selected && !loading ? (
            <p className="text-sm text-text-muted text-center py-8">No tracks found for {selected.label}</p>
          ) : null}

          {section === 'radio' && !loading && stations.length > 0 && (
            <div>
              <h2 className="text-sm font-bold px-4 md:px-6 mb-2">Jazz Radio Stations</h2>
              {stations.map(s => <StationRow key={s.id} station={s} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
