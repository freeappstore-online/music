import { useEffect, useState } from 'react'
import { getTrending, getByGenre } from '../services/jamendo'
import type { Track } from '../types'
import { player } from '../services/player'
import { TrackRow } from './TrackRow'

const GENRES = ['electronic', 'rock', 'jazz', 'hiphop', 'classical', 'ambient', 'pop', 'metal']
const GENRE_COLORS: Record<string, string> = {
  electronic: 'from-blue-600/70 to-blue-600/30',
  rock: 'from-red-600/70 to-red-600/30',
  jazz: 'from-orange-500/70 to-orange-500/30',
  hiphop: 'from-purple-600/70 to-purple-600/30',
  classical: 'from-amber-700/70 to-amber-700/30',
  ambient: 'from-teal-600/70 to-teal-600/30',
  pop: 'from-pink-500/70 to-pink-500/30',
  metal: 'from-gray-600/70 to-gray-600/30',
}

export function HomeTab() {
  const [trending, setTrending] = useState<Track[]>([])
  const [genreTracks, setGenreTracks] = useState<Track[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrending(20).then(t => { setTrending(t); setLoading(false) })
  }, [])

  const handleGenre = async (genre: string) => {
    if (selectedGenre === genre) { setSelectedGenre(null); setGenreTracks([]); return }
    setSelectedGenre(genre)
    setGenreTracks([])
    const tracks = await getByGenre(genre, 30)
    setGenreTracks(tracks)
  }

  return (
    <div className="pb-4">
      <h1 className="text-2xl font-bold px-4 pt-4 pb-3">FreeMusic</h1>

      {/* Trending */}
      <h2 className="text-lg font-semibold px-4 mb-2">Trending This Week</h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x">
          {trending.map((track, i) => (
            <button
              key={track.id}
              className="flex-shrink-0 w-36 snap-start"
              onClick={() => player.playTrack(track, trending, i)}
            >
              <div className="w-36 h-36 rounded-lg overflow-hidden bg-[var(--surface)] mb-1.5">
                {track.artworkUrl ? (
                  <img src={track.artworkUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--accent)]">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
                  </div>
                )}
              </div>
              <div className="text-xs font-medium truncate">{track.title}</div>
              <div className="text-xs text-[var(--text-muted)] truncate">{track.artist}</div>
            </button>
          ))}
        </div>
      )}

      {/* Genres */}
      <h2 className="text-lg font-semibold px-4 mb-2 mt-2">Browse by Genre</h2>
      <div className="grid grid-cols-2 gap-2 px-4">
        {GENRES.map(genre => (
          <button
            key={genre}
            className={`h-14 rounded-xl font-semibold text-sm bg-gradient-to-br ${GENRE_COLORS[genre]} ${selectedGenre === genre ? 'ring-2 ring-[var(--accent)]' : ''}`}
            onClick={() => handleGenre(genre)}
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </button>
        ))}
      </div>

      {/* Genre tracks */}
      {selectedGenre && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold px-4 mb-1">{selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)}</h2>
          {genreTracks.length === 0 ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            genreTracks.map((track, i) => (
              <TrackRow key={track.id} track={track} queue={genreTracks} index={i} />
            ))
          )}
        </div>
      )}

      {/* Sources */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold mb-1">Sources</h2>
        <p className="text-xs text-[var(--text-muted)] mb-2">All music is Creative Commons or public domain. Free forever, no ads.</p>
        <div className="flex gap-2">
          {['Jamendo', 'Internet Archive', 'Radio Browser'].map(s => (
            <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
