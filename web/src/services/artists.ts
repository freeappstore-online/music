import type { Track } from '../types'

const CLIENT_ID = 'b0f2e95e'
const BASE = 'https://api.jamendo.com/v3.0'

export type Artist = {
  id: string
  name: string
  image?: string
  website?: string
}

export async function getPopularArtists(limit = 20, tags?: string): Promise<Artist[]> {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    format: 'json',
    limit: String(limit),
    order: 'popularity_week',
  })
  if (tags) params.set('tags', tags)
  try {
    const res = await fetch(`${BASE}/artists/?${params}`)
    const data = await res.json()
    return (data.results || []).map(mapArtist)
  } catch {
    return []
  }
}

export async function getArtistTracks(artistId: string, limit = 20): Promise<Track[]> {
  try {
    const res = await fetch(`${BASE}/artists/tracks/?client_id=${CLIENT_ID}&format=json&id=${artistId}&limit=${limit}`)
    const data = await res.json()
    const artist = data.results?.[0]
    if (!artist?.tracks) return []
    return artist.tracks.map((t: any) => ({
      id: `jamendo-${t.id}`,
      title: t.name,
      artist: artist.name,
      album: t.album_name,
      duration: t.duration,
      streamUrl: t.audio,
      artworkUrl: t.album_image || t.image,
      source: 'jamendo' as const,
    }))
  } catch {
    return []
  }
}

function mapArtist(a: any): Artist {
  return {
    id: a.id,
    name: a.name,
    image: a.image || undefined,
    website: a.website || undefined,
  }
}
