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

function mapStation(s: any): RadioStation {
  return {
    id: `radio-${s.stationuuid}`,
    name: s.name,
    streamUrl: s.url_resolved || s.url,
    genre: s.tags,
    country: s.country,
    favicon: s.favicon || undefined,
    votes: s.votes || 0,
  }
}
