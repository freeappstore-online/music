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
