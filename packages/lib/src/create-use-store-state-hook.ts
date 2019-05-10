import { BehaviorSubject } from "rxjs"
import { distinctUntilChanged } from "rxjs/operators"
import { RxStore } from "./rx-store"
import { useContext, useEffect, useMemo, useState } from "react"

//
// Types

type RxStoreContext<S> = React.Context<RxStore<S>>

type SelectorFunction<S, T> = (state: S) => T

const identifySelectorFunction: SelectorFunction<any, any> = state => state

export type UseStoreHookWithSelectorFunction<S> = <T>(
  selectorFunction?: SelectorFunction<S, T>
) => T

export type UseStoreHookWithoutSelectorFunction<S> = () => S

export type UseStoreStateHook<S> =
  | UseStoreHookWithSelectorFunction<S>
  | UseStoreHookWithoutSelectorFunction<S>

export function createUseStoreStateHook<S>(
  context: React.Context<RxStore<S>>
): UseStoreStateHook<S>

export function createUseStoreStateHook<S, SUB_STATE>(
  context: React.Context<RxStore<S>>,
  outerSelector: SelectorFunction<S, SUB_STATE>
): UseStoreStateHook<SUB_STATE>

//
// Implementation

export function createUseStoreStateHook<S, SUB_STATE>(
  context: RxStoreContext<S>,
  outerSelector: SelectorFunction<S, SUB_STATE> = identifySelectorFunction
) {
  function useStore<T>(selectorFunction?: SelectorFunction<SUB_STATE, T>): T {
    const _store = useContext(context)
    const selector = selectorFunction
      ? selectorFunction
      : identifySelectorFunction
    const state$ = _store.state$
    const startValue = selector(outerSelector(state$.value))

    const [value, setValue] = useState<T>(startValue)

    const output$ = useMemo(() => {
      return new BehaviorSubject(startValue)
    }, [state$])

    useEffect(() => {
      const subscription = state$.subscribe(nextStateValue => {
        const nextSubValue = selector(outerSelector(nextStateValue))
        output$.next(nextSubValue)
      })

      output$
        .pipe(distinctUntilChanged())
        .subscribe(nextStateValue => setValue(nextStateValue))

      return function cleanup() {
        subscription.unsubscribe()
      }
    }, [output$])

    return value
  }

  return useStore
}

// export function createUseStoreStateHook<S>(
//   context: RxStoreContext<S>
// ): CreateUseStoreStateHook
