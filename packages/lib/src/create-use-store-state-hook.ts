import { BehaviorSubject } from "rxjs"
import { distinctUntilChanged } from "rxjs/operators"
import { RxStore } from "./rx-store"
import { useContext, useEffect, useMemo, useState } from "react"

type RxStoreContext<S> = React.Context<RxStore<S>>
type SelectorFunction<S, T> = (state: S) => T

type IdentifySelectorFunction<S> = (state: S) => S
const identifySelectorFunction: IdentifySelectorFunction<any> = state => state

export function createUseStoreStateHook<S extends object>(
  context: RxStoreContext<S>
) {
  function useStore<T extends object>(
    selectorFunction?: SelectorFunction<S, T>
  ): T {
    const _store = useContext(context)
    const selector = selectorFunction
      ? selectorFunction
      : identifySelectorFunction
    const state$ = _store.state$
    const startValue = selector(state$.value)

    const [value, setValue] = useState<T>(startValue)

    const output$ = useMemo(() => {
      return new BehaviorSubject(startValue)
    }, [state$])

    useEffect(() => {
      const subscription = state$.subscribe(nextStateValue => {
        const nextSubValue = selector(nextStateValue)
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
