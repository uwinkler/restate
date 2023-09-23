import React from 'react'
import { RxStore } from './rx-store'

export type RxStoreContext<S> = React.Context<RxStore<S>>

export function createProvider<S>(store: RxStore<S>): RxStoreContext<S> {
  return React.createContext(store)
}
