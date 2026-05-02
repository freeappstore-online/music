import { useEffect, useState } from 'react'
import { getTrending, getByGenre, isAvailable } from '../services/jamendo'
import { getPopular as getCCPopular, getByTag } from '../services/ccmixter'
import { getTopStations, getByGenre as getStationsByGenre } from '../services/radio'
import type { Track, RadioStation } from '../types'
import { player } from '../services/player'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'

const GENRES = ['pop', 'rock', 'electronic', 'jazz', 'classical', 'hiphop', 'ambient', 'metal', 'dance', 'oldies', '80s', 'blues']
const GENRE_COLORS: Record<string, string> = {
  pop: 'from-pink-500/70 to-pink-500/30',
  rock: 'from-red-600/70 to-red-600/30',
  electronic: 'from-blue-600/70 to-blue-600/30',
  jazz: 'from-orange-500/70 to-orange-500/30',
  classical: 'from-amber-700/70 to-amber-700/30',
  hiphop: 'from-purple-600/70 to-purple-600/30',
  ambient: 'from-teal-600/70 to-teal-600/30',
  metal: 'from-gray-600/70 to-gray-600/30',
  dance: 'from-violet-500/70 to-violet-500/30',
  oldies: 'from-yellow-600/70 to-yellow-600/30',
  '80s': 'from-fuchsia-500/70 to-fuchsia-500/30',
  blues: 'from-indigo-600/70 to-indigo-600/30',
}

export function HomeTab() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [topStations, setTopStations] = useState<RadioStation[]>([])
  const [genreStations, setGenreStations] = useState<RadioStation[]>([])
  const [genreTracks, setGenreTracks] = useState<Track[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const jamendoOk = isAvailable()

  useEffect(() => {
    const load = async () => {
      const [jamendo, cc, s] = await Promise.all([
        jamendoOk ? getTrending(20) : Promise.resolve([]),
        getCCPopular(20),
        getTopStations(10),
      ])
      setTracks(jamendo.length > 0 ? jamendo : cc)
      setTopStations(s)
      setLoading(false)
    }
    load()
  }, [])

  const handleGenre = async (genre: string) => {
    if (selectedGenre === genre) { setSelectedGenre(null); setGenreStations([]); setGenreTracks([]); return }
    setSelectedGenre(genre)
    setGenreStations([])
    setGenreTracks([])
    const [stations, jTracks, ccTracks] = await Promise.all([
      getStationsByGenre(genre, 20),
      jamendoOk ? getByGenre(genre, 20) : Promise.resolve([]),
      getByTag(genre, 10),
    ])
    setGenreStations(stations)
    setGenreTracks(jTracks.length > 0 ? jTracks : ccTracks)
  }

  return (
    <div className="pb-4">
      <h1 className="text-2xl font-bold px-4 pt-4 pb-3">FreeMusic</h1>

      {/* Trending tracks (Jamendo) */}
      {tracks.length > 0 && (
        <>
          <h2 className="text-lg font-semibold px-4 mb-2">Trending Tracks</h2>
          <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x">
            {tracks.map((track, i) => (
              <button
                key={track.id}
                className="flex-shrink-0 w-36 snap-start text-left"
                onClick={() => player.playTrack(track, tracks, i)}
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
        </>
      )}

      {/* Popular Stations */}
      <h2 className="text-lg font-semibold px-4 mb-2 mt-1">Popular Stations</h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x">
          {topStations.map(station => (
            <button
              key={station.id}
              className="flex-shrink-0 w-28 snap-start text-center"
              onClick={() => player.playStation(station)}
            >
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-[var(--surface)] mb-1.5 flex items-center justify-center">
                {station.favicon ? (
                  <img src={station.favicon} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <svg className="w-8 h-8 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm-1 4h1v2H4V9zm1 4v2H4v-2h1z" clipRule="evenodd" /></svg>
                )}
              </div>
              <div className="text-xs font-medium truncate">{station.name}</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">{station.genre?.split(',')[0]}</div>
            </button>
          ))}
        </div>
      )}

      {/* Genres */}
      <h2 className="text-lg font-semibold px-4 mb-2 mt-2">Browse by Genre</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 px-4">
        {GENRES.map(genre => (
          <button
            key={genre}
            className={`h-12 rounded-xl font-semibold text-xs bg-gradient-to-br ${GENRE_COLORS[genre] || 'from-gray-500/70 to-gray-500/30'} ${selectedGenre === genre ? 'ring-2 ring-[var(--accent)]' : ''}`}
            onClick={() => handleGenre(genre)}
          >
            {genre === '80s' ? "80's" : genre.charAt(0).toUpperCase() + genre.slice(1)}
          </button>
        ))}
      </div>

      {/* Genre results */}
      {selectedGenre && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold px-4 mb-1">
            {selectedGenre === '80s' ? "80's" : selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Stations
          </h2>
          {genreStations.length === 0 && genreTracks.length === 0 ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {genreTracks.map((track, i) => (
                <TrackRow key={track.id} track={track} queue={genreTracks} index={i} />
              ))}
              {genreStations.map(station => (
                <StationRow key={station.id} station={station} />
              ))}
            </>
          )}
        </div>
      )}

      {/* Sources */}
      <div className="px-4 mt-6">
        <p className="text-xs text-[var(--text-muted)] mb-2">All music is Creative Commons or public domain. Free forever, no ads.</p>
        <div className="flex gap-2 flex-wrap">
          {['Radio Browser', 'Internet Archive', 'Jamendo'].map(s => (
            <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
