import { useEffect, useState } from 'react'
import { getTrending, getByGenre } from '../services/jamendo'
import { getFeatured as getIAFeatured, getFreeMusicArchive } from '../services/archive'
import { getTopStations, getByGenre as getStationsByGenre } from '../services/radio'
import { getSomaFMChannels } from '../services/somafm'
import { getFavoriteTracks, getFavoriteStations, getFavoriteGenre, setFavoriteGenre } from '../services/favorites'
import type { Track, RadioStation } from '../types'
import { player } from '../services/player'
import { Spinner } from './ui/Spinner'
import { QuickPlayCards } from './home/QuickPlayCards'
import { TrackGrid, StationGrid } from './home/MediaGrid'
import { GenreBrowser, GenrePicker } from './home/GenreBrowser'
import { MoodGrid } from './home/MoodGrid'

export function HomeTab() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [classical, setClassical] = useState<Track[]>([])
  const [fma, setFma] = useState<Track[]>([])
  const [topStations, setTopStations] = useState<RadioStation[]>([])
  const [somaStations, setSomaStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)
  const [showGenrePicker, setShowGenrePicker] = useState(false)

  const favTracks = getFavoriteTracks()
  const favStations = getFavoriteStations()
  const favGenre = getFavoriteGenre()

  useEffect(() => {
    const load = async () => {
      const [jamendo, stations, ia, fmaResult, soma] = await Promise.all([
        getTrending(20),
        getTopStations(12),
        getIAFeatured('classical', 10),
        getFreeMusicArchive(10),
        getSomaFMChannels(),
      ])
      setTracks(jamendo)
      setTopStations(stations)
      setClassical(ia)
      setFma(fmaResult)
      setSomaStations(soma)
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
      <div className="px-4 md:px-6 pt-6 md:pt-10 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold md:hidden">FreeMusic</h1>
        <p className="text-sm text-text-muted mt-1">One tap. Your music. Right now.</p>
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
          <StationGrid stations={somaStations} title="SomaFM Curated Radio" />
          <StationGrid stations={topStations} title="Popular Stations" />
          <TrackGrid tracks={fma} title="Free Music Archive" showPlayAll />
          <TrackGrid tracks={classical} title="Classical & Archive" showPlayAll />
        </>
      )}

      <MoodGrid />

      <GenreBrowser />

      <div className="px-4 md:px-6 mt-8 pb-4">
        <p className="text-[10px] text-text-muted/60">Creative Commons & public domain music. Free forever.</p>
        <div className="flex items-center gap-3 mt-2">
          <a href="legal/privacy.html" target="_blank" className="text-[10px] text-text-dim hover:text-accent transition-colors">Privacy</a>
          <a href="legal/terms.html" target="_blank" className="text-[10px] text-text-dim hover:text-accent transition-colors">Terms</a>
          <a href="https://github.com/FreeMusicApp/freemusic" target="_blank" className="text-[10px] text-text-dim hover:text-accent transition-colors">GitHub</a>
        </div>
        <p className="text-[9px] text-text-dim mt-1">v{__APP_VERSION__} &middot; {__BUILD_TIME__.slice(0, 16).replace('T', ' ')}</p>
      </div>
    </div>
  )
}
