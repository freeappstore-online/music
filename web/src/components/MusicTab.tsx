import { useCallback, useEffect, useState } from 'react'
import { getTrending, getByGenre } from '../services/jamendo'
import { getFeatured as getIAFeatured } from '../services/archive'
import { getByGenre as getStationsByGenre } from '../services/radio'
import type { Track, RadioStation } from '../types'
import { player } from '../services/player'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'
import { Spinner } from './ui/Spinner'
import { WorksView } from './WorksView'
import { JazzWorksView } from './JazzWorksView'

const GENRES = ['pop', 'rock', 'electronic', 'jazz', 'classical', 'hiphop', 'ambient', 'metal', 'dance', 'oldies', '80s', 'blues', 'folk', 'reggae', 'latin', 'soul', 'funk']

const COLORS: Record<string, string> = {
  pop: 'from-pink-500 to-pink-900',
  rock: 'from-red-600 to-red-950',
  electronic: 'from-blue-500 to-blue-950',
  jazz: 'from-orange-500 to-orange-950',
  classical: 'from-amber-600 to-amber-950',
  hiphop: 'from-purple-500 to-purple-950',
  ambient: 'from-teal-500 to-teal-950',
  metal: 'from-gray-400 to-gray-800',
  dance: 'from-violet-500 to-violet-950',
  oldies: 'from-yellow-500 to-yellow-900',
  '80s': 'from-fuchsia-500 to-fuchsia-950',
  blues: 'from-indigo-500 to-indigo-950',
  folk: 'from-lime-600 to-lime-950',
  reggae: 'from-green-500 to-green-950',
  latin: 'from-rose-500 to-rose-950',
  soul: 'from-amber-500 to-amber-900',
  funk: 'from-orange-600 to-orange-950',
}

type Mood = { id: string; label: string; icon: string; color: string; tags: string }

const MOODS: Mood[] = [
  { id: 'happy', label: 'Happy', icon: '😊', color: 'from-yellow-400 to-orange-500', tags: 'happy' },
  { id: 'sad', label: 'Sad', icon: '😢', color: 'from-blue-400 to-blue-700', tags: 'sad' },
  { id: 'chill', label: 'Chill', icon: '😌', color: 'from-teal-400 to-cyan-700', tags: 'chill' },
  { id: 'energetic', label: 'Pump Up', icon: '🔥', color: 'from-red-500 to-orange-600', tags: 'energetic' },
  { id: 'romantic', label: 'Romantic', icon: '❤️', color: 'from-pink-400 to-rose-600', tags: 'romantic' },
  { id: 'focus', label: 'Focus', icon: '🎯', color: 'from-indigo-400 to-violet-700', tags: 'ambient' },
  { id: 'workout', label: 'Workout', icon: '💪', color: 'from-emerald-400 to-green-700', tags: 'workout' },
  { id: 'sleep', label: 'Sleep', icon: '🌙', color: 'from-slate-400 to-slate-700', tags: 'relaxation' },
]

const OCCASIONS: Mood[] = [
  { id: 'party', label: 'Party', icon: '🎉', color: 'from-fuchsia-500 to-purple-700', tags: 'party' },
  { id: 'christmas', label: 'Christmas', icon: '🎄', color: 'from-red-600 to-green-700', tags: 'christmas' },
  { id: 'summer', label: 'Summer', icon: '☀️', color: 'from-amber-400 to-orange-500', tags: 'summer' },
  { id: 'road', label: 'Road Trip', icon: '🚗', color: 'from-sky-400 to-blue-600', tags: 'road+trip' },
  { id: 'morning', label: 'Morning', icon: '🌅', color: 'from-amber-300 to-rose-400', tags: 'morning' },
  { id: 'dinner', label: 'Dinner', icon: '🍷', color: 'from-amber-700 to-red-900', tags: 'lounge' },
  { id: 'study', label: 'Study', icon: '📚', color: 'from-emerald-500 to-teal-700', tags: 'study' },
  { id: 'birthday', label: 'Birthday', icon: '🎂', color: 'from-pink-500 to-amber-500', tags: 'celebration' },
]

type Section = 'genres' | 'moods' | 'trending' | 'works'

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'genres', label: 'Genres' },
  { id: 'moods', label: 'Moods' },
  { id: 'trending', label: 'Trending' },
  { id: 'works', label: 'Famous Works' },
]

function genreLabel(g: string) {
  return g === '80s' ? "80's" : g === 'hiphop' ? 'Hip-Hop' : g.charAt(0).toUpperCase() + g.slice(1)
}

