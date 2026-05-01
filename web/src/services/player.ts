import type { Track, RadioStation } from '../types'

export type PlayerState = {
  track: Track | null
  station: RadioStation | null
  queue: Track[]
  queueIndex: number
  isPlaying: boolean
  isLoading: boolean
  currentTime: number
  duration: number
}

type Listener = (state: PlayerState) => void

class AudioPlayerService {
  private audio = new Audio()
  private listeners: Listener[] = []
  state: PlayerState = {
    track: null,
    station: null,
    queue: [],
    queueIndex: 0,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
  }

  constructor() {
    this.audio.addEventListener('timeupdate', () => {
      this.state.currentTime = this.audio.currentTime
      this.state.duration = this.audio.duration || 0
      this.notify()
    })
    this.audio.addEventListener('playing', () => {
      this.state.isPlaying = true
      this.state.isLoading = false
      this.notify()
      this.updateMediaSession()
    })
    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false
      this.notify()
    })
    this.audio.addEventListener('waiting', () => {
      this.state.isLoading = true
      this.notify()
    })
    this.audio.addEventListener('ended', () => {
      this.next()
    })
    this.audio.addEventListener('error', () => {
      this.state.isLoading = false
      this.state.isPlaying = false
      this.notify()
    })

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.togglePlayPause())
      navigator.mediaSession.setActionHandler('pause', () => this.togglePlayPause())
      navigator.mediaSession.setActionHandler('previoustrack', () => this.previous())
      navigator.mediaSession.setActionHandler('nexttrack', () => this.next())
    }
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn)
    return () => { this.listeners = this.listeners.filter(l => l !== fn) }
  }

  private notify() {
    const snapshot = { ...this.state }
    this.listeners.forEach(fn => fn(snapshot))
  }

  playTrack(track: Track, queue?: Track[], index?: number) {
    this.state.track = track
    this.state.station = null
    if (queue) { this.state.queue = queue; this.state.queueIndex = index ?? 0 }
    this.startPlayback(track.streamUrl)
  }

  playStation(station: RadioStation) {
    this.state.track = null
    this.state.station = station
    this.state.queue = []
    this.startPlayback(station.streamUrl)
  }

  togglePlayPause() {
    if (this.audio.paused) {
      this.audio.play()
    } else {
      this.audio.pause()
    }
  }

  next() {
    if (this.state.queue.length === 0) return
    this.state.queueIndex = (this.state.queueIndex + 1) % this.state.queue.length
    const track = this.state.queue[this.state.queueIndex]
    this.state.track = track
    this.startPlayback(track.streamUrl)
  }

  previous() {
    if (this.state.queue.length === 0) return
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0
      return
    }
    this.state.queueIndex = (this.state.queueIndex - 1 + this.state.queue.length) % this.state.queue.length
    const track = this.state.queue[this.state.queueIndex]
    this.state.track = track
    this.startPlayback(track.streamUrl)
  }

  seek(fraction: number) {
    if (this.audio.duration) {
      this.audio.currentTime = fraction * this.audio.duration
    }
  }

  private startPlayback(url: string) {
    this.state.isLoading = true
    this.state.currentTime = 0
    this.state.duration = 0
    this.notify()
    this.audio.src = url
    this.audio.play().catch(() => {
      this.state.isLoading = false
      this.notify()
    })
  }

  private updateMediaSession() {
    if (!('mediaSession' in navigator)) return
    const title = this.state.track?.title ?? this.state.station?.name ?? ''
    const artist = this.state.track?.artist ?? ''
    const artwork = this.state.track?.artworkUrl ?? this.state.station?.favicon
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      artwork: artwork ? [{ src: artwork, sizes: '512x512' }] : [],
    })
  }
}

export const player = new AudioPlayerService()
