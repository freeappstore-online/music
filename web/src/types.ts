export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  streamUrl: string
  artworkUrl?: string
  source: 'jamendo' | 'internetarchive' | 'ccmixter'
}

export interface RadioStation {
  id: string
  name: string
  streamUrl: string
  genre?: string
  country?: string
  language?: string
  bitrate?: number
  favicon?: string
  votes?: number
  userTags?: string[]
}
