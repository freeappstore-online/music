import type { Track } from '../types'

const BASE = 'https://archive.org'

interface ArchiveSearchDoc {
  identifier: string
  title?: string
  creator?: string | string[]
}

interface ArchiveSearchResponse {
  response?: {
    docs?: ArchiveSearchDoc[]
  }
}

interface ArchiveMetadataFile {
  format?: string
  name?: string
  title?: string
  length?: string
}

interface ArchiveMetadataResponse {
  files?: ArchiveMetadataFile[]
}

export async function searchTracks(query: string, limit = 10): Promise<Track[]> {
  try {
    const url = `${BASE}/advancedsearch.php?q=${encodeURIComponent(query)}+mediatype:audio&fl[]=identifier,title,creator&rows=${limit}&output=json`
    const res = await fetch(url)
    const data = await res.json() as ArchiveSearchResponse
    const items = data.response?.docs ?? []

    const results: Track[] = []
    await Promise.all(
      items.slice(0, 8).map(async (item) => {
        try {
          const metadataResponse = await fetch(`${BASE}/metadata/${item.identifier}`)
          const metadata = await metadataResponse.json() as ArchiveMetadataResponse
          const audioFiles = (metadata.files ?? []).filter(
            (file) => file.format === 'VBR MP3' || file.format === 'MP3' || file.name?.endsWith('.mp3')
          )
          for (const file of audioFiles.slice(0, 3)) {
            if (!file.name) continue
            results.push({
              id: `ia-${item.identifier}-${file.name}`,
              title: file.title || file.name.replace('.mp3', '') || item.title || item.identifier,
              artist: Array.isArray(item.creator) ? item.creator.join(', ') : (item.creator || 'Unknown Artist'),
              album: item.title,
              duration: parseDuration(file.length),
              streamUrl: `${BASE}/download/${item.identifier}/${encodeURIComponent(file.name)}`,
              artworkUrl: `${BASE}/services/img/${item.identifier}`,
              source: 'internetarchive',
            })
          }
        } catch {
          return
        }
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
