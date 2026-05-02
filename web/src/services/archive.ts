import type { Track } from '../types'

const BASE = 'https://archive.org'

export async function searchTracks(query: string, limit = 10): Promise<Track[]> {
  try {
  const url = `${BASE}/advancedsearch.php?q=${encodeURIComponent(query)}+mediatype:audio&fl[]=identifier,title,creator&rows=${limit}&output=json`
  const res = await fetch(url)
  const data = await res.json()
  const items = data?.response?.docs || []

  const results: Track[] = []
  await Promise.all(
    items.slice(0, 8).map(async (item: any) => {
      try {
        const r = await fetch(`${BASE}/metadata/${item.identifier}`)
        const meta = await r.json()
        const audioFiles = (meta.files || []).filter(
          (f: any) => f.format === 'VBR MP3' || f.format === 'MP3' || f.name?.endsWith('.mp3')
        )
        for (const file of audioFiles.slice(0, 3)) {
          results.push({
            id: `ia-${item.identifier}-${file.name}`,
            title: file.title || file.name?.replace('.mp3', '') || item.title,
            artist: item.creator || 'Unknown Artist',
            album: item.title,
            duration: parseDuration(file.length),
            streamUrl: `${BASE}/download/${item.identifier}/${encodeURIComponent(file.name)}`,
            artworkUrl: `${BASE}/services/img/${item.identifier}`,
            source: 'internetarchive',
          })
        }
      } catch {}
    })
  )
  return results
  } catch {
    return []
  }
}

export function getFeatured(genre: string, limit = 8): Promise<Track[]> {
  return searchTracks(`subject:${genre} format:mp3`, limit)
}

function parseDuration(length?: string): number {
  if (!length) return 0
  const parts = length.split(':')
  if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1])
  if (parts.length === 3) return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
  return parseInt(length) || 0
}
