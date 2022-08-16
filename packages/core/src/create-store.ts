import { enableAllPlugins, setAutoFreeze } from 'immer'
import { BehaviorSubject } from 'rxjs'
import { Message, RESTATE_INIT_MESSAGE } from './message'
import { Middleware, RxStore, RxStoreOptions, StatePackage } from './rx-store'

enableAllPlugins()

export type CreateStoreProps<StateType, M extends Message> = {
  state: StateType
  middleware?: Middleware<StateType, M>[]
  options?: Partial<RxStoreOptions>
}

export const RESTATE_STORE_DEFAULT_OPTIONS: RxStoreOptions = {
  freeze: true,
  storeName: 'STORE',
  dev: process.env.NODE_ENV !== 'production'
}

export function createStore<STATE, M extends Message>({
  state,
  middleware = [],
  options = RESTATE_STORE_DEFAULT_OPTIONS
}: CreateStoreProps<STATE, M>) {
  const opts = { ...RESTATE_STORE_DEFAULT_OPTIONS, ...options }
  setAutoFreeze(opts.freeze)

  const initialStatePackage: StatePackage<STATE, M> = {
    state: state,
    message: RESTATE_INIT_MESSAGE as any
  }

  const state$ = new BehaviorSubject(initialStatePackage)

  return RxStore.of(state$, middleware, opts)
}
