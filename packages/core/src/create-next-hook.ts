import { RxStore } from "./rx-store"
import { useContext } from "react"

type AppStoreProvider<S> = React.Context<RxStore<S>>
type SelectorFunction<S, T extends object> = (state: S) => T
type UpdateFunction<S> = (state: S) => void

//
// useNextHook Definitions
//

type CreateNextHookRet<S> = <T extends object>(
  selector: SelectorFunction<S, T>
) => (updateFunction: UpdateFunction<T>) => void

// not-scoped
export function createNextHook<S extends object>(
  provider: AppStoreProvider<S>
): CreateNextHookRet<S>

// scoped
export function createNextHook<S extends object, T extends object>(
  provider: AppStoreProvider<S>,
  scope: SelectorFunction<S, T>
): CreateNextHookRet<T>

export function createNextHook<S extends object, T extends object>(
  provider: AppStoreProvider<S>,
  scope?: SelectorFunction<S, T>
) {
  function useNextHook<T extends object>(
    selector: SelectorFunction<S, T>
  ): (updateFunction: UpdateFunction<T>) => void {
    const store = useContext(provider)
    const outterSelector = scope ? scope : (state: S) => state

    async function updateState(updateFunction: UpdateFunction<T>) {
      return store.next(currentState => {
        const subState = selector(outterSelector(currentState as any) as any)
        updateFunction(subState)
      })
    }

    return updateState
  }

  return useNextHook
}
