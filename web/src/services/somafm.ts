import type { RadioStation } from '../types'

export async function getSomaFMChannels(): Promise<RadioStation[]> {
  try {
    const res = await fetch('https://somafm.com/channels.json')
    const data = await res.json()
    return (data.channels || []).map((c: any) => {
      // Extract direct stream URL from PLS playlist URL
      // PLS URL pattern: https://api.somafm.com/bootliquor320.pls
      // Direct stream: https://ice6.somafm.com/bootliquor-320-mp3
      // Simpler: somafm provides direct MP3 URLs via their CDN
      const id = c.id as string
      const directStream = `https://ice2.somafm.com/${id}-128-mp3`

      return {
        id: `soma-${id}`,
        name: c.title,
        streamUrl: directStream,
        genre: c.genre,
        country: 'The United States Of America',
        favicon: c.xlimage || c.largeimage || c.image,
        votes: c.listeners || 0,
        tags: c.genre,
        codec: 'MP3',
        bitrate: 128,
      }
    })
  } catch {
    return []
  }
}
