import { useEffect, useState } from 'react'
import { getTrending, getByGenre } from '../services/jamendo'
import { getFeatured as getIAFeatured } from '../services/archive'
import { getTopStations, getByGenre as getStationsByGenre } from '../services/radio'
import { getFavoriteTracks, getFavoriteStations, getFavoriteGenre, setFavoriteGenre } from '../services/favorites'
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
      const [jamendo, stations, ia] = await Promise.all([
        getTrending(20),
        getTopStations(12),
        getIAFeatured('classical', 10),
      ])
      setTracks(jamendo)
      setTopStations(stations)
      setClassical(ia)
      setLoading(false)
    }
    load()
  }, [])

  const playGenre = async (genre?: string) => {
    const g = genre || favGenre || 'electronic'
    if (genre) { setFavoriteGenre(genre); setShowGenrePicker(false) }
    const [stations, jTracks] = await Promise.all([
      getStationsByGenre(g, 10),
      getByGenre(g, 10),
    ])
    const genreTracks = jTracks
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
