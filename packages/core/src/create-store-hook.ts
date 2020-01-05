import { RxStore } from "./rx-store"
import { useContext } from "react"
import { Message } from "./message"

export function createStoreHook<S, M extends Message>(
  provider: React.Context<RxStore<S, M>>
) {
  return function useStore() {
    const store = useContext(provider)
    return store
  }
}
