import type { Track, RadioStation } from '../types'

const TRACKS_KEY = 'fm-favorite-tracks'
const STATIONS_KEY = 'fm-favorite-stations'
const GENRE_KEY = 'fm-favorite-genre'
const BLACKLIST_TRACKS_KEY = 'fm-blacklist-tracks'
const BLACKLIST_STATIONS_KEY = 'fm-blacklist-stations'

// ===== Favorites =====

export function getFavoriteTracks(): Track[] {
  try { return JSON.parse(localStorage.getItem(TRACKS_KEY) || '[]') } catch { return [] }
}

export function getFavoriteStations(): RadioStation[] {
  try { return JSON.parse(localStorage.getItem(STATIONS_KEY) || '[]') } catch { return [] }
}

export function isTrackFavorite(id: string): boolean {
  return getFavoriteTracks().some(t => t.id === id)
}

export function isStationFavorite(id: string): boolean {
  return getFavoriteStations().some(s => s.id === id)
}

export function toggleTrackFavorite(track: Track): boolean {
  // Remove from blacklist if it was there
  unblacklistTrack(track.id)
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
  unblacklistStation(station.id)
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

// ===== Blacklist =====

export function getBlacklistedTrackIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(BLACKLIST_TRACKS_KEY) || '[]')) } catch { return new Set() }
}

export function getBlacklistedStationIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(BLACKLIST_STATIONS_KEY) || '[]')) } catch { return new Set() }
}

export function isTrackBlacklisted(id: string): boolean {
  return getBlacklistedTrackIds().has(id)
}

export function isStationBlacklisted(id: string): boolean {
  return getBlacklistedStationIds().has(id)
}

export function blacklistTrack(track: Track): void {
  // Remove from favorites if it was there
  const favs = getFavoriteTracks()
  const filtered = favs.filter(t => t.id !== track.id)
  if (filtered.length !== favs.length) localStorage.setItem(TRACKS_KEY, JSON.stringify(filtered))

  const ids = getBlacklistedTrackIds()
  ids.add(track.id)
  localStorage.setItem(BLACKLIST_TRACKS_KEY, JSON.stringify([...ids]))
}

export function blacklistStation(station: RadioStation): void {
  const favs = getFavoriteStations()
  const filtered = favs.filter(s => s.id !== station.id)
  if (filtered.length !== favs.length) localStorage.setItem(STATIONS_KEY, JSON.stringify(filtered))

  const ids = getBlacklistedStationIds()
  ids.add(station.id)
  localStorage.setItem(BLACKLIST_STATIONS_KEY, JSON.stringify([...ids]))
}

function unblacklistTrack(id: string): void {
  const ids = getBlacklistedTrackIds()
  if (ids.delete(id)) localStorage.setItem(BLACKLIST_TRACKS_KEY, JSON.stringify([...ids]))
}

function unblacklistStation(id: string): void {
  const ids = getBlacklistedStationIds()
  if (ids.delete(id)) localStorage.setItem(BLACKLIST_STATIONS_KEY, JSON.stringify([...ids]))
}

export function unblacklist(id: string): void {
  unblacklistTrack(id)
  unblacklistStation(id)
}

export function getBlacklistCount(): number {
  return getBlacklistedTrackIds().size + getBlacklistedStationIds().size
}

// ===== Filters =====

export function filterTracks(tracks: Track[]): Track[] {
  const bl = getBlacklistedTrackIds()
  return bl.size === 0 ? tracks : tracks.filter(t => !bl.has(t.id))
}

export function filterStations(stations: RadioStation[]): RadioStation[] {
  const bl = getBlacklistedStationIds()
  return bl.size === 0 ? stations : stations.filter(s => !bl.has(s.id))
}

// ===== Genre =====

export function getFavoriteGenre(): string | null {
  return localStorage.getItem(GENRE_KEY)
}

export function setFavoriteGenre(genre: string) {
  localStorage.setItem(GENRE_KEY, genre)
}
