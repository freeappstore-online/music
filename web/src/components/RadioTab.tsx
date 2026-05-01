import { useEffect, useState } from 'react'
import { getTopStations, searchStations } from '../services/radio'
import type { RadioStation } from '../types'
import { StationRow } from './StationRow'

export function RadioTab() {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getTopStations(40).then(s => { setStations(s); setLoading(false) })
  }, [])

  const doSearch = async () => {
    const q = query.trim()
    if (!q) {
      setLoading(true)
      const s = await getTopStations(40)
      setStations(s)
      setLoading(false)
      return
    }
    setLoading(true)
    const s = await searchStations(q, 40)
    setStations(s)
    setLoading(false)
  }

  return (
    <div className="pb-4">
      <h1 className="text-2xl font-bold px-4 pt-4 pb-3">Radio</h1>

      <form
        className="px-4 mb-4"
        onSubmit={(e) => { e.preventDefault(); doSearch() }}
      >
        <div className="flex items-center gap-2 bg-[var(--surface)] rounded-xl px-3 py-2.5 border border-[var(--border)]">
          <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="search"
            placeholder="Search stations..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
          <span className="text-sm">No stations found</span>
        </div>
      ) : (
        stations.map(station => <StationRow key={station.id} station={station} />)
      )}
    </div>
  )
}
