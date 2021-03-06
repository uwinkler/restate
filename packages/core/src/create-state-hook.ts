import { BehaviorSubject } from "rxjs"
import { distinctUntilChanged } from "rxjs/operators"
import { RxStore } from "./rx-store"
import { useContext, useEffect, useMemo, useState } from "react"
import { Message } from "./message"

//
// Types

type RxStoreContext<S, M extends Message> = React.Context<RxStore<S, M>>

type SelectorFunction<S, T> = (state: S) => T

export interface StateHookProps<S> {
  deps?: any
  compare?: (previous: S, next: S) => boolean
}

const identitySelectorFunction: SelectorFunction<any, any> = state => state

export type UseStoreHook<S> = <T>(
  selectorFunction: SelectorFunction<S, T>,
  props?: StateHookProps<T>
) => T

//
// createStateHook definition
//
export function createStateHook<S, M extends Message>(
  context: React.Context<RxStore<S, M>>
): UseStoreHook<S>

export function createStateHook<S, SUB_STATE, M extends Message>(
  context: React.Context<RxStore<S, M>>,
  outerSelector: SelectorFunction<S, SUB_STATE>
): UseStoreHook<SUB_STATE>

//
// createStateHook implementation
//
export function createStateHook<S, SUB_STATE, MESSAGES extends Message>(
  context: RxStoreContext<S, MESSAGES>,
  outerSelector: SelectorFunction<S, SUB_STATE> = identitySelectorFunction
) {
  function useAppState<T>(
    selector: SelectorFunction<SUB_STATE, T>,
    props?: StateHookProps<T>
  ): T {
    const _store: RxStore<S, MESSAGES> = useContext(context)

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
      const stateSub = _store.state$.subscribe(nextStateValue => {
        const nextValue = getSelectedValue(
          nextStateValue.state,
          outerSelector,
          selector
        )
        output$.next(nextValue)
      })

      const outputSub = output$
        .pipe(distinctUntilChanged(_props.compare))
        .subscribe(nextStateValue => setValue(nextStateValue))

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
