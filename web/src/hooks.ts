import { useState, useEffect, useSyncExternalStore } from 'react'
import { player, type PlayerState } from './services/player'

export function usePlayer(): PlayerState {
  return useSyncExternalStore(
    (cb) => player.subscribe(cb),
    () => player.state,
  )
}

export function useDebounce(value: string, ms = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}
