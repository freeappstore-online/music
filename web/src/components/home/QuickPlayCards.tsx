import { Heart, Music, Play, Radio } from 'lucide-react'

import type { Track, RadioStation } from '../../types'
import { player } from '../../services/player'

type Props = {
  favTracks: Track[]
  favStations: RadioStation[]
  topStations: RadioStation[]
  tracks: Track[]
  favGenre: string | null
  onPickGenre: () => void
  onPlayGenre: () => void
}

export function QuickPlayCards({ favTracks, favStations, topStations, tracks, favGenre, onPickGenre, onPlayGenre }: Props) {
  const playRadio = () => {
    const stations = favStations.length > 0 ? favStations : topStations
    if (stations.length > 0) player.playStation(stations[0])
  }

  const playPlaylist = () => {
    if (favTracks.length > 0) {
      player.playTrack(favTracks[0], favTracks, 0)
    } else if (tracks.length > 0) {
      player.playTrack(tracks[0], tracks, 0)
    }
  }

  const genreLabel = favGenre
    ? (favGenre === '80s' ? "80's" : favGenre.charAt(0).toUpperCase() + favGenre.slice(1))
    : 'Pick genre'

  return (
    <div className="grid grid-cols-3 gap-3 px-4 md:px-6 mb-6 mt-4">
      <QuickCard
        gradient="from-emerald-500 to-emerald-900"
        icon={<RadioSvg />}
        label="Radio"
        subtitle={favStations.length > 0 ? `${favStations.length} saved` : 'Top stations'}
        onClick={playRadio}
      />
      <QuickCard
        gradient="from-violet-500 to-violet-900"
        icon={<HeartSvg />}
        label="My Tracks"
        subtitle={favTracks.length > 0 ? `${favTracks.length} saved` : 'Popular mix'}
        onClick={playPlaylist}
      />
      <QuickCard
        gradient="from-amber-500 to-amber-900"
        icon={<NoteSvg />}
        label="Genre"
        subtitle={genreLabel}
        onClick={favGenre ? onPlayGenre : onPickGenre}
      />
    </div>
  )
}

function QuickCard({ gradient, icon, label, subtitle, onClick }: {
  gradient: string; icon: React.ReactNode; label: string; subtitle: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} border border-white/6 p-4 text-left group active:scale-[0.97] transition-transform`}
      aria-label={`Play ${label}`}
    >
      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
        <Play className="w-4 h-4" strokeWidth={2} />
      </div>
      <div className="mb-3 opacity-80">{icon}</div>
      <div className="text-sm font-bold">{label}</div>
      <div className="text-xs text-white/60 mt-0.5 leading-tight">{subtitle}</div>
    </button>
  )
}

function RadioSvg() {
  return <Radio className="w-6 h-6" strokeWidth={2} />
}
function HeartSvg() {
  return <Heart className="w-6 h-6" fill="currentColor" strokeWidth={1.8} />
}
function NoteSvg() {
  return <Music className="w-6 h-6" strokeWidth={2} />
}
