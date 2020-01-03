import { setAutoFreeze } from "immer"
import { BehaviorSubject } from "rxjs"
import { Middleware, RxStore, RxStoreOptions, StatePackage } from "./rx-store"
import { Message, RESTATE_INIT_MESSAGE } from "./message"

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
    message: RESTATE_INIT_MESSAGE as any
  }

  const state$ = new BehaviorSubject(initialStatePackage)

  return RxStore.of(state$, middleware, opts)
}
