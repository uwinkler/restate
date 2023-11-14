import React from 'react'
import { RestateStore } from './rx-store'

export type RxStoreContext<S extends Object> = React.Context<RestateStore<S>>

export function createProvider<S extends Object>(
  store: RestateStore<S>
): RxStoreContext<S> {
  return React.createContext(store)
}
