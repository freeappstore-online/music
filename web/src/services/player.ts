import type { Track, RadioStation } from '../types'

export type PlayerState = {
  track: Track | null
  station: RadioStation | null
  queue: Track[]
  queueIndex: number
  isPlaying: boolean
  isLoading: boolean
  error: boolean
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
    error: false,
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
      this.state.error = false
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
    this.audio.addEventListener('ended', () => this.next())
    this.audio.addEventListener('error', () => {
      this.state.isLoading = false
      this.state.isPlaying = false
      this.state.error = true
      this.notify()
    })

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.togglePlayPause())
      navigator.mediaSession.setActionHandler('pause', () => this.togglePlayPause())
      navigator.mediaSession.setActionHandler('previoustrack', () => this.previous())
      navigator.mediaSession.setActionHandler('nexttrack', () => this.next())
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Don't capture when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (!this.state.track && !this.state.station && e.key !== ' ') return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          this.togglePlayPause()
          break
        case 'Escape':
          e.preventDefault()
          this.audio.pause()
          this.state.isPlaying = false
          this.notify()
          break
        case 'ArrowRight':
          e.preventDefault()
          this.next()
          break
        case 'ArrowLeft':
          e.preventDefault()
          this.previous()
          break
      }
    })
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn)
    return () => { this.listeners = this.listeners.filter(l => l !== fn) }
  }

  private notify() {
    const snapshot: PlayerState = {
      ...this.state,
      queue: this.state.queue, // read-only reference is fine for rendering
    }
    this.listeners.forEach(fn => fn(snapshot))
  }

  playTrack(track: Track, queue?: Track[], index?: number) {
    this.state.track = track
    this.state.station = null
    this.state.error = false
    if (queue) { this.state.queue = queue; this.state.queueIndex = index ?? 0 }
    this.startPlayback(track.streamUrl)
  }

  playStation(station: RadioStation) {
    this.state.track = null
    this.state.station = station
    this.state.queue = []
    this.state.error = false
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
    this.state.error = false
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
    this.state.error = false
    this.startPlayback(track.streamUrl)
  }

  seek(fraction: number) {
    if (this.audio.duration) {
      this.audio.currentTime = fraction * this.audio.duration
    }
  }

  private startPlayback(url: string) {
    this.audio.pause()
    this.state.isLoading = true
    this.state.currentTime = 0
    this.state.duration = 0
    this.state.error = false
    this.notify()
    this.audio.src = url
    this.audio.play().catch(() => {
      this.state.isLoading = false
      this.state.error = true
      this.notify()
    })
  }

  private updateMediaSession() {
    if (!('mediaSession' in navigator)) return
    const artSrc = this.state.track?.artworkUrl ?? this.state.station?.favicon
    // Ensure HTTPS for iOS
    const artUrl = artSrc?.replace(/^http:\/\//, 'https://') || ''

    const artwork: MediaImage[] = artUrl ? [
      { src: artUrl, sizes: '96x96', type: 'image/jpeg' },
      { src: artUrl, sizes: '256x256', type: 'image/jpeg' },
      { src: artUrl, sizes: '512x512', type: 'image/jpeg' },
    ] : []

    navigator.mediaSession.metadata = new MediaMetadata({
      title: this.state.track?.title ?? this.state.station?.name ?? '',
      artist: this.state.track?.artist ?? '',
      album: this.state.track?.album ?? '',
      artwork,
    })
  }
}

export const player = new AudioPlayerService()
