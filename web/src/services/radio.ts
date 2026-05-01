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
  return radioFetch(`${BASE}/stations/byname/${encodeURIComponent(query)}?limit=${limit}&order=clickcount&reverse=true`)
}

export function getTopStations(limit = 20): Promise<RadioStation[]> {
  return radioFetch(`${BASE}/stations/topclick/${limit}`)
}

function mapStation(s: any): RadioStation {
  return {
    id: `radio-${s.stationuuid}`,
    name: s.name,
    streamUrl: s.url_resolved || s.url,
    genre: s.tags,
    country: s.country,
    favicon: s.favicon || undefined,
  }
}
