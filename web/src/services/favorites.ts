import type { Track, RadioStation } from '../types'

const TRACKS_KEY = 'fm-favorite-tracks'
const STATIONS_KEY = 'fm-favorite-stations'

export function getFavoriteTracks(): Track[] {
  try {
    return JSON.parse(localStorage.getItem(TRACKS_KEY) || '[]')
  } catch { return [] }
}

export function getFavoriteStations(): RadioStation[] {
  try {
    return JSON.parse(localStorage.getItem(STATIONS_KEY) || '[]')
  } catch { return [] }
}

export function isTrackFavorite(id: string): boolean {
  return getFavoriteTracks().some(t => t.id === id)
}

export function isStationFavorite(id: string): boolean {
  return getFavoriteStations().some(s => s.id === id)
}

export function toggleTrackFavorite(track: Track): boolean {
  const tracks = getFavoriteTracks()
  const idx = tracks.findIndex(t => t.id === track.id)
  if (idx >= 0) {
    tracks.splice(idx, 1)
    localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks))
    return false
  } else {
    tracks.unshift(track)
    localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks))
    return true
  }
}

export function toggleStationFavorite(station: RadioStation): boolean {
  const stations = getFavoriteStations()
  const idx = stations.findIndex(s => s.id === station.id)
  if (idx >= 0) {
    stations.splice(idx, 1)
    localStorage.setItem(STATIONS_KEY, JSON.stringify(stations))
    return false
  } else {
    stations.unshift(station)
    localStorage.setItem(STATIONS_KEY, JSON.stringify(stations))
    return true
  }
}
