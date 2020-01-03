import { RxStore, Message } from "./rx-store"
import { useContext } from "react"

export function createStoreHook<S, M extends Message>(
  provider: React.Context<RxStore<S, M>>
) {
  return function useStore() {
    const store = useContext(provider)
    return store
  }
}
