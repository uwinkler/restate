import { RxStore } from './rx-store'
import { useContext } from 'react'
import { Message, RESTATE_UPDATE_MESSAGE } from './message'
import { isFunction } from 'lodash'

type AppStoreProvider<S, M extends Message> = React.Context<RxStore<S, M>>
type SelectorFunction<S, T extends object> = (state: S) => T
type UpdateFunction<S> = (state: S) => void

//
// useNextHook Definitions
//

type CreateNextHookRet<S> = <T extends object>(
  selector: SelectorFunction<S, T>,
  type?: string
) => (updateFunction: UpdateFunction<T> | T) => void | T

export function createBindHook<S extends object, M extends Message>(
  provider: AppStoreProvider<S, M>
): CreateNextHookRet<S>

// scoped
export function createNextHook<
  S extends object,
  T extends object,
  M extends Message
>(
  provider: AppStoreProvider<S, M>,
  scope: SelectorFunction<S, T>
): CreateNextHookRet<T>

export function createBindHook<
  S extends object,
  T extends object,
  M extends Message
>(provider: AppStoreProvider<S, M>, scope?: SelectorFunction<S, T>) {
  function useNextHook<T extends object>(
    selector: SelectorFunction<S, T>,
    type?: string
  ): (updateFunction: UpdateFunction<T>) => void {
    const store = useContext(provider)
    const outerSelector = scope ? scope : (state: S) => state

    async function updateState(
      updateFunctionOrNextState: UpdateFunction<T> | T
    ) {
      return store.next(
        (currentState) => {
          if (isFunction(updateFunctionOrNextState)) {
            const subState = selector(outerSelector(currentState as any) as any)
            return updateFunctionOrNextState(subState)
          } else {
            const subState = selector(outerSelector(currentState as any) as any)
            updateNestedState(currentState, subState, updateFunctionOrNextState)
          }
        },
        { type: type || RESTATE_UPDATE_MESSAGE.type } as any
      )
    }

    return updateState
  }

  return useNextHook
}

//
// TODO: this is slow in large object trees. What we could do is to get the path
// to the nested state using immer and memorize the path so we address the
// state directly
//
function updateNestedState(root: object, current: object, next: object) {
  const entries = Object.entries(root)
  const r = root as any

  for (let e of entries) {
    const [key, obj] = e
    if (obj === current) {
      r[key] = next
      return true
    }
  }

  for (let e of entries) {
    const [_, obj] = e
    if (hasChildren(obj)) {
      const found = updateNestedState(obj, current, next)
      if (found) {
        return true
      }
    }
  }

  return false
}

function hasChildren(obj: any) {
  return obj && typeof obj === 'object' && Object.entries.length > 0
}
