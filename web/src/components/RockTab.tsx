import { useState } from 'react'
import { ARTISTS, ERAS, SUBGENRES, type RockArtist } from '../services/rock'

type Section = 'artists' | 'eras' | 'subgenres'

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'artists', label: 'Artists' },
  { id: 'eras', label: 'Eras' },
  { id: 'subgenres', label: 'Styles' },
]

function getItems(section: Section): RockArtist[] {
  switch (section) {
    case 'artists': return ARTISTS
    case 'eras': return ERAS
    case 'subgenres': return SUBGENRES
    default: return []
  }
}

export function RockTab() {
  const [section, setSection] = useState<Section>('artists')
  const items = getItems(section)

  return (
    <div className="pb-4">
      <div className="px-4 md:px-6 pt-6 md:pt-10 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold font-display italic">Rock</h1>
        <p className="text-sm text-text-muted mt-1">Legends of rock music</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto px-4 md:px-6 py-4 snap-x">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg snap-start transition-colors ${
              section === s.id ? 'bg-accent text-base' : 'bg-white/4 text-text-muted hover:text-text'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {section === 'artists' ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 px-4 md:px-6 mb-4">
          {items.map(a => (
            <div key={a.id} className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-surface-hover transition-colors">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10 bg-surface">
                {a.image ? (
                  <img src={a.image} alt={a.label} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">{a.icon}</div>
                )}
              </div>
              <span className="text-xs font-semibold text-center">{a.label}</span>
              {a.years && <span className="text-[9px] text-text-dim">{a.years}</span>}
              <a href={`/artist/${a.id}.html`} target="_blank" className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md bg-surface text-text-muted hover:text-text hover:bg-surface-hover transition-colors border border-border" title="Read about">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z"/></svg>
                Read
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 md:px-6 mb-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-surface">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium truncate">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
