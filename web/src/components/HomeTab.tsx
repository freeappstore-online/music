import { useEffect, useState } from 'react'
import { getTrending, isAvailable } from '../services/jamendo'
import { getPopular as getCCPopular } from '../services/ccmixter'
import { getFeatured as getIAFeatured } from '../services/archive'
import { getTopStations, getByGenre as getStationsByGenre } from '../services/radio'
import { getFavoriteTracks, getFavoriteStations, getFavoriteGenre, setFavoriteGenre } from '../services/favorites'
import { getByGenre } from '../services/jamendo'
import { getByTag } from '../services/ccmixter'
import type { Track, RadioStation } from '../types'
import { player } from '../services/player'
import { Spinner } from './ui/Spinner'
import { QuickPlayCards } from './home/QuickPlayCards'
import { TrackGrid, StationGrid } from './home/MediaGrid'
import { GenreBrowser, GenrePicker } from './home/GenreBrowser'

export function HomeTab() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [classical, setClassical] = useState<Track[]>([])
  const [topStations, setTopStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)
  const [showGenrePicker, setShowGenrePicker] = useState(false)

  const favTracks = getFavoriteTracks()
  const favStations = getFavoriteStations()
  const favGenre = getFavoriteGenre()

  useEffect(() => {
    const load = async () => {
      const [jamendo, cc, stations, ia] = await Promise.all([
        isAvailable() ? getTrending(20) : Promise.resolve([]),
        getCCPopular(20),
        getTopStations(12),
        getIAFeatured('classical', 10),
      ])
      setTracks(jamendo.length > 0 ? jamendo : cc)
      setTopStations(stations)
      setClassical(ia)
      setLoading(false)
    }
    load()
  }, [])

  const playGenre = async (genre?: string) => {
    const g = genre || favGenre || 'electronic'
    if (genre) { setFavoriteGenre(genre); setShowGenrePicker(false) }
    const [stations, jTracks, ccTracks] = await Promise.all([
      getStationsByGenre(g, 10),
      isAvailable() ? getByGenre(g, 10) : Promise.resolve([]),
      getByTag(g, 10),
    ])
    const genreTracks = jTracks.length > 0 ? jTracks : ccTracks
    if (genreTracks.length > 0) {
      player.playTrack(genreTracks[0], genreTracks, 0)
    } else if (stations.length > 0) {
      player.playStation(stations[0])
    }
  }

  return (
    <div className="pb-4">
      <div className="px-4 md:px-6 pt-4 lg:pt-8 pb-1">
        <h1 className="text-2xl lg:text-3xl font-bold lg:hidden">FreeMusic</h1>
        <p className="text-xs md:text-sm text-muted mt-1">One tap. Your music. Right now.</p>
      </div>

      <QuickPlayCards
        favTracks={favTracks}
        favStations={favStations}
        topStations={topStations}
        tracks={tracks}
        favGenre={favGenre}
        onPickGenre={() => setShowGenrePicker(true)}
        onPlayGenre={() => playGenre()}
      />

      {showGenrePicker && (
        <GenrePicker favGenre={favGenre} onPick={(g) => playGenre(g)} />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12"><Spinner /></div>
      ) : (
        <>
          <TrackGrid tracks={tracks} title="Trending" showPlayAll />
          <StationGrid stations={topStations} title="Live Radio" />
          <TrackGrid tracks={classical} title="Classical & Archive" showPlayAll />
        </>
      )}

      <GenreBrowser />

      <div className="px-4 md:px-6 mt-8 pb-4">
        <p className="text-[10px] text-muted/60">Creative Commons & public domain music. Free forever.</p>
      </div>
    </div>
  )
}
