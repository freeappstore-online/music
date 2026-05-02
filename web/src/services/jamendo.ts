import type { Track } from '../types'

const CLIENT_ID = 'b0f2e95e'
const BASE = 'https://api.jamendo.com/v3.0'

async function jamendoFetch(url: string): Promise<Track[]> {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return (data.results || []).map(mapTrack)
  } catch {
    return []
  }
}

export type TrackFilters = {
  search?: string
  tags?: string
  speed?: 'low' | 'medium' | 'high' | 'veryhigh'
  vocalinstrumental?: 'vocal' | 'instrumental'
  acousticelectric?: 'acoustic' | 'electric'
  lang?: string
  gender?: 'male' | 'female'
}

export function searchTracks(query: string, limit = 20): Promise<Track[]> {
  return jamendoFetch(`${BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}`)
}

export function advancedSearch(filters: TrackFilters, limit = 30): Promise<Track[]> {
  const params = new URLSearchParams()
  params.set('client_id', CLIENT_ID)
  params.set('format', 'json')
  params.set('limit', String(limit))
  params.set('include', 'musicinfo+stats')
  params.set('order', 'popularity_week')
  if (filters.search) params.set('search', filters.search)
  if (filters.tags) params.set('tags', filters.tags)
  if (filters.speed) params.set('speed', filters.speed)
  if (filters.vocalinstrumental) params.set('vocalinstrumental', filters.vocalinstrumental)
  if (filters.acousticelectric) params.set('acousticelectric', filters.acousticelectric)
  if (filters.lang) params.set('lang', filters.lang)
  if (filters.gender) params.set('gender', filters.gender)
  return jamendoFetch(`${BASE}/tracks/?${params}`)
}

export function getTrending(limit = 20): Promise<Track[]> {
  return jamendoFetch(`${BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&order=popularity_week`)
}

export function getByGenre(genre: string, limit = 20): Promise<Track[]> {
  return jamendoFetch(`${BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&tags=${encodeURIComponent(genre)}&order=popularity_week`)
}

export async function searchArtists(query: string, limit = 20): Promise<Track[]> {
  return jamendoFetch(`${BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&artist_name=${encodeURIComponent(query)}&order=popularity_week`)
}

function mapTrack(t: any): Track {
  const mi = t.musicinfo
  const st = t.stats
  return {
    id: `jamendo-${t.id}`,
    title: t.name,
    artist: t.artist_name,
    album: t.album_name,
    duration: t.duration,
    streamUrl: t.audio,
    artworkUrl: t.album_image || t.image,
    source: 'jamendo',
    lang: mi?.lang || undefined,
    gender: mi?.gender || undefined,
    speed: mi?.speed || undefined,
    vocalinstrumental: mi?.vocalinstrumental || undefined,
    acousticelectric: mi?.acousticelectric || undefined,
    genres: mi?.tags?.genres?.length ? mi.tags.genres : undefined,
    instruments: mi?.tags?.instruments?.length ? mi.tags.instruments : undefined,
    vartags: mi?.tags?.vartags?.length ? mi.tags.vartags : undefined,
    releasedate: t.releasedate || undefined,
    license: t.license_ccurl || undefined,
    downloads: st?.rate_downloads_total || undefined,
    listens: st?.rate_listened_total || undefined,
  }
}
