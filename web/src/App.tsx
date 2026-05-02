import { useState } from 'react'
import { HomeTab } from './components/HomeTab'
import { SearchTab } from './components/SearchTab'
import { RadioTab } from './components/RadioTab'
import { FavoritesTab } from './components/FavoritesTab'
import { AboutTab } from './components/AboutTab'
import { MiniPlayer } from './components/MiniPlayer'
import { usePlayer } from './hooks'

type Tab = 'home' | 'search' | 'radio' | 'favorites' | 'about'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'radio', label: 'Radio', icon: 'radio' },
  { id: 'favorites', label: 'Favorites', icon: 'heart' },
  { id: 'about', label: 'About', icon: 'about' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const ps = usePlayer()
  const hasPlayer = ps.track !== null || ps.station !== null

  return (
    <div className="flex min-h-[100dvh]">
      {/* ===== DESKTOP SIDEBAR (hidden on mobile) ===== */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 border-r border-white/[0.04] bg-[var(--surface)]/50 fixed top-0 left-0 bottom-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/[0.04]">
          <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="30" stroke="#6ECE9E" strokeWidth="5"/>
            <circle cx="50" cy="50" r="16" stroke="#6ECE9E" strokeWidth="5"/>
            <circle cx="50" cy="50" r="5" fill="#6ECE9E"/>
          </svg>
          <span className="text-base font-bold tracking-tight">FreeMusic</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.04]'
              }`}
            >
              <TabIcon name={t.icon} size={20} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-5 py-4 border-t border-white/[0.04]">
          <p className="text-[10px] text-[var(--text-muted)]/50 leading-relaxed">
            Creative Commons &<br/>public domain music.<br/>Free forever.
          </p>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className={`flex-1 md:ml-56 ${hasPlayer ? 'pb-28 md:pb-20' : 'pb-14 md:pb-0'}`}>
        <div className="max-w-5xl mx-auto">
          {tab === 'home' && <HomeTab />}
          {tab === 'search' && <SearchTab />}
          {tab === 'radio' && <RadioTab />}
          {tab === 'favorites' && <FavoritesTab />}
          {tab === 'about' && <AboutTab />}
        </div>
      </main>

      {/* ===== PLAYER ===== */}
      <MiniPlayer />

      {/* ===== MOBILE TAB BAR (hidden on desktop) ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg)]/90 backdrop-blur-xl border-t border-white/[0.04] pb-[env(safe-area-inset-bottom)]">
        <div className="flex">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 relative ${
                tab === t.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
              }`}
              onClick={() => setTab(t.id)}
            >
              {tab === t.id && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-[var(--accent)]" />}
              <TabIcon name={t.icon} size={22} />
              <span className="text-[10px] font-medium tracking-wide">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
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
    case 'heart':
      return <svg style={s} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
    case 'about':
      return <svg style={s} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    default:
      return null
  }
}
