import type { RadioStation } from '../types'

const BASE = 'https://de1.api.radio-browser.info/json'

async function radioFetch(url: string): Promise<RadioStation[]> {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data.map(mapStation)
  } catch {
    return []
  }
}

export function searchStations(query: string, limit = 20): Promise<RadioStation[]> {
  return radioFetch(`${BASE}/stations/byname/${encodeURIComponent(query)}?limit=${limit}&order=clickcount&reverse=true&hidebroken=true`)
}

export function getTopStations(limit = 20): Promise<RadioStation[]> {
  return radioFetch(`${BASE}/stations/topclick/${limit}?hidebroken=true`)
}

export function getByGenre(genre: string, limit = 20): Promise<RadioStation[]> {
  return radioFetch(`${BASE}/stations/bytag/${encodeURIComponent(genre)}?limit=${limit}&order=clickcount&reverse=true&hidebroken=true`)
}

export function getByCountry(country: string, limit = 20): Promise<RadioStation[]> {
  return radioFetch(`${BASE}/stations/bycountry/${encodeURIComponent(country)}?limit=${limit}&order=clickcount&reverse=true&hidebroken=true`)
}

export function getByLanguage(language: string, limit = 20): Promise<RadioStation[]> {
  return radioFetch(`${BASE}/stations/bylanguage/${encodeURIComponent(language)}?limit=${limit}&order=clickcount&reverse=true&hidebroken=true`)
}

export type RadioFilters = {
  name?: string
  tag?: string
  country?: string
  language?: string
}

export function advancedSearch(filters: RadioFilters, limit = 40): Promise<RadioStation[]> {
  const params = new URLSearchParams()
  if (filters.name) params.set('name', filters.name)
  if (filters.tag) params.set('tag', filters.tag)
  if (filters.country) params.set('country', filters.country)
  if (filters.language) params.set('language', filters.language)
  params.set('limit', String(limit))
  params.set('order', 'clickcount')
  params.set('reverse', 'true')
  params.set('hidebroken', 'true')
  return radioFetch(`${BASE}/stations/search?${params}`)
}

function mapStation(s: any): RadioStation {
  return {
    id: `radio-${s.stationuuid}`,
    name: s.name,
    streamUrl: s.url_resolved || s.url,
    genre: s.tags,
    country: s.country,
    language: s.language,
    bitrate: s.bitrate,
    favicon: s.favicon || undefined,
    votes: s.votes || 0,
  }
}
