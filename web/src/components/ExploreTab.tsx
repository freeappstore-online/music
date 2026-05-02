import { useState } from 'react'
import { DiscoverTab } from './DiscoverTab'
import { ClassicalTab } from './ClassicalTab'
import { JazzTab } from './JazzTab'
import { TimelineView } from './TimelineView'

type Genre = 'discover' | 'classical' | 'jazz' | 'timeline'

const GENRES: { id: Genre; label: string; color: string }[] = [
  { id: 'discover', label: 'All', color: 'from-accent to-emerald-700' },
  { id: 'classical', label: 'Classical', color: 'from-amber-500 to-amber-800' },
  { id: 'jazz', label: 'Jazz', color: 'from-blue-500 to-indigo-800' },
  { id: 'timeline', label: 'Timeline', color: 'from-purple-500 to-pink-700' },
]

export function ExploreTab() {
  const [genre, setGenre] = useState<Genre>('discover')

  return (
    <div>
      {/* Genre selector */}
      <div className="flex gap-2 px-4 md:px-6 pt-6 md:pt-10 pb-2">
        {GENRES.map(g => (
          <button
            key={g.id}
            onClick={() => setGenre(g.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              genre === g.id
                ? `bg-gradient-to-r ${g.color} text-white shadow-lg`
                : 'bg-surface text-text-muted hover:text-text'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={genre === 'discover' ? '' : 'hidden'}><DiscoverTab /></div>
      <div className={genre === 'classical' ? '' : 'hidden'}><ClassicalTab /></div>
      <div className={genre === 'jazz' ? '' : 'hidden'}><JazzTab /></div>
      <div className={genre === 'timeline' ? '' : 'hidden'}><TimelineView /></div>
    </div>
  )
}
