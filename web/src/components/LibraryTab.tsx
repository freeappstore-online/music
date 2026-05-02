import { useState, useEffect, useCallback } from 'react'
import { getFavoriteTracks, getFavoriteStations, getBlacklistedTrackIds, getBlacklistedStationIds, unblacklist, getBlacklistCount } from '../services/favorites'
import { getHistory, clearHistory, type HistoryEntry } from '../services/history'
import { getPlaylists, createPlaylist, deletePlaylist, type Playlist } from '../services/playlists'
import { player } from '../services/player'
import type { Track, RadioStation } from '../types'
import { TrackRow } from './TrackRow'
import { StationRow } from './StationRow'

type Section = 'favorites' | 'playlists' | 'history' | 'blacklist'

export function LibraryTab() {
  const [section, setSection] = useState<Section>('favorites')
  const [favTracks, setFavTracks] = useState<Track[]>([])
  const [favStations, setFavStations] = useState<RadioStation[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [blacklistCount, setBlacklistCount] = useState(0)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null)

  const reload = useCallback(() => {
    setFavTracks(getFavoriteTracks())
    setFavStations(getFavoriteStations())
    setHistory(getHistory())
    setPlaylists(getPlaylists())
    setBlacklistCount(getBlacklistCount())
  }, [])

  useEffect(() => {
    reload()
    const onFocus = () => reload()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [reload])

  useEffect(() => {
    const id = setInterval(reload, 3000)
    return () => clearInterval(id)
  }, [reload])

  const handleCreatePlaylist = () => {
    const name = newPlaylistName.trim()
    if (!name) return
    createPlaylist(name)
    setNewPlaylistName('')
    setPlaylists(getPlaylists())
  }

  return (
    <div className="pb-4">
      <h1 className="text-2xl md:text-3xl font-bold px-4 md:px-6 pt-6 md:pt-10 pb-2">Library</h1>

      {/* Section tabs */}
      <div className="flex gap-2 px-4 md:px-6 mb-4 overflow-x-auto">
        {([
          ['favorites', 'Favorites'],
          ['playlists', 'Playlists'],
          ['history', 'Last Played'],
          ['blacklist', `Blocked (${blacklistCount})`],
        ] as [Section, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              section === id ? 'bg-accent text-base' : 'bg-white/4 text-text-muted hover:text-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Favorites */}
      {section === 'favorites' && (
        favTracks.length === 0 && favStations.length === 0 ? (
          <Empty icon="heart" text="No favorites yet" sub="Tap the heart icon on any track or station." />
        ) : (
          <>
            {favTracks.length > 0 && (
              <>
                <SectionHeader title="Tracks" count={favTracks.length} onPlayAll={() => player.playTrack(favTracks[0], favTracks, 0)} />
                {favTracks.map((t, i) => <TrackRow key={t.id} track={t} queue={favTracks} index={i} />)}
              </>
            )}
            {favStations.length > 0 && (
              <>
                <SectionHeader title="Stations" count={favStations.length} />
                {favStations.map(s => <StationRow key={s.id} station={s} />)}
              </>
            )}
          </>
        )
      )}

      {/* Playlists */}
      {section === 'playlists' && (
        <>
          <form className="px-4 md:px-6 mb-4 flex gap-2" onSubmit={e => { e.preventDefault(); handleCreatePlaylist() }}>
            <input
              type="text"
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              placeholder="New playlist name..."
              className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm placeholder-text-dim outline-none focus:border-accent transition"
            />
            <button type="submit" className="bg-accent text-base px-4 py-2 rounded-lg text-sm font-semibold">Create</button>
          </form>

          {playlists.length === 0 ? (
            <Empty icon="folder" text="No playlists yet" sub="Create one above to start organizing your music." />
          ) : (
            playlists.map(pl => (
              <div key={pl.id} className="mb-2">
                <button
                  className="flex items-center justify-between w-full px-4 md:px-6 py-3 hover:bg-white/3 transition-colors text-left"
                  onClick={() => setExpandedPlaylist(expandedPlaylist === pl.id ? null : pl.id)}
                >
                  <div>
                    <div className="text-sm font-semibold">{pl.name}</div>
                    <div className="text-xs text-text-muted">{pl.tracks.length} tracks</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pl.tracks.length > 0 && (
                      <button className="text-xs text-accent font-semibold hover:underline" onClick={e => { e.stopPropagation(); player.playTrack(pl.tracks[0], pl.tracks, 0) }}>Play</button>
                    )}
                    <button className="text-xs text-text-muted hover:text-red-400" onClick={e => { e.stopPropagation(); deletePlaylist(pl.id); setPlaylists(getPlaylists()) }}>Delete</button>
                    <svg className={`w-4 h-4 text-text-muted transition-transform ${expandedPlaylist === pl.id ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </div>
                </button>
                {expandedPlaylist === pl.id && (
                  pl.tracks.length === 0 ? (
                    <p className="text-xs text-text-muted px-4 md:px-6 py-2">Empty playlist. Search for tracks and add them here.</p>
                  ) : (
                    pl.tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={pl.tracks} index={i} />)
                  )
                )}
              </div>
            ))
          )}
        </>
      )}

      {/* History */}
      {section === 'history' && (
        history.length === 0 ? (
          <Empty icon="clock" text="No listening history" sub="Tracks and stations you play will appear here." />
        ) : (
          <>
            <div className="flex justify-end px-4 md:px-6 mb-2">
              <button onClick={() => { clearHistory(); setHistory([]) }} className="text-xs text-text-muted hover:text-text">Clear history</button>
            </div>
            {history.map((h, i) => {
              if (h.track) return <TrackRow key={`${h.track.id}-${i}`} track={h.track} />
              if (h.station) return <StationRow key={`${h.station.id}-${i}`} station={h.station} />
              return null
            })}
          </>
        )
      )}

      {/* Blacklist */}
      {section === 'blacklist' && (
        blacklistCount === 0 ? (
          <Empty icon="block" text="No blocked items" sub="Thumbs-down a track or station to block it." />
        ) : (
          <>
            {[...getBlacklistedTrackIds()].map(id => (
              <div key={id} className="flex items-center justify-between py-2 px-4 md:px-6">
                <span className="text-xs text-text-muted truncate flex-1">{id.replace(/^(jamendo|ia)-/, '')}</span>
                <button onClick={() => { unblacklist(id); reload() }} className="text-xs text-accent font-semibold hover:underline ml-2">Restore</button>
              </div>
            ))}
            {[...getBlacklistedStationIds()].map(id => (
              <div key={id} className="flex items-center justify-between py-2 px-4 md:px-6">
                <span className="text-xs text-text-muted truncate flex-1">{id.replace(/^radio-/, '')}</span>
                <button onClick={() => { unblacklist(id); reload() }} className="text-xs text-accent font-semibold hover:underline ml-2">Restore</button>
              </div>
            ))}
          </>
        )
      )}
    </div>
  )
}

function SectionHeader({ title, count, onPlayAll }: { title: string; count: number; onPlayAll?: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 mb-1">
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{title} ({count})</h2>
      {onPlayAll && <button onClick={onPlayAll} className="text-xs text-accent font-semibold hover:underline">Play All</button>}
    </div>
  )
}

function Empty({ icon, text, sub }: { icon: string; text: string; sub: string }) {
  const icons: Record<string, React.ReactNode> = {
    heart: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
    folder: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>,
    clock: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    block: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-muted">
      {icons[icon]}
      <span className="text-sm font-medium">{text}</span>
      <span className="text-xs text-center px-8 text-text-dim">{sub}</span>
    </div>
  )
}
