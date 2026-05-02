import { useState } from 'react'
import { DiscoverTab } from './DiscoverTab'
import { ClassicalTab } from './ClassicalTab'
import { JazzTab } from './JazzTab'
import { BluesTab } from './BluesTab'
import { PopTab } from './PopTab'
import { RockTab } from './RockTab'

type Genre = 'discover' | 'classical' | 'jazz' | 'blues' | 'pop' | 'rock'

const GENRES: { id: Genre; label: string; color: string }[] = [
  { id: 'discover', label: 'All', color: 'from-accent to-emerald-700' },
  { id: 'classical', label: 'Classical', color: 'from-amber-500 to-amber-800' },
  { id: 'jazz', label: 'Jazz', color: 'from-blue-500 to-indigo-800' },
  { id: 'blues', label: 'Blues', color: 'from-red-600 to-red-900' },
  { id: 'rock', label: 'Rock', color: 'from-purple-600 to-purple-900' },
  { id: 'pop', label: 'Pop', color: 'from-pink-500 to-pink-800' },
]

export function ExploreTab() {
  const [genre, setGenre] = useState<Genre>('discover')

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto px-4 md:px-6 pt-6 md:pt-10 pb-2 snap-x md:overflow-visible">
        {GENRES.map(g => (
          <button
            key={g.id}
            onClick={() => setGenre(g.id)}
            className={`flex-shrink-0 md:flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all snap-start ${
              genre === g.id
                ? `bg-gradient-to-r ${g.color} text-white shadow-lg`
                : 'bg-surface text-text-muted hover:text-text'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className={genre === 'discover' ? '' : 'hidden'}><DiscoverTab /></div>
      <div className={genre === 'classical' ? '' : 'hidden'}><ClassicalTab /></div>
      <div className={genre === 'jazz' ? '' : 'hidden'}><JazzTab /></div>
      <div className={genre === 'blues' ? '' : 'hidden'}><BluesTab /></div>
      <div className={genre === 'rock' ? '' : 'hidden'}><RockTab /></div>
      <div className={genre === 'pop' ? '' : 'hidden'}><PopTab /></div>
    </div>
  )
}
