import { useState } from 'react'
import { HomeTab } from './components/HomeTab'
import { SearchTab } from './components/SearchTab'
import { RadioTab } from './components/RadioTab'
import { FavoritesTab } from './components/FavoritesTab'
import { MiniPlayer } from './components/MiniPlayer'
import { usePlayer } from './hooks'

type Tab = 'home' | 'search' | 'radio' | 'favorites'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const ps = usePlayer()
  const hasPlayer = ps.track !== null || ps.station !== null

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${hasPlayer ? 'pb-28' : 'pb-14'}`}>
        {tab === 'home' && <HomeTab />}
        {tab === 'search' && <SearchTab />}
        {tab === 'radio' && <RadioTab />}
        {tab === 'favorites' && <FavoritesTab />}
      </div>

      {/* Mini Player */}
      <MiniPlayer />

      {/* Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg)]/95 backdrop-blur-lg border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex">
          <TabButton icon="home" label="Home" active={tab === 'home'} onClick={() => setTab('home')} />
          <TabButton icon="search" label="Search" active={tab === 'search'} onClick={() => setTab('search')} />
          <TabButton icon="radio" label="Radio" active={tab === 'radio'} onClick={() => setTab('radio')} />
          <TabButton icon="heart" label="Favorites" active={tab === 'favorites'} onClick={() => setTab('favorites')} />
        </div>
      </nav>
    </div>
  )
}

function TabButton({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  const color = active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
  return (
    <button className={`flex-1 flex flex-col items-center py-2 gap-0.5 ${color}`} onClick={onClick}>
      <TabIcon name={icon} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

function TabIcon({ name }: { name: string }) {
  switch (name) {
    case 'home':
      return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
    case 'search':
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    case 'radio':
      return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm-1 4h1v2H4V9zm1 4v2H4v-2h1z" clipRule="evenodd" /></svg>
    case 'heart':
      return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
    default:
      return null
  }
}
