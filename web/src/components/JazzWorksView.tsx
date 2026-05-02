import { useState } from 'react'
import { JAZZ_WORKS, JAZZ_WORK_TYPES, searchJazzWork, type JazzWork, type JazzWorkType } from '../services/jazzworks'
import { player } from '../services/player'
import type { Track } from '../types'
import { TrackRow } from './TrackRow'
import { Spinner } from './ui/Spinner'

export function JazzWorksView() {
  const [typeFilter, setTypeFilter] = useState<JazzWorkType | 'all'>('all')
  const [selected, setSelected] = useState<JazzWork | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)

  const filtered = JAZZ_WORKS.filter(w => typeFilter === 'all' || w.type === typeFilter)

  const handleSelect = async (work: JazzWork) => {
    if (selected?.title === work.title) { setSelected(null); setTracks([]); return }
    setSelected(work)
    setLoading(true)
    const t = await searchJazzWork(work, 15)
    setTracks(t)
    if (t.length > 0) player.playTrack(t[0], t, 0)
    setLoading(false)
  }

  const minYear = 1930
  const maxYear = 1980
  const ytp = (year: number) => ((year - minYear) / (maxYear - minYear)) * 100

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto px-4 md:px-6 pb-3 snap-x">
        {JAZZ_WORK_TYPES.map(t => {
          const count = t.id === 'all' ? JAZZ_WORKS.length : JAZZ_WORKS.filter(w => w.type === t.id).length
          return (
            <button key={t.id} onClick={() => setTypeFilter(t.id)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg snap-start whitespace-nowrap ${typeFilter === t.id ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted'}`}>
              {t.icon} {t.label} ({count})
            </button>
          )
        })}
      </div>

      <div className="px-4 md:px-6">
        <div className="relative h-5 mb-1">
          {[1935, 1940, 1945, 1950, 1955, 1960, 1965, 1970, 1975].map(year => (
            <div key={year} className="absolute text-[7px] text-text-dim -translate-x-1/2" style={{ left: `${ytp(year)}%` }}>{year}</div>
          ))}
        </div>
        <div className="relative h-0.5 bg-white/6 rounded-full mb-3">
          {[1935, 1940, 1945, 1950, 1955, 1960, 1965, 1970, 1975].map(year => (
            <div key={year} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${ytp(year)}%` }} />
          ))}
        </div>

        {filtered.map(work => {
          const isSelected = selected?.title === work.title
          const typeInfo = JAZZ_WORK_TYPES.find(t => t.id === work.type)
          return (
            <div key={`${work.artist}-${work.title}`} className="relative h-8 mb-0.5">
              <button
                onClick={() => handleSelect(work)}
                className={`absolute flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg text-left transition-all max-w-[75%] ${isSelected ? 'bg-accent/20 ring-1 ring-accent' : 'hover:bg-white/6'}`}
                style={{ left: `${Math.max(Math.min(ytp(work.year), 65), 0)}%` }}
              >
                <span className="text-xs">{typeInfo?.icon}</span>
                <span className="text-[9px] font-medium truncate">{work.title}</span>
                <span className="text-[7px] text-text-dim whitespace-nowrap">{work.artist} {work.year}</span>
              </button>
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="mt-4">
          <div className="flex items-center justify-between px-4 md:px-6 mb-2">
            <div>
              <h2 className="text-sm font-bold">{selected.title}</h2>
              <p className="text-xs text-text-muted">{selected.artist} · {selected.year}</p>
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
