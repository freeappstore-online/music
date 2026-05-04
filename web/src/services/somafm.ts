import type { RadioStation } from '../types'

interface SomaChannel {
  id: string
  title: string
  genre?: string
  xlimage?: string
  largeimage?: string
  image?: string
  listeners?: number
}

interface SomaResponse {
  channels?: SomaChannel[]
}

export async function getSomaFMChannels(): Promise<RadioStation[]> {
  try {
    const res = await fetch('https://somafm.com/channels.json')
    const data = await res.json() as SomaResponse
    return (data.channels ?? []).map((channel) => {
      // Extract direct stream URL from PLS playlist URL
      // PLS URL pattern: https://api.somafm.com/bootliquor320.pls
      // Direct stream: https://ice6.somafm.com/bootliquor-320-mp3
      // Simpler: somafm provides direct MP3 URLs via their CDN
      const id = channel.id
      const directStream = `https://ice2.somafm.com/${id}-128-mp3`

      return {
        id: `soma-${id}`,
        name: channel.title,
        streamUrl: directStream,
        genre: channel.genre,
        country: 'The United States Of America',
        favicon: channel.xlimage || channel.largeimage || channel.image,
        votes: channel.listeners || 0,
        tags: channel.genre,
        codec: 'MP3',
        bitrate: 128,
      }
    })
  } catch {
    return []
  }
}
