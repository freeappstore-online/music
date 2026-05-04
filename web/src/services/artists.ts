import type { Track } from '../types'

const CLIENT_ID = 'b0f2e95e'
const BASE = 'https://api.jamendo.com/v3.0'

export type Artist = {
  id: string
  name: string
  image?: string
  website?: string
}

interface RawArtist {
  id: string | number
  name: string
  image?: string
  website?: string
}

interface PopularArtistsResponse {
  results?: RawArtist[]
}

interface RawArtistTrack {
  id: string | number
  name: string
  album_name?: string
  duration?: number
  audio: string
  album_image?: string
  image?: string
}

interface ArtistTracksResponse {
  results?: Array<{
    name: string
    tracks?: RawArtistTrack[]
  }>
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
    const data = await res.json() as PopularArtistsResponse
    return (data.results ?? []).map(mapArtist)
  } catch {
    return []
  }
}

export async function getArtistTracks(artistId: string, limit = 20): Promise<Track[]> {
  try {
    const res = await fetch(`${BASE}/artists/tracks/?client_id=${CLIENT_ID}&format=json&id=${artistId}&limit=${limit}`)
    const data = await res.json() as ArtistTracksResponse
    const artist = data.results?.[0]
    if (!artist?.tracks) return []
    return artist.tracks.map((track) => ({
      id: `jamendo-${track.id}`,
      title: track.name,
      artist: artist.name,
      album: track.album_name,
      duration: track.duration ?? 0,
      streamUrl: track.audio,
      artworkUrl: track.album_image || track.image,
      source: 'jamendo' as const,
    }))
  } catch {
    return []
  }
}

function mapArtist(artist: RawArtist): Artist {
  return {
    id: String(artist.id),
    name: artist.name,
    image: artist.image || undefined,
    website: artist.website || undefined,
  }
}
