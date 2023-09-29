import { createNextHook } from './create-next-hook'
import { createSelectorHook } from './create-selector-hook'
import { RxStore } from './rx-store'

type SelectorFunction<S, T> = (state: S) => T

export function createAppStateHook<
  S extends object,
  SUB_STATE extends object,
  TRACE
>(
  context: React.Context<RxStore<S>>,
  outerSelector: SelectorFunction<S, SUB_STATE>
) {
  const useNext = createNextHook(context, outerSelector)
  const useSelect = createSelectorHook(context, outerSelector)

  return function useAppState<SUB_SUB_STATE>(
    selector: SelectorFunction<SUB_STATE, SUB_SUB_STATE>,
    options?: { trace?: TRACE }
  ): [
    value: SUB_SUB_STATE,
    next: (
      s: SUB_SUB_STATE | ((x: SUB_SUB_STATE) => void | SUB_SUB_STATE)
    ) => void
  ] {
    const value: SUB_SUB_STATE = useSelect(selector)
    const next = useNext(selector, options?.trace) as any

    return [value, next]
  }
}
