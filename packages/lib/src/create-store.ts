import cloneDeep from "lodash/cloneDeep"
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
  const clone = (cloneDeep(state) as any) as STATE
  const state$ = new BehaviorSubject(clone)
  return RxStore.of(state$, opts)
}

// function deepFreeze(obj: object) {
//   // Retrieve the property names defined on object
//   // obj[immerable] = true

//   var propNames = Object.getOwnPropertyNames(obj)

//   // Freeze properties before freezing self

//   for (let name of propNames) {
//     let value = obj[name]

//     if (!Object.isFrozen(obj[name])) obj[name] = value && typeof value === 'object' ? deepFreeze(value) : value
//   }

//   return Object.freeze(obj)
// }
