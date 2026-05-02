import { useEffect, useState } from 'react'
import { SettingsModal } from './SettingsModal'
import { getTrending, getByGenre } from '../services/jamendo'
import { getTopStations, getByGenre as getStationsByGenre } from '../services/radio'
import { getSomaFMChannels } from '../services/somafm'
import { getFavoriteTracks, getFavoriteStations, getFavoriteGenre, setFavoriteGenre } from '../services/favorites'
import { getHistory } from '../services/history'
import type { Track, RadioStation } from '../types'
import { player } from '../services/player'
import { Spinner } from './ui/Spinner'
import { QuickPlayCards } from './home/QuickPlayCards'
import { TrackGrid, StationGrid } from './home/MediaGrid'
import { GenreBrowser, GenrePicker } from './home/GenreBrowser'
import { MoodGrid } from './home/MoodGrid'
import { TrackRow } from './TrackRow'

export function HomeTab() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [topStations, setTopStations] = useState<RadioStation[]>([])
  const [somaStations, setSomaStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)
  const [showGenrePicker, setShowGenrePicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const favTracks = getFavoriteTracks()
  const favStations = getFavoriteStations()
  const favGenre = getFavoriteGenre()
  const history = getHistory()
  const recentTracks = history.filter(h => h.track).map(h => h.track!).slice(0, 5)

  useEffect(() => {
    // Fast: load Jamendo trending first (fastest API)
    getTrending(20).then(t => { setTracks(t); setLoading(false) })
    // Background: stations + SomaFM
    getTopStations(10).then(setTopStations)
    getSomaFMChannels().then(setSomaStations)
  }, [])

  const playGenre = async (genre?: string) => {
    const g = genre || favGenre || 'electronic'
    if (genre) { setFavoriteGenre(genre); setShowGenrePicker(false) }
    const [stations, jTracks] = await Promise.all([
      getStationsByGenre(g, 10),
      getByGenre(g, 10),
    ])
    if (jTracks.length > 0) {
      player.playTrack(jTracks[0], jTracks, 0)
    } else if (stations.length > 0) {
      player.playStation(stations[0])
    }
  }

  return (
    <div className="pb-4">
      <div className="px-4 md:px-6 pt-6 md:pt-10 pb-1">
        <div className="flex items-center justify-between md:hidden">
          <h1 className="text-2xl font-bold">FreeMusic</h1>
          <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-white/4" aria-label="Settings">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
        <p className="text-sm text-text-muted mt-1">One tap. Your music. Right now.</p>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Quick play */}
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

      {/* Continue listening (if history exists) */}
      {recentTracks.length > 0 && (
        <section className="mb-2">
          <div className="flex items-center justify-between px-4 md:px-6 mb-2 mt-4">
            <h2 className="text-base font-bold">Continue Listening</h2>
          </div>
          {recentTracks.map((t, i) => <TrackRow key={`recent-${t.id}-${i}`} track={t} queue={recentTracks} index={i} />)}
        </section>
      )}

      {/* Moods & Occasions — high engagement, show early */}
      <MoodGrid />

      {/* Trending */}
      {loading ? (
        <div className="flex items-center justify-center py-8"><Spinner /></div>
      ) : (
        <TrackGrid tracks={tracks} title="Trending" showPlayAll />
      )}

      {/* Radio */}
      {somaStations.length > 0 && <StationGrid stations={somaStations} title="SomaFM · Ad-Free Radio" />}
      {topStations.length > 0 && <StationGrid stations={topStations} title="Popular Stations" />}

      {/* Genre browser */}
      <GenreBrowser />

      {/* Footer */}
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
