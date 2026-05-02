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
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
      </div>
      <div className="mb-3 opacity-80">{icon}</div>
      <div className="text-sm font-bold">{label}</div>
      <div className="text-xs text-white/60 mt-0.5 leading-tight">{subtitle}</div>
    </button>
  )
}

function RadioSvg() {
  return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm-1 4h1v2H4V9zm1 4v2H4v-2h1z" clipRule="evenodd" /></svg>
}
function HeartSvg() {
  return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
}
function NoteSvg() {
  return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
}
