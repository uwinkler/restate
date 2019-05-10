import produce from 'immer'
import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'
import { RxStore } from './rx-store'
import { useContext, useMemo, useState, useEffect } from 'react'

type CreateUseStoreHookInput<S> = React.Context<RxStore<S>>
type SelectorFunction<S, T extends object> = (state: S) => T
type UpdateFunction<T> = (subState: T) => void

type IdentifySelectorFunction<S> = (state: S) => S
const identifySelectorFunction: IdentifySelectorFunction<any> = state => state

export function createUseTransactionHook<S extends object>(provider: CreateUseStoreHookInput<S>) {
  function useTransaction<T extends object>(
    selectorFunction?: SelectorFunction<S, T>,
  ): {
    store: T
    updateStore: (updateFunction: UpdateFunction<T>) => void
  } {
    const selector = selectorFunction ? selectorFunction : identifySelectorFunction

    const store = useContext(provider)
    const state$ = store.state$
    const patches$ = store.patches$
    const inversePatches$ = store.inversePatches$
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

      output$.pipe(distinctUntilChanged()).subscribe(nextStateValue => setValue(nextStateValue))

      return function cleanup() {
        subscription.unsubscribe()
      }
    }, [output$])

    function updateStore(updateFunction: UpdateFunction<T>) {
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
        },
      )
      state$.next(nextState)

      store.meta$.next({
        type: '@RX/UPDATE_USE_STORE_HOOK',
        payload: {
          func: updateFunction.toString(),
        },
      })
    }

    return { store: value, updateStore }
  }

  return useTransaction
}
