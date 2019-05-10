import { RxStore } from './rx-store'
import { useContext } from 'react'

type CreateUseObservableHook<S> = React.Context<RxStore<S>>

export function createUseObservableHook<S extends object>(provider: CreateUseObservableHook<S>) {
  function useObservable() {
    const store = useContext(provider)
    return store.state$
  }
  return useObservable
}
