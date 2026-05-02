import { useState } from 'react'
import type { Track, RadioStation } from '../../types'
import { getByGenre } from '../../services/jamendo'
import { getFeatured as getIAFeatured } from '../../services/archive'
import { getByGenre as getStationsByGenre } from '../../services/radio'
import { player } from '../../services/player'
import { TrackRow } from '../TrackRow'
import { StationRow } from '../StationRow'
import { Spinner } from '../ui/Spinner'

export const GENRES = ['pop', 'rock', 'electronic', 'jazz', 'classical', 'hiphop', 'ambient', 'metal', 'dance', 'oldies', '80s', 'blues']

const COLORS: Record<string, string> = {
  pop: 'from-pink-500 to-pink-900',
  rock: 'from-red-600 to-red-950',
  electronic: 'from-blue-500 to-blue-950',
  jazz: 'from-orange-500 to-orange-950',
  classical: 'from-amber-600 to-amber-950',
  hiphop: 'from-purple-500 to-purple-950',
  ambient: 'from-teal-500 to-teal-950',
  metal: 'from-gray-400 to-gray-800',
  dance: 'from-violet-500 to-violet-950',
  oldies: 'from-yellow-500 to-yellow-900',
  '80s': 'from-fuchsia-500 to-fuchsia-950',
  blues: 'from-indigo-500 to-indigo-950',
}

export function genreLabel(g: string) {
  return g === '80s' ? "80's" : g.charAt(0).toUpperCase() + g.slice(1)
}

export function GenreBrowser() {
  const [selected, setSelected] = useState<string | null>(null)
  const [content, setContent] = useState<{ tracks: Track[]; stations: RadioStation[] }>({ tracks: [], stations: [] })
  const [loading, setLoading] = useState(false)

  const handleGenre = async (genre: string) => {
    if (selected === genre) { setSelected(null); return }
    setSelected(genre)
    setLoading(true)
    setContent({ tracks: [], stations: [] })

    const [stations, jTracks, iaTracks] = await Promise.all([
      getStationsByGenre(genre, 20),
      getByGenre(genre, 20),
      getIAFeatured(genre, 8),
    ])
    const allTracks = [...jTracks, ...iaTracks]

    setContent({ tracks: allTracks, stations })
    setLoading(false)
  }

  return (
    <section>
      <h2 className="text-base font-bold px-4 md:px-6 mb-3 mt-6">Browse Genre</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 md:px-6">
        {GENRES.map(genre => (
          <button
            key={genre}
            className={`h-11 rounded-xl font-semibold text-[11px] bg-gradient-to-br ${COLORS[genre]} ${selected === genre ? 'ring-2 ring-accent' : ''} active:scale-95 transition-transform`}
            onClick={() => handleGenre(genre)}
          >
            {genreLabel(genre)}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-3">
          <div className="flex items-center justify-between px-4 md:px-6 mb-1">
            <h2 className="text-sm font-bold">{genreLabel(selected)}</h2>
            {content.tracks.length > 0 && (
              <button
                onClick={() => player.playTrack(content.tracks[0], content.tracks, 0)}
                className="text-[11px] text-accent font-semibold hover:underline"
              >
                Play All
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-6"><Spinner /></div>
          ) : content.tracks.length === 0 && content.stations.length === 0 ? (
            <p className="text-sm text-muted text-center py-6">No results for this genre</p>
          ) : (
            <>
              {content.tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={content.tracks} index={i} />)}
              {content.stations.map(s => <StationRow key={s.id} station={s} />)}
            </>
          )}
        </div>
      )}
    </section>
  )
}

type GenrePickerProps = {
  favGenre: string | null
  onPick: (genre: string) => void
}

export function GenrePicker({ favGenre, onPick }: GenrePickerProps) {
  return (
    <div className="px-4 md:px-6 mb-4">
      <div className="bg-surface border border-white/6 rounded-2xl p-3 md:p-4">
        <div className="text-xs font-semibold mb-2 text-muted">Pick your genre — one tap to play next time</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => onPick(g)}
              className={`h-10 rounded-xl text-xs font-semibold bg-gradient-to-br ${COLORS[g]} active:scale-95 transition-transform ${favGenre === g ? 'ring-2 ring-accent' : ''}`}
            >
              {genreLabel(g)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
