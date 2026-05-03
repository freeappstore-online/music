import { useState } from 'react'
import { Folder, House, Music, Radio, Search, Settings2, Users } from 'lucide-react'
import { HomeTab } from './components/HomeTab'
import { SearchTab } from './components/SearchTab'
import { ExploreTab } from './components/ExploreTab'
import { MusicTab } from './components/MusicTab'
import { RadioTab } from './components/RadioTab'
import { LibraryTab } from './components/LibraryTab'
import { SettingsModal } from './components/SettingsModal'
import { MiniPlayer } from './components/MiniPlayer'
import { usePlayer } from './hooks'

type Tab = 'home' | 'search' | 'artists' | 'music' | 'radio' | 'library'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'artists', label: 'Artists', icon: 'artists' },
  { id: 'music', label: 'Music', icon: 'music' },
  { id: 'radio', label: 'Radio', icon: 'radio' },
  { id: 'library', label: 'Library', icon: 'library' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [showSettings, setShowSettings] = useState(false)
  const ps = usePlayer()
  const hasPlayer = ps.track !== null || ps.station !== null

  return (
    <div className="h-[100dvh] bg-base flex flex-col overflow-hidden">
      {/* ===== DESKTOP TOP NAV (hidden on mobile) ===== */}
      <header className="hidden md:block border-b border-white/6 flex-shrink-0">
        <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto px-6 h-14">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setTab('home')}>
            <svg className="w-6 h-6" viewBox="0 0 512 512" fill="none">
              <rect width="512" height="512" rx="112" fill="#1a1a2e"/>
              <circle cx="256" cy="256" r="140" stroke="#6ECE9E" strokeWidth="8" opacity="0.3"/>
              <circle cx="256" cy="256" r="85" stroke="#6ECE9E" strokeWidth="6" opacity="0.5"/>
              <circle cx="256" cy="256" r="32" fill="#6ECE9E"/>
              <path d="M244 234 L244 278 L274 256 Z" fill="#1a1a2e"/>
            </svg>
            <span className="text-base font-bold tracking-tight">FreeMusic</span>
          </div>
          <nav className="flex items-center gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'text-accent bg-accent/10'
                    : 'text-text-muted hover:text-text hover:bg-white/4'
                }`}
              >
                {t.label}
              </button>
            ))}
            <button onClick={() => setShowSettings(true)} className="ml-2 p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-white/4 transition-colors" aria-label="Settings">
              <Settings2 className="w-5 h-5" strokeWidth={2} />
            </button>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT (scrollable) ===== */}
      <main className={`flex-1 overflow-y-auto ${hasPlayer ? 'pb-28 md:pb-24' : 'pb-14 md:pb-0'}`}>
        <div className="max-w-5xl mx-auto">
          <div className={tab === 'home' ? '' : 'hidden'}><HomeTab /></div>
          <div className={tab === 'search' ? '' : 'hidden'}><SearchTab /></div>
          <div className={tab === 'artists' ? '' : 'hidden'}><ExploreTab /></div>
          <div className={tab === 'music' ? '' : 'hidden'}><MusicTab /></div>
          <div className={tab === 'radio' ? '' : 'hidden'}><RadioTab /></div>
          <div className={tab === 'library' ? '' : 'hidden'}><LibraryTab /></div>
        </div>
      </main>

      {/* ===== PLAYER ===== */}
      <MiniPlayer />

      {/* ===== MOBILE TAB BAR (hidden on desktop) ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-base/90 backdrop-blur-xl border-t border-white/6 pb-[env(safe-area-inset-bottom)]">
        <div className="flex overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`flex-1 min-w-[60px] flex flex-col items-center py-2 gap-0.5 relative ${
                tab === t.id ? 'text-accent' : 'text-text-muted'
              }`}
              onClick={() => setTab(t.id)}
            >
              {tab === t.id && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-accent" />}
              <TabIcon name={t.icon} size={18} />
              <span className="text-[8px] font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Settings modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}

function TabIcon({ name, size = 24 }: { name: string; size?: number }) {
  switch (name) {
    case 'home':
      return <House size={size} strokeWidth={2} />
    case 'search':
      return <Search size={size} strokeWidth={2} />
    case 'radio':
      return <Radio size={size} strokeWidth={2} />
    case 'artists':
      return <Users size={size} strokeWidth={2} />
    case 'music':
      return <Music size={size} strokeWidth={2} />
    case 'library':
      return <Folder size={size} strokeWidth={2} />
    default:
      return null
  }
}
