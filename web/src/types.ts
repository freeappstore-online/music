export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  streamUrl: string
  artworkUrl?: string
  source: 'jamendo' | 'internetarchive'
  // Rich metadata (Jamendo musicinfo)
  lang?: string
  gender?: string
  speed?: string
  vocalinstrumental?: string
  acousticelectric?: string
  genres?: string[]
  instruments?: string[]
  vartags?: string[]
  releasedate?: string
  license?: string
  downloads?: number
  listens?: number
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
