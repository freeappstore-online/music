import { useSyncExternalStore } from 'react'
import { player, type PlayerState } from './services/player'

const initialState = player.state

export function usePlayer(): PlayerState {
  return useSyncExternalStore(
    (cb) => player.subscribe(cb),
    () => player.state,
    () => initialState,
  )
}
