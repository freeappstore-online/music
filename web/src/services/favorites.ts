import type { Track } from '../types'

const TRACKS_KEY = 'fm-favorite-tracks'
const GENRE_KEY = 'fm-favorite-genre'
const BLACKLIST_TRACKS_KEY = 'fm-blacklist-tracks'

// ===== Favorites =====

export function getFavoriteTracks(): Track[] {
  try { return JSON.parse(localStorage.getItem(TRACKS_KEY) || '[]') } catch { return [] }
}

export function isTrackFavorite(id: string): boolean {
  return getFavoriteTracks().some(t => t.id === id)
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

// ===== Blacklist =====

export function getBlacklistedTrackIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(BLACKLIST_TRACKS_KEY) || '[]')) } catch { return new Set() }
}

export function isTrackBlacklisted(id: string): boolean {
  return getBlacklistedTrackIds().has(id)
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

function unblacklistTrack(id: string): void {
  const ids = getBlacklistedTrackIds()
  if (ids.delete(id)) localStorage.setItem(BLACKLIST_TRACKS_KEY, JSON.stringify([...ids]))
}

export function unblacklist(id: string): void {
  unblacklistTrack(id)
}

export function getBlacklistCount(): number {
  return getBlacklistedTrackIds().size
}

// ===== Filters =====

export function filterTracks(tracks: Track[]): Track[] {
  const bl = getBlacklistedTrackIds()
  return bl.size === 0 ? tracks : tracks.filter(t => !bl.has(t.id))
}

// ===== Genre =====

export function getFavoriteGenre(): string | null {
  return localStorage.getItem(GENRE_KEY)
}

export function setFavoriteGenre(genre: string) {
  localStorage.setItem(GENRE_KEY, genre)
}
