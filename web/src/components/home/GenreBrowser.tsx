import { useState } from 'react'
import type { Track, RadioStation } from '../../types'
import { isAvailable, getByGenre } from '../../services/jamendo'
import { getByTag } from '../../services/ccmixter'
import { getFeatured as getIAFeatured } from '../../services/archive'
import { getByGenre as getStationsByGenre } from '../../services/radio'
import { player } from '../../services/player'
import { TrackRow } from '../TrackRow'
import { StationRow } from '../StationRow'
import { Spinner } from '../ui/Spinner'

export const GENRES = ['pop', 'rock', 'electronic', 'jazz', 'classical', 'hiphop', 'ambient', 'metal', 'dance', 'oldies', '80s', 'blues']

const COLORS: Record<string, string> = {
  pop: 'from-pink-500/80 to-pink-500/20',
  rock: 'from-red-600/80 to-red-600/20',
  electronic: 'from-blue-500/80 to-blue-500/20',
  jazz: 'from-orange-500/80 to-orange-500/20',
  classical: 'from-amber-700/80 to-amber-700/20',
  hiphop: 'from-purple-500/80 to-purple-500/20',
  ambient: 'from-teal-500/80 to-teal-500/20',
  metal: 'from-gray-500/80 to-gray-500/20',
  dance: 'from-violet-500/80 to-violet-500/20',
  oldies: 'from-yellow-600/80 to-yellow-600/20',
  '80s': 'from-fuchsia-500/80 to-fuchsia-500/20',
  blues: 'from-indigo-500/80 to-indigo-500/20',
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

    const [stations, jTracks, ccTracks, iaTracks] = await Promise.all([
      getStationsByGenre(genre, 20),
      isAvailable() ? getByGenre(genre, 20) : Promise.resolve([]),
      getByTag(genre, 10),
      getIAFeatured(genre, 8),
    ])
    const allTracks = [...(jTracks.length > 0 ? jTracks : []), ...ccTracks, ...iaTracks]

    setContent({ tracks: allTracks, stations })
    setLoading(false)
  }

  return (
    <section>
      <h2 className="text-sm md:text-base font-bold px-4 md:px-6 mb-2 mt-4">Browse Genre</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 md:gap-2 px-4 md:px-6">
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
        <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5">
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
