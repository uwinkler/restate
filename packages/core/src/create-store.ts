import { setAutoFreeze } from "immer"
import { BehaviorSubject } from "rxjs"
import {
  INIT_MESSAGE,
  Message,
  Middleware,
  RxStore,
  RxStoreOptions,
  StatePackage
} from "./rx-store"

type CreateStoreProps<StateType, M extends Message> = {
  state: StateType
  middleware?: Middleware<StateType, M>[]
  options?: Partial<RxStoreOptions>
}

const defaultOptions: RxStoreOptions = {
  freeze: true,
  storeName: "STORE"
}

export function createStore<STATE, M extends Message>({
  state,
  middleware = [],
  options = defaultOptions
}: CreateStoreProps<STATE, M>) {
  const opts = { ...defaultOptions, ...options }
  setAutoFreeze(opts.freeze)

  const initialStatePackage: StatePackage<STATE, M> = {
    state: state,
    message: INIT_MESSAGE as any
  }

  const state$ = new BehaviorSubject(initialStatePackage)

  return RxStore.of(state$, middleware, opts)
}
