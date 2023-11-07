import React from 'react'
import { RestateStore } from './rx-store'

export type RxStoreContext<S> = React.Context<RestateStore<S>>

export function createProvider<S>(store: RestateStore<S>): RxStoreContext<S> {
  return React.createContext(store)
}
