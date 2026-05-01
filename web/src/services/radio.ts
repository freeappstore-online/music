import type { RadioStation } from '../types'

const BASE = 'https://de1.api.radio-browser.info/json'

export async function searchStations(query: string, limit = 20): Promise<RadioStation[]> {
  const url = `${BASE}/stations/byname/${encodeURIComponent(query)}?limit=${limit}&order=clickcount&reverse=true`
  const res = await fetch(url)
  const data = await res.json()
  return data.map(mapStation)
}

export async function getTopStations(limit = 20): Promise<RadioStation[]> {
  const url = `${BASE}/stations/topclick/${limit}`
  const res = await fetch(url)
  const data = await res.json()
  return data.map(mapStation)
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
