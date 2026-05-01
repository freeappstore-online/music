import type { Track } from '../types'

const CLIENT_ID = 'b6747d04'
const BASE = 'https://api.jamendo.com/v3.0'

export async function searchTracks(query: string, limit = 20): Promise<Track[]> {
  const url = `${BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}`
  const res = await fetch(url)
  const data = await res.json()
  return (data.results || []).map(mapTrack)
}

export async function getTrending(limit = 20): Promise<Track[]> {
  const url = `${BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&order=popularity_week`
  const res = await fetch(url)
  const data = await res.json()
  return (data.results || []).map(mapTrack)
}

export async function getByGenre(genre: string, limit = 20): Promise<Track[]> {
  const url = `${BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&tags=${encodeURIComponent(genre)}&order=popularity_week`
  const res = await fetch(url)
  const data = await res.json()
  return (data.results || []).map(mapTrack)
}

function mapTrack(t: any): Track {
  return {
    id: `jamendo-${t.id}`,
    title: t.name,
    artist: t.artist_name,
    album: t.album_name,
    duration: t.duration,
    streamUrl: t.audio,
    artworkUrl: t.album_image || t.image,
    source: 'jamendo',
  }
}
