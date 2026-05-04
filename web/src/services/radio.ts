import type { RadioStation } from '../types'

const BASE = 'https://de1.api.radio-browser.info/json'

interface RawRadioStation {
  stationuuid: string
  name: string
  url_resolved?: string
  url: string
  tags?: string
  country?: string
  language?: string
  bitrate?: number
  codec?: string
  favicon?: string
  homepage?: string
  votes?: number
  clickcount?: number
  state?: string
}

async function radioFetch(url: string): Promise<RadioStation[]> {
  try {
    const res = await fetch(url)
    const data = await res.json() as RawRadioStation[]
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

function mapStation(station: RawRadioStation): RadioStation {
  return {
    id: `radio-${station.stationuuid}`,
    name: station.name,
    streamUrl: station.url_resolved || station.url,
    genre: station.tags,
    country: station.country,
    language: station.language,
    bitrate: station.bitrate || undefined,
    codec: station.codec || undefined,
    favicon: station.favicon || undefined,
    homepage: station.homepage || undefined,
    votes: station.votes || 0,
    clickcount: station.clickcount || 0,
    state: station.state || undefined,
    tags: station.tags || undefined,
  }
}
