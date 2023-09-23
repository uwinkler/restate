import { setAutoFreeze, enablePatches } from 'immer'
import { BehaviorSubject } from 'rxjs'
import { Middleware, RxStore, RxStoreOptions, StatePackage } from './rx-store'

enablePatches()

export type CreateStoreProps<STATE> = {
  state: STATE
  middleware?: Middleware<STATE>[]
  options?: Partial<RxStoreOptions>
}

export const RESTATE_STORE_DEFAULT_OPTIONS: RxStoreOptions = {
  freeze: true,
  storeName: 'STORE',
  dev: process.env.NODE_ENV !== 'production'
}

export function createStore<STATE>({
  state,
  middleware = [],
  options = RESTATE_STORE_DEFAULT_OPTIONS
}: CreateStoreProps<STATE>) {
  const opts = { ...RESTATE_STORE_DEFAULT_OPTIONS, ...options }
  setAutoFreeze(opts.freeze)

  const initialStatePackage: StatePackage<STATE> = {
    state: state
  }

  const state$ = new BehaviorSubject(initialStatePackage)

  return RxStore.of(state$, middleware, opts)
}
