import { setAutoFreeze } from "immer"
import { BehaviorSubject } from "rxjs"
import { RxStore, RxStoreOptions } from "./rx-store"

type CreateStoreProps<StateType> = {
  state: StateType
  options?: Partial<RxStoreOptions>
}

const defaultOptions: RxStoreOptions = {
  freeze: true,
  storeName: "STORE"
}

export function createStore<STATE>({
  state,
  options = defaultOptions
}: CreateStoreProps<STATE>) {
  const opts = { ...defaultOptions, ...options }
  setAutoFreeze(opts.freeze)
  const state$ = new BehaviorSubject(state)
  return RxStore.of(state$, opts)
}
