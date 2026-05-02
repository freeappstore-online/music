import { useEffect, useState } from 'react'
import { getTrending, getByGenre, isAvailable } from '../services/jamendo'
import { getPopular as getCCPopular, getByTag } from '../services/ccmixter'
import { getFeatured as getIAFeatured } from '../services/archive'
import { getTopStations, getByGenre as getStationsByGenre } from '../services/radio'
import { getFavoriteTracks, getFavoriteStations, getFavoriteGenre, setFavoriteGenre } from '../services/favorites'
import type { Track, RadioStation } from '../types'
import { player } from '../services/player'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'

const GENRES = ['pop', 'rock', 'electronic', 'jazz', 'classical', 'hiphop', 'ambient', 'metal', 'dance', 'oldies', '80s', 'blues']
const GENRE_COLORS: Record<string, string> = {
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

export function HomeTab() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [classical, setClassical] = useState<Track[]>([])
  const [topStations, setTopStations] = useState<RadioStation[]>([])
  const [genreContent, setGenreContent] = useState<{ tracks: Track[]; stations: RadioStation[] }>({ tracks: [], stations: [] })
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showGenrePicker, setShowGenrePicker] = useState(false)
  const jamendoOk = isAvailable()

  const favTracks = getFavoriteTracks()
  const favStations = getFavoriteStations()
  const favGenre = getFavoriteGenre()

  useEffect(() => {
    const load = async () => {
      const [jamendo, cc, s, ia] = await Promise.all([
        jamendoOk ? getTrending(20) : Promise.resolve([]),
        getCCPopular(20),
        getTopStations(12),
        getIAFeatured('classical', 10),
      ])
      setTracks(jamendo.length > 0 ? jamendo : cc)
      setTopStations(s)
      setClassical(ia)
      setLoading(false)
    }
    load()
  }, [])

  // Quick play handlers
  const playRadio = () => {
    const stations = favStations.length > 0 ? favStations : topStations
    if (stations.length > 0) player.playStation(stations[0])
  }

  const playPlaylist = () => {
    if (favTracks.length > 0) {
      player.playTrack(favTracks[0], favTracks, 0)
    } else if (tracks.length > 0) {
      player.playTrack(tracks[0], tracks, 0)
    }
  }

  const playGenre = async (genre?: string) => {
    const g = genre || favGenre || 'electronic'
    if (genre) { setFavoriteGenre(genre); setShowGenrePicker(false) }
    const [stations, jTracks, ccTracks] = await Promise.all([
      getStationsByGenre(g, 10),
      jamendoOk ? getByGenre(g, 10) : Promise.resolve([]),
      getByTag(g, 10),
    ])
    const genreTracks = jTracks.length > 0 ? jTracks : ccTracks
    if (genreTracks.length > 0) {
      player.playTrack(genreTracks[0], genreTracks, 0)
    } else if (stations.length > 0) {
      player.playStation(stations[0])
    }
  }

  const handleGenreBrowse = async (genre: string) => {
    if (selectedGenre === genre) { setSelectedGenre(null); setGenreContent({ tracks: [], stations: [] }); return }
    setSelectedGenre(genre)
    setGenreContent({ tracks: [], stations: [] })
    const [stations, jTracks, ccTracks, iaTracks] = await Promise.all([
      getStationsByGenre(genre, 20),
      jamendoOk ? getByGenre(genre, 20) : Promise.resolve([]),
      getByTag(genre, 10),
      getIAFeatured(genre, 8),
    ])
    const allTracks = [...(jTracks.length > 0 ? jTracks : []), ...ccTracks, ...iaTracks]
    setGenreContent({
      tracks: allTracks.length > 0 ? allTracks : ccTracks,
      stations,
    })
  }

  const genreLabel = (g: string) => g === '80s' ? "80's" : g.charAt(0).toUpperCase() + g.slice(1)

  return (
    <div className="pb-4">
      {/* Header - bigger on desktop */}
      <div className="px-4 md:px-6 pt-4 md:pt-8 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold">FreeMusic</h1>
        <p className="text-xs md:text-sm text-muted mt-1">One tap. Your music. Right now.</p>
      </div>

      {/* ===== QUICK PLAY CARDS ===== */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 px-4 md:px-6 mb-6 mt-4">
        {/* Radio */}
        <button
          onClick={playRadio}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/60 to-emerald-900/30 border border-white/6 p-3 pt-4 pb-5 text-left group active:scale-[0.97] transition-transform"
        >
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
          </div>
          <svg className="w-6 h-6 mb-2 opacity-80" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm-1 4h1v2H4V9zm1 4v2H4v-2h1z" clipRule="evenodd" /></svg>
          <div className="text-xs font-bold">Radio</div>
          <div className="text-[10px] text-white/50 mt-0.5 leading-tight">
            {favStations.length > 0 ? `${favStations.length} saved` : 'Top stations'}
          </div>
        </button>

        {/* Playlist / Favorites */}
        <button
          onClick={playPlaylist}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/60 to-violet-900/30 border border-white/6 p-3 pt-4 pb-5 text-left group active:scale-[0.97] transition-transform"
        >
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
          </div>
          <svg className="w-6 h-6 mb-2 opacity-80" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
          <div className="text-xs font-bold">My Tracks</div>
          <div className="text-[10px] text-white/50 mt-0.5 leading-tight">
            {favTracks.length > 0 ? `${favTracks.length} saved` : 'Popular mix'}
          </div>
        </button>

        {/* Genre */}
        <button
          onClick={() => favGenre ? playGenre() : setShowGenrePicker(true)}
          onContextMenu={(e) => { e.preventDefault(); setShowGenrePicker(true) }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600/60 to-amber-900/30 border border-white/6 p-3 pt-4 pb-5 text-left group active:scale-[0.97] transition-transform"
        >
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
          </div>
          <svg className="w-6 h-6 mb-2 opacity-80" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
          <div className="text-xs font-bold">Genre</div>
          <div className="text-[10px] text-white/50 mt-0.5 leading-tight">
            {favGenre ? genreLabel(favGenre) : 'Pick genre'}
          </div>
        </button>
      </div>

      {/* Genre picker modal */}
      {showGenrePicker && (
        <div className="px-4 md:px-6 mb-4">
          <div className="bg-surface border border-white/6 rounded-2xl p-3 md:p-4">
            <div className="text-xs font-semibold mb-2 text-muted">Pick your genre — one tap to play next time</div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5">
              {GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => playGenre(g)}
                  className={`h-10 rounded-xl text-xs font-semibold bg-gradient-to-br ${GENRE_COLORS[g]} active:scale-95 transition-transform ${favGenre === g ? 'ring-2 ring-accent' : ''}`}
                >
                  {genreLabel(g)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== DISCOVER SECTION ===== */}

      {/* Trending tracks */}
      {tracks.length > 0 && (
        <>
          <div className="flex items-center justify-between px-4 md:px-6 mb-3 mt-2">
            <h2 className="text-sm md:text-base font-bold">Trending</h2>
            <button onClick={() => { if (tracks.length > 0) player.playTrack(tracks[0], tracks, 0) }} className="text-[11px] md:text-xs text-accent font-semibold hover:underline">Play All</button>
          </div>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x md:hidden">
            {tracks.map((track, i) => (
              <ArtworkCard key={track.id} track={track} onClick={() => player.playTrack(track, tracks, i)} />
            ))}
          </div>
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-4 px-6">
            {tracks.slice(0, 10).map((track, i) => (
              <ArtworkCard key={track.id} track={track} onClick={() => player.playTrack(track, tracks, i)} desktop />
            ))}
          </div>
        </>
      )}

      {/* Popular Stations */}
      {!loading && topStations.length > 0 && (
        <>
          <div className="flex items-center justify-between px-4 md:px-6 mb-3 mt-4">
            <h2 className="text-sm md:text-base font-bold">Live Radio</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x md:hidden">
            {topStations.map(station => (
              <StationThumb key={station.id} station={station} onClick={() => player.playStation(station)} />
            ))}
          </div>
          <div className="hidden md:grid grid-cols-5 lg:grid-cols-6 gap-4 px-6">
            {topStations.map(station => (
              <StationThumb key={station.id} station={station} onClick={() => player.playStation(station)} desktop />
            ))}
          </div>
        </>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Browse by Genre */}
      {/* Classical / Internet Archive */}
      {classical.length > 0 && (
        <>
          <div className="flex items-center justify-between px-4 md:px-6 mb-3 mt-4">
            <h2 className="text-sm md:text-base font-bold">Classical &amp; Archive</h2>
            <button onClick={() => { if (classical.length > 0) player.playTrack(classical[0], classical, 0) }} className="text-[11px] md:text-xs text-accent font-semibold hover:underline">Play All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x md:hidden">
            {classical.map((track, i) => (
              <ArtworkCard key={track.id} track={track} onClick={() => player.playTrack(track, classical, i)} />
            ))}
          </div>
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-4 px-6">
            {classical.slice(0, 10).map((track, i) => (
              <ArtworkCard key={track.id} track={track} onClick={() => player.playTrack(track, classical, i)} desktop />
            ))}
          </div>
        </>
      )}

      <h2 className="text-sm md:text-base font-bold px-4 md:px-6 mb-2 mt-4">Browse Genre</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 md:gap-2 px-4 md:px-6">
        {GENRES.map(genre => (
          <button
            key={genre}
            className={`h-11 rounded-xl font-semibold text-[11px] bg-gradient-to-br ${GENRE_COLORS[genre]} ${selectedGenre === genre ? 'ring-2 ring-accent' : ''} active:scale-95 transition-transform`}
            onClick={() => handleGenreBrowse(genre)}
          >
            {genreLabel(genre)}
          </button>
        ))}
      </div>

      {/* Genre results */}
      {selectedGenre && (
        <div className="mt-3">
          <div className="flex items-center justify-between px-4 mb-1">
            <h2 className="text-sm font-bold">{genreLabel(selectedGenre)}</h2>
            {genreContent.tracks.length > 0 && (
              <button onClick={() => player.playTrack(genreContent.tracks[0], genreContent.tracks, 0)} className="text-[11px] text-accent font-semibold">Play All</button>
            )}
          </div>
          {genreContent.tracks.length === 0 && genreContent.stations.length === 0 ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {genreContent.tracks.map((track, i) => (
                <TrackRow key={track.id} track={track} queue={genreContent.tracks} index={i} />
              ))}
              {genreContent.stations.map(station => (
                <StationRow key={station.id} station={station} />
              ))}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 md:px-6 mt-8 pb-4">
        <p className="text-[10px] text-muted/60">Creative Commons & public domain music. Free forever.</p>
      </div>
    </div>
  )
}

/* ===== Sub-components ===== */

function ArtworkCard({ track, onClick, desktop }: { track: Track; onClick: () => void; desktop?: boolean }) {
  return (
    <button className={`${desktop ? 'w-full' : 'flex-shrink-0 w-32 snap-start'} text-left group`} onClick={onClick}>
      <div className={`${desktop ? 'w-full aspect-square' : 'w-32 h-32'} rounded-xl overflow-hidden bg-white/4 mb-2 ring-1 ring-white/6 relative`}>
        {track.artworkUrl ? (
          <img src={track.artworkUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-transparent">
            <svg className="w-8 h-8 text-accent/40" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
          </div>
        )}
        {/* Hover play overlay (desktop) */}
        {desktop && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
            </div>
          </div>
        )}
      </div>
      <div className={`${desktop ? 'text-[13px]' : 'text-[11px]'} font-semibold truncate`}>{track.title}</div>
      <div className={`${desktop ? 'text-xs' : 'text-[10px]'} text-muted truncate`}>{track.artist}</div>
    </button>
  )
}

function StationThumb({ station, onClick, desktop }: { station: RadioStation; onClick: () => void; desktop?: boolean }) {
  return (
    <button className={`${desktop ? 'w-full' : 'flex-shrink-0 w-24 snap-start'} text-center group`} onClick={onClick}>
      <div className={`${desktop ? 'w-full aspect-square' : 'w-24 h-24'} rounded-xl overflow-hidden bg-white/4 mb-1.5 ring-1 ring-white/6 flex items-center justify-center relative`}>
        {station.favicon ? (
          <img src={station.favicon} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        ) : (
          <svg className="w-7 h-7 text-accent/40" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm-1 4h1v2H4V9zm1 4v2H4v-2h1z" clipRule="evenodd" /></svg>
        )}
        {desktop && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
            </div>
          </div>
        )}
      </div>
      <div className={`${desktop ? 'text-xs' : 'text-[10px]'} font-semibold truncate`}>{station.name}</div>
    </button>
  )
}
