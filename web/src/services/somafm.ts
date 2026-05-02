import type { RadioStation } from '../types'

export async function getSomaFMChannels(): Promise<RadioStation[]> {
  try {
    const res = await fetch('https://somafm.com/channels.json')
    const data = await res.json()
    return (data.channels || []).map((c: any) => ({
      id: `soma-${c.id}`,
      name: c.title,
      streamUrl: c.highestpls || c.playlists?.[0]?.url || '',
      genre: c.genre,
      country: 'United States',
      favicon: c.xlimage || c.largeimage || c.image,
      votes: c.listeners || 0,
    }))
  } catch {
    return []
  }
}
