import type { Track } from '../types'

const KEY = 'fm-play-history'
const MAX = 50

export type HistoryEntry = {
  track: Track
  playedAt: string
}

export function getHistory(): HistoryEntry[] {
  try {
    // Entries saved before radio moved to the Radio app may hold a station and no track.
    return (JSON.parse(localStorage.getItem(KEY) || '[]') as Partial<HistoryEntry>[]).filter((h): h is HistoryEntry => !!h.track)
  } catch { return [] }
}

export function addToHistory(track: Track) {
  const filtered = getHistory().filter(h => h.track.id !== track.id)
  filtered.unshift({ track, playedAt: new Date().toISOString() })
  localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, MAX)))
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}
