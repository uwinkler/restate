import { useContext, useEffect, useMemo, useState } from 'react'
import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'
import { RxStore } from './rx-store'

//
// Types

type RxStoreContext<S> = React.Context<RxStore<S>>

type SelectorFunction<S, T> = (state: S) => T

export interface StateHookProps<S> {
  deps?: any
  compare?: (previous: S, next: S) => boolean
}

const identitySelectorFunction: SelectorFunction<any, any> = (state) => state

export type UseSelectorHook<S> = <T>(
  selectorFunction: SelectorFunction<S, T>,
  props?: StateHookProps<T>
) => T

//
// createStateHook definition
//
export function createSelectorHook<S>(
  context: React.Context<RxStore<S>>
): UseSelectorHook<S>

export function createSelectorHook<S, SUB_STATE>(
  context: React.Context<RxStore<S>>,
  outerSelector: SelectorFunction<S, SUB_STATE>
): UseSelectorHook<SUB_STATE>

//
// createStateHook implementation
//
export function createSelectorHook<S, SUB_STATE>(
  context: RxStoreContext<S>,
  outerSelector: SelectorFunction<S, SUB_STATE> = identitySelectorFunction
) {
  function useAppState<T>(
    selector: SelectorFunction<SUB_STATE, T>,
    props?: StateHookProps<T>
  ): T {
    const _store: RxStore<S> = useContext(context)

    const _props = {
      deps: [],
      compare: undefined,
      ...props
    }
    const state = _store.state
    const deps = _props.deps

    const startValue = useMemo(
      () => getSelectedValue(state, outerSelector, selector),
      [...deps]
    )

    const [value, setValue] = useState<T>(startValue)

    const output$ = useMemo(() => {
      return new BehaviorSubject(startValue)
    }, [state])

    useEffect(() => {
      const stateSub = _store.state$.subscribe((nextStateValue) => {
        const nextValue = getSelectedValue(
          nextStateValue.state,
          outerSelector,
          selector
        )
        output$.next(nextValue)
      })

      const outputSub = output$
        .pipe(distinctUntilChanged())
        .subscribe((nextStateValue) => setValue(nextStateValue))

      return function cleanup() {
        stateSub.unsubscribe()
        outputSub.unsubscribe()
      }
    }, [output$, ...deps])

    return value
  }

  return useAppState
}

function getSelectedValue<S, SUB_STATE, T>(
  state: S,
  outerSelector: SelectorFunction<S, SUB_STATE>,
  selector: SelectorFunction<SUB_STATE, T> | SelectorFunction<any, any>
) {
  const subState = outerSelector(state)
  const value = selector(subState)
  return value
}
