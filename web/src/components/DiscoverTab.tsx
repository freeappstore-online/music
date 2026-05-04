import { useCallback, useEffect, useState } from 'react'
import { getPopularArtists, getArtistTracks, type Artist } from '../services/artists'
import { getTrending, getByGenre } from '../services/jamendo'
import type { Track } from '../types'
import { player } from '../services/player'
import { TrackRow } from './TrackRow'
import { Spinner } from './ui/Spinner'
import { Artwork } from './ui/Artwork'

const GENRES = ['pop', 'rock', 'electronic', 'jazz', 'classical', 'hiphop', 'ambient', 'metal', 'blues', 'folk', 'reggae', 'latin', 'soul', 'funk']

export function DiscoverTab() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [genre, setGenre] = useState('')
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [artistTracks, setArtistTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingArtist, setLoadingArtist] = useState(false)

  const loadContent = useCallback(async (tag?: string) => {
    setLoading(true)
    setSelectedArtist(null)
    setArtistTracks([])
    const [a, t] = await Promise.all([
      getPopularArtists(20, tag || undefined),
      tag ? getByGenre(tag, 15) : getTrending(15),
    ])
    setArtists(a)
    setTracks(t)
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadContent()
  }, [loadContent])

  const handleGenre = (g: string) => {
    const next = genre === g ? '' : g
    setGenre(next)
    void loadContent(next || undefined)
  }

  const handleArtist = async (artist: Artist) => {
    if (selectedArtist?.id === artist.id) { setSelectedArtist(null); setArtistTracks([]); return }
    setSelectedArtist(artist)
    setLoadingArtist(true)
    const t = await getArtistTracks(artist.id, 20)
    setArtistTracks(t)
    setLoadingArtist(false)
  }

  return (
    <div className="pb-4">
      <h1 className="text-2xl md:text-3xl font-bold px-4 md:px-6 pt-6 md:pt-10 pb-1">Discover</h1>
      <p className="text-sm text-text-muted px-4 md:px-6 pb-4">Explore artists and genres</p>

      {/* Genre filter */}
      <div className="flex gap-1.5 overflow-x-auto px-4 md:px-6 pb-4 snap-x">
        <button
          onClick={() => handleGenre('')}
          className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg snap-start transition-colors ${!genre ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}
        >
          All
        </button>
        {GENRES.map(g => (
          <button
            key={g}
            onClick={() => handleGenre(g)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg snap-start transition-colors whitespace-nowrap ${genre === g ? 'bg-accent text-base font-semibold' : 'bg-white/4 text-text-muted hover:text-text'}`}
          >
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Spinner /></div>
      ) : (
        <>
          {/* Artists */}
          <h2 className="text-base font-bold px-4 md:px-6 mb-3">
            {genre ? `${genre.charAt(0).toUpperCase() + genre.slice(1)} Artists` : 'Popular Artists'}
          </h2>
          <div className="flex gap-4 overflow-x-auto px-4 md:px-6 pb-4 snap-x md:grid md:grid-cols-5 lg:grid-cols-6 md:overflow-visible">
            {artists.map(a => (
              <button
                key={a.id}
                onClick={() => handleArtist(a)}
                className={`flex-shrink-0 w-20 md:w-auto snap-start text-center group ${selectedArtist?.id === a.id ? 'opacity-100' : ''}`}
              >
                <div className={`w-20 h-20 md:w-full md:aspect-square rounded-full overflow-hidden ring-2 transition-colors ${selectedArtist?.id === a.id ? 'ring-accent' : 'ring-white/6 group-hover:ring-white/15'}`}>
                  <Artwork src={a.image} alt={a.name} size={80} type="track" rounded="rounded-full" />
                </div>
                <div className="text-[11px] font-semibold truncate mt-2">{a.name}</div>
              </button>
            ))}
          </div>

          {/* Selected artist tracks */}
          {selectedArtist && (
            <div className="mt-2">
              <div className="flex items-center justify-between px-4 md:px-6 mb-2">
                <h2 className="text-base font-bold">{selectedArtist.name}</h2>
                {artistTracks.length > 0 && (
                  <button onClick={() => player.playTrack(artistTracks[0], artistTracks, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>
                )}
              </div>
              {loadingArtist ? (
                <div className="flex items-center justify-center py-6"><Spinner /></div>
              ) : artistTracks.length === 0 ? (
                <p className="text-sm text-text-muted px-4 md:px-6 py-4">No tracks found for this artist.</p>
              ) : (
                artistTracks.map((t, i) => <TrackRow key={t.id} track={t} queue={artistTracks} index={i} />)
              )}
            </div>
          )}

          {/* Trending/Genre tracks */}
          {!selectedArtist && tracks.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between px-4 md:px-6 mb-2">
                <h2 className="text-base font-bold">{genre ? `${genre.charAt(0).toUpperCase() + genre.slice(1)} Tracks` : 'Trending Now'}</h2>
                <button onClick={() => player.playTrack(tracks[0], tracks, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>
              </div>
              {tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
