import React from 'react'
import { RxStore } from './rx-store'
import { Message } from './message'

export type RxStoreContext<S, M extends Message> = React.Context<RxStore<S, M>>

export function createProvider<S, M extends Message>(store: RxStore<S, M>): RxStoreContext<S, M> {
  return React.createContext(store)
}
