import { useState, useEffect } from 'react'
import { getFavoriteTracks, getFavoriteStations } from '../services/favorites'
import type { Track, RadioStation } from '../types'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'
import { usePlayer } from '../hooks'

export function FavoritesTab() {
  const ps = usePlayer() // re-render when favorites change via play state
  const [tracks, setTracks] = useState<Track[]>([])
  const [stations, setStations] = useState<RadioStation[]>([])

  // Reload favorites every time tab is shown
  useEffect(() => {
    setTracks(getFavoriteTracks())
    setStations(getFavoriteStations())
  }, [ps]) // ps changes trigger re-check

  // Also poll on visibility
  useEffect(() => {
    const interval = setInterval(() => {
      setTracks(getFavoriteTracks())
      setStations(getFavoriteStations())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const empty = tracks.length === 0 && stations.length === 0

  return (
    <div className="pb-4">
      <h1 className="text-2xl font-bold px-4 pt-4 pb-3">Favorites</h1>

      {empty ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--text-muted)]">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span className="text-sm font-medium">No favorites yet</span>
          <span className="text-xs text-center px-8">Tap the heart icon on any track or station to save it here.</span>
        </div>
      ) : (
        <>
          {tracks.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-[var(--text-muted)] px-4 mb-1">TRACKS</h2>
              {tracks.map((track, i) => <TrackRow key={track.id} track={track} queue={tracks} index={i} />)}
            </>
          )}
          {stations.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-[var(--text-muted)] px-4 mb-1 mt-4">STATIONS</h2>
              {stations.map(station => <StationRow key={station.id} station={station} />)}
            </>
          )}
        </>
      )}
    </div>
  )
}
