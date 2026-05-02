import { useState } from 'react'
import { HomeTab } from './components/HomeTab'
import { SearchTab } from './components/SearchTab'
import { ExploreTab } from './components/ExploreTab'
import { RadioTab } from './components/RadioTab'
import { LibraryTab } from './components/LibraryTab'
import { SettingsModal } from './components/SettingsModal'
import { MiniPlayer } from './components/MiniPlayer'
import { usePlayer } from './hooks'

type Tab = 'home' | 'search' | 'explore' | 'radio' | 'library'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'explore', label: 'Explore', icon: 'discover' },
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
            <button onClick={() => setShowSettings(true)} className="ml-2 p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-white/4 transition-colors" aria-label="Settings">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT (scrollable) ===== */}
      <main className={`flex-1 overflow-y-auto ${hasPlayer ? 'pb-28 md:pb-24' : 'pb-14 md:pb-0'}`}>
        <div className="max-w-5xl mx-auto">
          <div className={tab === 'home' ? '' : 'hidden'}><HomeTab /></div>
          <div className={tab === 'search' ? '' : 'hidden'}><SearchTab /></div>
          <div className={tab === 'explore' ? '' : 'hidden'}><ExploreTab /></div>
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
  const s = { width: size, height: size }
  switch (name) {
    case 'home':
      return <svg style={s} fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
    case 'search':
      return <svg style={s} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    case 'radio':
      return <svg style={s} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm-1 4h1v2H4V9zm1 4v2H4v-2h1z" clipRule="evenodd" /></svg>
    case 'discover':
      return <svg style={s} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" /></svg>
    case 'library':
      return <svg style={s} fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
    default:
      return null
  }
}
