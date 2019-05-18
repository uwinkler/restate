import { RxStore } from "./rx-store"
import { useContext } from "react"

export function createStoreHook<S>(provider: React.Context<RxStore<S>>) {
  return function useStore() {
    const store = useContext(provider)
    return store
  }
}
