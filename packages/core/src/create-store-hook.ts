import { RestateStore } from './rx-store'
import { useContext } from 'react'

export function createStoreHook<S extends Object>(
  provider: React.Context<RestateStore<S>>
) {
  return function useStore() {
    const store = useContext(provider)
    return store
  }
}
