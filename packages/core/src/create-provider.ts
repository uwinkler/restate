import React from "react"
import { RxStore, Message } from "./rx-store"

export function createProvider<S, M extends Message>(store: RxStore<S, M>) {
  return React.createContext(store)
}
