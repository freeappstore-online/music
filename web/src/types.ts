export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  streamUrl: string
  artworkUrl?: string
  source: 'jamendo' | 'internetarchive'
}

export interface RadioStation {
  id: string
  name: string
  streamUrl: string
  genre?: string
  country?: string
  language?: string
  bitrate?: number
  codec?: string
  favicon?: string
  homepage?: string
  votes?: number
  clickcount?: number
  state?: string
  tags?: string
}
