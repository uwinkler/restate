import { createNextHook } from './create-next-hook'
import { createSelectorHook } from './create-selector-hook'
import { Message } from './message'
import { RxStore } from './rx-store'

type SelectorFunction<S, T> = (state: S) => T

export function createAppStateHook<
  S extends object,
  SUB_STATE extends object,
  M extends Message
>(
  context: React.Context<RxStore<S, M>>,
  outerSelector: SelectorFunction<S, SUB_STATE>
) {
  const useNext = createNextHook(context, outerSelector)
  const useSelect = createSelectorHook(context, outerSelector)

  type UseAppStateReturn_Object<SUB_SUB_STATE> = (next: SUB_SUB_STATE) => void

  type UseAppStateReturn_Function<SUB_SUB_STATE> = (
    updateFunction: (next: SUB_SUB_STATE) => void | SUB_SUB_STATE
  ) => void

  type UseAppStateReturn<SUB_SUB_STATE> =
    | UseAppStateReturn_Object<SUB_SUB_STATE>
    | UseAppStateReturn_Function<SUB_SUB_STATE>

  // setName(nextName) : (nextName) => void // (next:SUB_SUB_STATE) => void
  // setName( (s) => { s.name = 'Klaus'}) // ( (next:SUB_SUB_STATE) => void ) => void
  // setName( (s) => { return { name:Klaus}}) // ( (next:SUB_SUB_STATE) => SUB_SUB_STATE ) => void

  function useAppState<SUB_SUB_STATE>(
    selector: SelectorFunction<SUB_STATE, SUB_SUB_STATE>
  ) {
    const value = useSelect(selector)
    const next = useNext(selector)

    return [value, next]
  }

  return useAppState
}
