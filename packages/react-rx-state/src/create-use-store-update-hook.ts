import produce from "immer"
import { RxStore } from "./rx-store"
import { useContext } from "react"

type CreateUseUpdateHookInput<S> = React.Context<RxStore<S>>
type SelectorFunction<S, T extends object> = (state: S) => T
type UpdateFunction<T> = (subState: T) => void

type IdentifySelectorFunction<S> = (state: S) => S
const identifySelectorFunction: IdentifySelectorFunction<any> = state => state

export function createUseStoreUpdateHook<S extends object>(
  provider: CreateUseUpdateHookInput<S>
) {
  function useUpdateStoreHook<T extends object>(
    selectorFunction?: SelectorFunction<S, T>
  ): (updateFunction: UpdateFunction<T>) => void {
    const selector = selectorFunction
      ? selectorFunction
      : identifySelectorFunction
    const store = useContext(provider)
    const state$ = store.state$
    const patches$ = store.patches$
    const inversePatches$ = store.inversePatches$

    function updateState(updateFunction: UpdateFunction<T>) {
      const currentState = state$.value
      const nextState = produce<S>(
        currentState,
        draftState => {
          const subState = selector(draftState as any)
          updateFunction(subState)
          return draftState
        },
        (patches, inversePatches) => {
          patches$.next(patches)
          inversePatches$.next(inversePatches)
        }
      )
      state$.next(nextState)

      store.meta$.next({
        type: "@RX/UPDATE_USE_UPDATE_HOOK",
        payload: {
          func: updateFunction.toString()
        }
      })
    }

    return updateState
  }

  return useUpdateStoreHook
}
