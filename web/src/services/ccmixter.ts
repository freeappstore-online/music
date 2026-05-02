import type { Track } from '../types'

const BASE = 'https://ccmixter.org/api/query'

function parseDuration(ps?: string): number {
  if (!ps) return 0
  const parts = ps.split(':')
  if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1])
  return 0
}

function mapTrack(t: any): Track | null {
  const file = t.files?.find((f: any) => f.file_format_info?.mime_type?.includes('audio'))
  if (!file?.download_url) return null
  return {
    id: `ccmixter-${t.upload_id}`,
    title: t.upload_name || 'Untitled',
    artist: t.user_real_name || t.user_name || 'Unknown',
    duration: parseDuration(file.file_format_info?.ps),
    streamUrl: file.download_url,
    source: 'ccmixter',
  }
}

async function ccFetch(url: string): Promise<Track[]> {
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data.map(mapTrack).filter((t): t is Track => t !== null)
  } catch {
    return []
  }
}

export function getPopular(limit = 20): Promise<Track[]> {
  return ccFetch(`${BASE}?sort=rank&limit=${limit}&f=json`)
}

export function getRecent(limit = 20): Promise<Track[]> {
  return ccFetch(`${BASE}?sort=date&limit=${limit}&f=json`)
}

export function searchTracks(query: string, limit = 20): Promise<Track[]> {
  return ccFetch(`${BASE}?search=${encodeURIComponent(query)}&limit=${limit}&f=json`)
}

export function getByTag(tag: string, limit = 20): Promise<Track[]> {
  return ccFetch(`${BASE}?tags=${encodeURIComponent(tag)}&sort=rank&limit=${limit}&f=json`)
}
