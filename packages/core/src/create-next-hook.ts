import { RxStore } from './rx-store'
import { useContext } from 'react'
import { Message, RESTATE_UPDATE_MESSAGE } from './message'

type AppStoreProvider<S, M extends Message> = React.Context<RxStore<S, M>>
type SelectorFunction<S, T extends object> = (state: S) => T
type UpdateFunction<S> = (state: S) => void

//
// useNextHook Definitions
//

type CreateNextHookRet<S> = <T extends object>(
  selector: SelectorFunction<S, T>,
  type?: string
) => (updateFunction: UpdateFunction<T>) => void

// not-scoped
export function createNextHook<S extends object, M extends Message>(
  provider: AppStoreProvider<S, M>
): CreateNextHookRet<S>

// scoped
export function createNextHook<S extends object, T extends object, M extends Message>(
  provider: AppStoreProvider<S, M>,
  scope: SelectorFunction<S, T>
): CreateNextHookRet<T>

export function createNextHook<S extends object, T extends object, M extends Message>(
  provider: AppStoreProvider<S, M>,
  scope?: SelectorFunction<S, T>
) {
  function useNextHook<T extends object>(
    selector: SelectorFunction<S, T>,
    type?: string
  ): (updateFunction: UpdateFunction<T>) => void {
    const store = useContext(provider)
    const outerSelector = scope ? scope : (state: S) => state

    async function updateState(updateFunction: UpdateFunction<T>) {
      return store.next(
        (currentState) => {
          const subState = selector(outerSelector(currentState as any) as any)
          updateFunction(subState)
        },
        { type: type || RESTATE_UPDATE_MESSAGE.type } as any
      )
    }

    return updateState
  }

  return useNextHook
}
