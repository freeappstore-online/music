import { useState } from 'react'
import { getByGenre } from '../../services/jamendo'
import { player } from '../../services/player'
import type { Track } from '../../types'
import { TrackRow } from '../TrackRow'
import { Spinner } from '../ui/Spinner'

type Mood = {
  id: string
  label: string
  icon: string
  color: string
  tags: string // Jamendo tags
}

const MOODS: Mood[] = [
  { id: 'happy', label: 'Happy', icon: '😊', color: 'from-yellow-400 to-orange-500', tags: 'happy' },
  { id: 'sad', label: 'Sad', icon: '😢', color: 'from-blue-400 to-blue-700', tags: 'sad' },
  { id: 'chill', label: 'Chill', icon: '😌', color: 'from-teal-400 to-cyan-700', tags: 'chill' },
  { id: 'energetic', label: 'Pump Up', icon: '🔥', color: 'from-red-500 to-orange-600', tags: 'energetic' },
  { id: 'romantic', label: 'Romantic', icon: '❤️', color: 'from-pink-400 to-rose-600', tags: 'romantic' },
  { id: 'focus', label: 'Focus', icon: '🎯', color: 'from-indigo-400 to-violet-700', tags: 'ambient' },
  { id: 'workout', label: 'Workout', icon: '💪', color: 'from-emerald-400 to-green-700', tags: 'workout' },
  { id: 'sleep', label: 'Sleep', icon: '🌙', color: 'from-slate-400 to-slate-700', tags: 'relaxation' },
]

const OCCASIONS: Mood[] = [
  { id: 'party', label: 'Party', icon: '🎉', color: 'from-fuchsia-500 to-purple-700', tags: 'party' },
  { id: 'christmas', label: 'Christmas', icon: '🎄', color: 'from-red-600 to-green-700', tags: 'christmas' },
  { id: 'birthday', label: 'Birthday', icon: '🎂', color: 'from-pink-500 to-amber-500', tags: 'celebration' },
  { id: 'summer', label: 'Summer', icon: '☀️', color: 'from-amber-400 to-orange-500', tags: 'summer' },
  { id: 'road', label: 'Road Trip', icon: '🚗', color: 'from-sky-400 to-blue-600', tags: 'road+trip' },
  { id: 'morning', label: 'Morning', icon: '🌅', color: 'from-amber-300 to-rose-400', tags: 'morning' },
  { id: 'dinner', label: 'Dinner', icon: '🍷', color: 'from-amber-700 to-red-900', tags: 'lounge' },
  { id: 'study', label: 'Study', icon: '📚', color: 'from-emerald-500 to-teal-700', tags: 'study' },
]

export function MoodGrid() {
  const [selected, setSelected] = useState<Mood | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)

  const handleMood = async (mood: Mood) => {
    if (selected?.id === mood.id) { setSelected(null); setTracks([]); return }
    setSelected(mood)
    setLoading(true)
    const t = await getByGenre(mood.tags, 20)
    setTracks(t)
    setLoading(false)
    // Auto-play first track
    if (t.length > 0) player.playTrack(t[0], t, 0)
  }

  return (
    <section>
      <h2 className="text-base font-bold px-4 md:px-6 mb-3 mt-6">Moods</h2>
      <div className="flex gap-2 overflow-x-auto px-4 md:px-6 pb-2 snap-x">
        {MOODS.map(m => (
          <MoodButton key={m.id} mood={m} active={selected?.id === m.id} onClick={() => handleMood(m)} />
        ))}
      </div>

      <h2 className="text-base font-bold px-4 md:px-6 mb-3 mt-4">Occasions</h2>
      <div className="flex gap-2 overflow-x-auto px-4 md:px-6 pb-2 snap-x">
        {OCCASIONS.map(m => (
          <MoodButton key={m.id} mood={m} active={selected?.id === m.id} onClick={() => handleMood(m)} />
        ))}
      </div>

      {selected && (
        <div className="mt-4">
          <div className="flex items-center justify-between px-4 md:px-6 mb-2">
            <h2 className="text-sm font-bold">{selected.icon} {selected.label}</h2>
            {tracks.length > 0 && (
              <button onClick={() => player.playTrack(tracks[0], tracks, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-6"><Spinner /></div>
          ) : tracks.length === 0 ? (
            <p className="text-sm text-text-muted px-4 md:px-6 py-4">No tracks found for this mood.</p>
          ) : (
            tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)
          )}
        </div>
      )}
    </section>
  )
}

function MoodButton({ mood, active, onClick }: { mood: Mood; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 snap-start flex flex-col items-center gap-1.5 w-20 py-3 rounded-xl bg-gradient-to-br ${mood.color} transition-transform active:scale-95 ${active ? 'ring-2 ring-accent' : ''}`}
    >
      <span className="text-lg">{mood.icon}</span>
      <span className="text-[11px] font-semibold">{mood.label}</span>
    </button>
  )
}
