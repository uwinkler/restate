import { setAutoFreeze, enablePatches } from 'immer'
import { BehaviorSubject } from 'rxjs'
import { Middleware, RxStore, RxStoreOptions, StatePackage } from './rx-store'

enablePatches()

export type CreateStoreProps<STATE, TRACE> = {
  state: STATE
  middleware?: Middleware<STATE>[]
  options?: Partial<RxStoreOptions>
  trace?: TRACE
}

export const RESTATE_STORE_DEFAULT_OPTIONS: RxStoreOptions = {
  freeze: true,
  storeName: 'STORE',
  dev: process.env.NODE_ENV !== 'production'
}

export function createStore<STATE, TRACE = any>({
  state,
  middleware = [],
  options = RESTATE_STORE_DEFAULT_OPTIONS,
  trace
}: CreateStoreProps<STATE, TRACE>) {
  const opts = { ...RESTATE_STORE_DEFAULT_OPTIONS, ...options }
  setAutoFreeze(opts.freeze)

  const initialStatePackage: StatePackage<STATE, TRACE> = {
    state,
    trace
  }

  const state$ = new BehaviorSubject(initialStatePackage)

  return RxStore.of(state$, middleware, opts)
}
