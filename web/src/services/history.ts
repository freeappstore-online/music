import type { Track, RadioStation } from '../types'

const KEY = 'fm-play-history'
const MAX = 50

export type HistoryEntry = {
  track?: Track
  station?: RadioStation
  playedAt: string
}

export function getHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function addToHistory(track?: Track, station?: RadioStation) {
  if (!track && !station) return
  const history = getHistory()
  // Remove duplicate
  const id = track?.id ?? station?.id
  const filtered = history.filter(h => (h.track?.id ?? h.station?.id) !== id)
  filtered.unshift({ track, station, playedAt: new Date().toISOString() })
  localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, MAX)))
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}
