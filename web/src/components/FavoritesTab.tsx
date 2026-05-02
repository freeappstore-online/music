import { useState, useEffect, useCallback } from 'react'
import { getFavoriteTracks, getFavoriteStations, getBlacklistedTrackIds, getBlacklistedStationIds, unblacklist, getBlacklistCount } from '../services/favorites'
import type { Track, RadioStation } from '../types'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'
import { HeartIcon } from './ui/Icons'

export function FavoritesTab() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [stations, setStations] = useState<RadioStation[]>([])
  const [blacklistCount, setBlacklistCount] = useState(0)
  const [showBlacklist, setShowBlacklist] = useState(false)
  const [blTrackIds, setBlTrackIds] = useState<string[]>([])
  const [blStationIds, setBlStationIds] = useState<string[]>([])

  const reload = useCallback(() => {
    setTracks(getFavoriteTracks())
    setStations(getFavoriteStations())
    setBlacklistCount(getBlacklistCount())
    if (showBlacklist) {
      setBlTrackIds([...getBlacklistedTrackIds()])
      setBlStationIds([...getBlacklistedStationIds()])
    }
  }, [showBlacklist])

  useEffect(() => {
    reload()
    const onFocus = () => reload()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [reload])

  useEffect(() => {
    const id = setInterval(reload, 2000)
    return () => clearInterval(id)
  }, [reload])

  const handleUnblacklist = (id: string) => {
    unblacklist(id)
    reload()
  }

  const empty = tracks.length === 0 && stations.length === 0

  return (
    <div className="pb-4">
      <h1 className="text-2xl font-bold px-4 pt-4 pb-3">Favorites</h1>

      {empty ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-muted">
          <HeartIcon filled={false} className="w-12 h-12" />
          <span className="text-sm font-medium">No favorites yet</span>
          <span className="text-xs text-center px-8">Tap the heart icon on any track or station to save it here.</span>
        </div>
      ) : (
        <>
          {tracks.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-4 mb-1">Tracks</h2>
              {tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)}
            </>
          )}
          {stations.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-4 mb-1 mt-4">Stations</h2>
              {stations.map(s => <StationRow key={s.id} station={s} />)}
            </>
          )}
        </>
      )}

      {/* Blacklist section */}
      {blacklistCount > 0 && (
        <div className="mt-8 px-4">
          <button
            onClick={() => { setShowBlacklist(!showBlacklist); if (!showBlacklist) { setBlTrackIds([...getBlacklistedTrackIds()]); setBlStationIds([...getBlacklistedStationIds()]) } }}
            className="flex items-center gap-2 text-xs font-semibold text-text-muted"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Blacklisted ({blacklistCount})
            <svg className={`w-3 h-3 transition-transform ${showBlacklist ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>

          {showBlacklist && (
            <div className="mt-2 space-y-1">
              {blTrackIds.map(id => (
                <div key={id} className="flex items-center justify-between py-2 px-3 bg-surface rounded-lg">
                  <span className="text-xs text-text-muted truncate flex-1">{id.replace(/^(jamendo|ia|ccmixter)-/, '')}</span>
                  <button
                    onClick={() => handleUnblacklist(id)}
                    className="text-[11px] text-accent font-semibold ml-2 hover:underline"
                  >
                    Restore
                  </button>
                </div>
              ))}
              {blStationIds.map(id => (
                <div key={id} className="flex items-center justify-between py-2 px-3 bg-surface rounded-lg">
                  <span className="text-xs text-text-muted truncate flex-1">{id.replace(/^radio-/, '')}</span>
                  <button
                    onClick={() => handleUnblacklist(id)}
                    className="text-[11px] text-accent font-semibold ml-2 hover:underline"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
