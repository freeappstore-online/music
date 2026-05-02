import { useState, useEffect, useCallback } from 'react'
import { getFavoriteTracks, getFavoriteStations } from '../services/favorites'
import type { Track, RadioStation } from '../types'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'
import { HeartIcon } from './ui/Icons'

export function FavoritesTab() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [stations, setStations] = useState<RadioStation[]>([])

  const reload = useCallback(() => {
    setTracks(getFavoriteTracks())
    setStations(getFavoriteStations())
  }, [])

  // Reload when tab becomes visible
  useEffect(() => {
    reload()
    const onFocus = () => reload()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [reload])

  // Also reload periodically while visible
  useEffect(() => {
    const id = setInterval(reload, 2000)
    return () => clearInterval(id)
  }, [reload])

  const empty = tracks.length === 0 && stations.length === 0

  return (
    <div className="pb-4">
      <h1 className="text-2xl md:text-3xl font-bold px-4 md:px-6 pt-4 md:pt-8 pb-3">Favorites</h1>

      {empty ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted">
          <HeartIcon filled={false} className="w-12 h-12" />
          <span className="text-sm font-medium">No favorites yet</span>
          <span className="text-xs text-center px-8">Tap the heart icon on any track or station to save it here.</span>
        </div>
      ) : (
        <>
          {tracks.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-4 md:px-6 mb-1">Tracks</h2>
              {tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)}
            </>
          )}
          {stations.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-4 md:px-6 mb-1 mt-4">Stations</h2>
              {stations.map(s => <StationRow key={s.id} station={s} />)}
            </>
          )}
        </>
      )}
    </div>
  )
}
