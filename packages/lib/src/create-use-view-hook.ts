import { RxStore } from "./rx-store"
import { useContext, useState, useEffect } from "react"

type CreateUseStoreHookInput<S> = React.Context<RxStore<S>>

type ViewHookFunction<S, T> = (state: S) => T

export function createUseViewHook<S extends object>(
  provider: CreateUseStoreHookInput<S>
) {
  function useView<T>(mapFunction: ViewHookFunction<S, T>) {
    const store = useContext(provider)
    const state$ = store.state$

    const [value, setValue] = useState<T>(mapFunction(state$.value))

    useEffect(() => {
      const subscribtion = state$.subscribe(nextStateValue =>
        setValue(mapFunction(nextStateValue))
      )

      return function cleanup() {
        subscribtion.unsubscribe()
      }
    }, [state$])

    return value as T
  }

  return useView
}
