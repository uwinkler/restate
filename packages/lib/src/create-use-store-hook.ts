import { createUseStoreStateHook } from './create-use-store-state-hook'
import { createUseStoreUpdateHook } from './index'
import { RxStore, UpdateFunction } from './rx-store'

type RxStoreContext<S> = React.Context<RxStore<S>>
type SelectorFunction<S, T extends object> = (state: S) => T

export function createUseStoreHook<S extends object>(context: RxStoreContext<S>) {
  const useStoreUpdateHook = createUseStoreUpdateHook(context)
  const useStoreStateHook = createUseStoreStateHook(context)

  function useStore<T extends object>(
    selectorFunction?: SelectorFunction<S, T>,
  ): [T, (updateFunction: UpdateFunction<T>) => void] {
    const state = useStoreStateHook(selectorFunction)
    const nextState = useStoreUpdateHook(selectorFunction)
    return [state, nextState]
  }
  return useStore
}
