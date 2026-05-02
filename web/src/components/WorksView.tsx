import { useState } from 'react'
import { WORKS, WORK_TYPES, searchWork, type Work, type WorkType } from '../services/works'
import { player } from '../services/player'
import type { Track } from '../types'
import { TrackRow } from './TrackRow'
import { Spinner } from './ui/Spinner'

export function WorksView() {
  const [typeFilter, setTypeFilter] = useState<WorkType | 'all'>('all')
  const [composerFilter, setComposerFilter] = useState('')
  const [selected, setSelected] = useState<Work | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)

  const composers = [...new Set(WORKS.map(w => w.composer))].sort()
  const filtered = WORKS.filter(w =>
    (typeFilter === 'all' || w.type === typeFilter) &&
    (!composerFilter || w.composer === composerFilter)
  )

  const handleSelect = async (work: Work) => {
    if (selected?.title === work.title && selected?.composer === work.composer) {
      setSelected(null); setTracks([]); return
    }
    setSelected(work)
    setLoading(true)
    const t = await searchWork(work, 15)
    setTracks(t)
    if (t.length > 0) player.playTrack(t[0], t, 0)
    setLoading(false)
  }

  // Timeline scale
  const minYear = 1600
  const maxYear = 2000
  const ytp = (year: number) => Math.pow((year - minYear) / (maxYear - minYear), 1.8) * 100

  return (
    <div>
      {/* Filters */}
      <div className="px-4 md:px-6 mb-3">
        <div className="flex gap-1.5 overflow-x-auto pb-2 snap-x">
          <button onClick={() => setTypeFilter('all')} className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg snap-start ${typeFilter === 'all' ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted'}`}>All ({WORKS.length})</button>
          {WORK_TYPES.map(t => {
            const count = WORKS.filter(w => w.type === t.id).length
            if (count === 0) return null
            return (
              <button key={t.id} onClick={() => setTypeFilter(t.id)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg snap-start whitespace-nowrap ${typeFilter === t.id ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted'}`}>
                {t.icon} {t.label} ({count})
              </button>
            )
          })}
        </div>
        {/* Composer filter */}
        <select
          value={composerFilter}
          onChange={e => setComposerFilter(e.target.value)}
          className="mt-2 bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-text w-full"
        >
          <option value="">All Composers</option>
          {composers.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Timeline + list */}
      <div className="px-4 md:px-6">
        {/* Year markers */}
        <div className="relative h-5 mb-1">
          {[1650, 1700, 1750, 1800, 1850, 1900, 1950].map(year => (
            <div key={year} className="absolute text-[7px] text-text-dim -translate-x-1/2" style={{ left: `${ytp(year)}%` }}>{year}</div>
          ))}
        </div>
        <div className="relative h-0.5 bg-white/6 rounded-full mb-3">
          {[1650, 1700, 1750, 1800, 1850, 1900, 1950].map(year => (
            <div key={year} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${ytp(year)}%` }} />
          ))}
        </div>

        {/* Works list */}
        {filtered.map(work => {
          const isSelected = selected?.title === work.title && selected?.composer === work.composer
          const typeInfo = WORK_TYPES.find(t => t.id === work.type)
          return (
            <div key={`${work.composer}-${work.title}`} className="relative h-8 mb-0.5">
              <button
                onClick={() => handleSelect(work)}
                className={`absolute flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg text-left transition-all max-w-[70%] ${
                  isSelected ? 'bg-accent/20 ring-1 ring-accent' : 'hover:bg-white/6'
                }`}
                style={{ left: `${Math.min(ytp(work.year), 70)}%` }}
              >
                <span className="text-xs">{typeInfo?.icon}</span>
                <span className="text-[9px] font-medium truncate">{work.title}</span>
                <span className="text-[7px] text-text-dim whitespace-nowrap">{work.composer} {work.year}</span>
              </button>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">No works match the filters</p>
        )}
      </div>

      {/* Selected work tracks */}
      {selected && (
        <div className="mt-4">
          <div className="flex items-center justify-between px-4 md:px-6 mb-2">
            <div>
              <h2 className="text-sm font-bold">{selected.title}</h2>
              <p className="text-xs text-text-muted">{selected.composer} · {selected.year}{selected.key ? ` · ${selected.key}` : ''}</p>
            </div>
            {tracks.length > 0 && <button onClick={() => player.playTrack(tracks[0], tracks, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-6"><Spinner /></div>
          ) : tracks.length > 0 ? (
            tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)
          ) : (
            <p className="text-xs text-text-muted px-4 md:px-6 py-4">No recordings found</p>
          )}
        </div>
      )}
    </div>
  )
}
