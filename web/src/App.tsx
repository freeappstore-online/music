import { useState } from 'react'
import { HomeTab } from './components/HomeTab'
import { SearchTab } from './components/SearchTab'
import { RadioTab } from './components/RadioTab'
import { LibraryTab } from './components/LibraryTab'
import { AboutTab } from './components/AboutTab'
import { MiniPlayer } from './components/MiniPlayer'
import { usePlayer } from './hooks'

type Tab = 'home' | 'search' | 'radio' | 'library'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'radio', label: 'Radio', icon: 'radio' },
  { id: 'library', label: 'Library', icon: 'library' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [showAbout, setShowAbout] = useState(false)
  const ps = usePlayer()
  const hasPlayer = ps.track !== null || ps.station !== null

  return (
    <div className="h-[100dvh] bg-base flex flex-col overflow-hidden">
      {/* ===== DESKTOP TOP NAV (hidden on mobile) ===== */}
      <header className="hidden md:block border-b border-white/6 flex-shrink-0">
        <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto px-6 h-14">
          <div className="flex items-center gap-2.5">
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
            <button onClick={() => setShowAbout(true)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-white/4 transition-colors">About</button>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT (scrollable) ===== */}
      <main className={`flex-1 overflow-y-auto ${hasPlayer ? 'pb-28 md:pb-24' : 'pb-14 md:pb-0'}`}>
        <div className="max-w-5xl mx-auto">
          <div className={tab === 'home' ? '' : 'hidden'}><HomeTab /></div>
          <div className={tab === 'search' ? '' : 'hidden'}><SearchTab /></div>
          <div className={tab === 'radio' ? '' : 'hidden'}><RadioTab /></div>
          <div className={tab === 'library' ? '' : 'hidden'}><LibraryTab /></div>
        </div>
      </main>

      {/* ===== PLAYER ===== */}
      <MiniPlayer />

      {/* ===== MOBILE TAB BAR (hidden on desktop) ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-base/90 backdrop-blur-xl border-t border-white/6 pb-[env(safe-area-inset-bottom)]">
        <div className="flex">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 relative ${
                tab === t.id ? 'text-accent' : 'text-text-muted'
              }`}
              onClick={() => setTab(t.id)}
            >
              {tab === t.id && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-accent" />}
              <TabIcon name={t.icon} size={22} />
              <span className="text-[10px] font-medium tracking-wide">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ===== ABOUT MODAL ===== */}
      {showAbout && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowAbout(false)}>
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">About FreeMusic</h2>
              <button onClick={() => setShowAbout(false)} className="p-1 rounded-lg hover:bg-white/6 text-text-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <AboutTab />
          </div>
        </div>
      )}
    </div>
  )
}

function TabIcon({ name, size = 24 }: { name: string; size?: number }) {
  const s = { width: size, height: size }
  switch (name) {
    case 'home':
      return <svg style={s} fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
    case 'search':
      return <svg style={s} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    case 'radio':
      return <svg style={s} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm-1 4h1v2H4V9zm1 4v2H4v-2h1z" clipRule="evenodd" /></svg>
    case 'library':
      return <svg style={s} fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
    default:
      return null
  }
}
