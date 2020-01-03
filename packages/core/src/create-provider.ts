import React from "react"
import { RxStore } from "./rx-store"
import { Message } from "./message"

export function createProvider<S, M extends Message>(store: RxStore<S, M>) {
  return React.createContext(store)
}
