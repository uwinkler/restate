import React from "react"
import { RxStore } from "./rx-store"

export function createProvider<S>(store: RxStore<S>) {
  return React.createContext(store)
}