export function MusicTab() {
  const [section, setSection] = useState<Section>('genres')
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [stations, setStations] = useState<RadioStation[]>([])
  const [trending, setTrending] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [trendingLoaded, setTrendingLoaded] = useState(false)

  const handleGenre = async (genre: string) => {
    if (selectedGenre === genre) { setSelectedGenre(null); return }
    setSelectedGenre(genre)
    setSelectedMood(null)
    setLoading(true)
    const [s, jt, iat] = await Promise.all([
      getStationsByGenre(genre, 20),
      getByGenre(genre, 20),
      getIAFeatured(genre, 8),
    ])
    setTracks([...jt, ...iat])
    setStations(s)
    setLoading(false)
  }

  const handleMood = async (mood: Mood) => {
    if (selectedMood?.id === mood.id) { setSelectedMood(null); setTracks([]); return }
    setSelectedMood(mood)
    setSelectedGenre(null)
    setLoading(true)
    const t = await getByGenre(mood.tags, 20)
    setTracks(t)
    setStations([])
    setLoading(false)
    if (t.length > 0) player.playTrack(t[0], t, 0)
  }

  const loadTrending = useCallback(async () => {
    if (trendingLoaded) return
    setLoading(true)
    const t = await getTrending(30)
    setTrending(t)
    setTrendingLoaded(true)
    setLoading(false)
  }, [trendingLoaded])

  useEffect(() => {
    if (section === 'trending') {
      void loadTrending()
    }
  }, [loadTrending, section])

  return (
    <div className="pb-4">
      <div className="px-4 md:px-6 pt-6 md:pt-10 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold font-display italic">Music</h1>
        <p className="text-sm text-text-muted mt-1">Explore by genre, mood &amp; more</p>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1.5 overflow-x-auto px-4 md:px-6 py-4 snap-x">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => { setSection(s.id); setSelectedGenre(null); setSelectedMood(null) }}
            className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg snap-start transition-colors ${
              section === s.id ? 'bg-accent text-base' : 'bg-white/4 text-text-muted hover:text-text'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Genres */}
      {section === 'genres' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 md:px-6 mb-4">
            {GENRES.map(g => (
              <button
                key={g}
                onClick={() => handleGenre(g)}
                className={`h-12 rounded-xl font-semibold text-xs bg-gradient-to-br ${COLORS[g] || 'from-gray-500 to-gray-800'} active:scale-95 transition-transform ${selectedGenre === g ? 'ring-2 ring-accent' : ''}`}
              >
                {genreLabel(g)}
              </button>
            ))}
          </div>
          {selectedGenre && (
            <GenreResults
              label={genreLabel(selectedGenre)}
              tracks={tracks}
              stations={stations}
              loading={loading}
            />
          )}
        </>
      )}

      {/* Moods & Occasions */}
      {section === 'moods' && (
        <>
          <h2 className="text-sm font-bold px-4 md:px-6 mb-3">Moods</h2>
          <div className="flex gap-2 overflow-x-auto px-4 md:px-6 pb-3 snap-x">
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => handleMood(m)}
                className={`flex-shrink-0 snap-start flex flex-col items-center gap-1.5 w-20 py-3 rounded-xl bg-gradient-to-br ${m.color} active:scale-95 transition-transform ${selectedMood?.id === m.id ? 'ring-2 ring-accent' : ''}`}
              >
                <span className="text-lg">{m.icon}</span>
                <span className="text-[11px] font-semibold">{m.label}</span>
              </button>
            ))}
          </div>

          <h2 className="text-sm font-bold px-4 md:px-6 mb-3 mt-4">Occasions</h2>
          <div className="flex gap-2 overflow-x-auto px-4 md:px-6 pb-3 snap-x">
            {OCCASIONS.map(m => (
              <button
                key={m.id}
                onClick={() => handleMood(m)}
                className={`flex-shrink-0 snap-start flex flex-col items-center gap-1.5 w-20 py-3 rounded-xl bg-gradient-to-br ${m.color} active:scale-95 transition-transform ${selectedMood?.id === m.id ? 'ring-2 ring-accent' : ''}`}
              >
                <span className="text-lg">{m.icon}</span>
                <span className="text-[11px] font-semibold">{m.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="mt-3">
              <div className="flex items-center justify-between px-4 md:px-6 mb-2">
                <h2 className="text-sm font-bold">{selectedMood.icon} {selectedMood.label}</h2>
                {tracks.length > 0 && (
                  <button onClick={() => player.playTrack(tracks[0], tracks, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>
                )}
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-6"><Spinner /></div>
              ) : tracks.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-6">No tracks found</p>
              ) : (
                tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)
              )}
            </div>
          )}
        </>
      )}

      {/* Trending */}
      {section === 'trending' && (
        loading ? (
          <div className="flex items-center justify-center py-12"><Spinner /></div>
        ) : (
          <div>
            <div className="flex items-center justify-between px-4 md:px-6 mb-2">
              <h2 className="text-sm font-bold">Trending Now</h2>
              {trending.length > 0 && (
                <button onClick={() => player.playTrack(trending[0], trending, 0)} className="text-xs text-accent font-semibold hover:underline">Play All</button>
              )}
            </div>
            {trending.map((t, i) => <TrackRow key={t.id} track={t} queue={trending} index={i} />)}
          </div>
        )
      )}

      {/* Famous Works */}
      {section === 'works' && (
        <div>
          <h2 className="text-sm font-bold px-4 md:px-6 mb-3">Classical Works</h2>
          <WorksView />
          <h2 className="text-sm font-bold px-4 md:px-6 mb-3 mt-6">Jazz Works</h2>
          <JazzWorksView />
        </div>
      )}
    </div>
  )
}

function GenreResults({ label, tracks, stations, loading }: { label: string; tracks: Track[]; stations: RadioStation[]; loading: boolean }) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between px-4 md:px-6 mb-1">
        <h2 className="text-sm font-bold">{label}</h2>
        {tracks.length > 0 && (
          <button onClick={() => player.playTrack(tracks[0], tracks, 0)} className="text-[11px] text-accent font-semibold hover:underline">Play All</button>
        )}
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-6"><Spinner /></div>
      ) : tracks.length === 0 && stations.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-6">No results for this genre</p>
      ) : (
        <>
          {tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} index={i} />)}
          {stations.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-bold px-4 md:px-6 mb-2 text-text-muted">{label} Radio</h3>
              {stations.map(s => <StationRow key={s.id} station={s} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
