import type { Track } from '../types'

const KEY = 'fm-playlists'

export type Playlist = {
  id: string
  name: string
  tracks: Track[]
  createdAt: string
}

function load(): Playlist[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function save(playlists: Playlist[]) {
  localStorage.setItem(KEY, JSON.stringify(playlists))
}

export function getPlaylists(): Playlist[] {
  return load()
}

export function createPlaylist(name: string): Playlist {
  const playlists = load()
  const pl: Playlist = { id: `pl-${Date.now()}`, name, tracks: [], createdAt: new Date().toISOString() }
  playlists.unshift(pl)
  save(playlists)
  return pl
}

export function deletePlaylist(id: string) {
  save(load().filter(p => p.id !== id))
}

export function addToPlaylist(playlistId: string, track: Track) {
  const playlists = load()
  const pl = playlists.find(p => p.id === playlistId)
  if (!pl) return
  if (pl.tracks.some(t => t.id === track.id)) return
  pl.tracks.push(track)
  save(playlists)
}

export function removeFromPlaylist(playlistId: string, trackId: string) {
  const playlists = load()
  const pl = playlists.find(p => p.id === playlistId)
  if (!pl) return
  pl.tracks = pl.tracks.filter(t => t.id !== trackId)
  save(playlists)
}
