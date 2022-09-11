import { current } from 'immer'
import { useContext } from 'react'
import { Message, RESTATE_UPDATE_MESSAGE } from './message'
import { RxStore } from './rx-store'
import { isFunction } from './utils'

type AppStoreProvider<S, M extends Message> = React.Context<RxStore<S, M>>
type SelectorFunction<S, T> = (state: S) => T
type UpdateFunction<S> = (state: S) => void

//
// useNextHook Definitions
//

type CreateNextHookRet<S> = <T>(
  selector: SelectorFunction<S, T>,
  type?: string
) => (updateFunction: UpdateFunction<T> | T) => void | T

// not-scoped
export function createNextHook<S extends object, M extends Message>(
  provider: AppStoreProvider<S, M>
): CreateNextHookRet<S>

// scoped
export function createNextHook<S extends object, T, M extends Message>(
  provider: AppStoreProvider<S, M>,
  scope: SelectorFunction<S, T>
): CreateNextHookRet<T>

export function createNextHook<S extends object, T, M extends Message>(
  provider: AppStoreProvider<S, M>,
  scope?: SelectorFunction<S, T>
) {
  function useNextHook<T>(
    selector: SelectorFunction<S, T>,
    type?: string
  ): (updateFunction: UpdateFunction<T>) => void {
    const store = useContext(provider)
    const outerSelector = scope ? scope : (state: S) => state

    function updateNestedState(rootState: any, nextValue: T) {
      const r = current(rootState)
      const path: string[] = []

      //
      const proxyAccess = {
        get(target: any, key: any): any {
          if (typeof target[key] === 'object' && target[key] !== null) {
            path.push(key)
            return new Proxy(target[key], proxyAccess)
          } else {
            path.push(key)
            return target[key]
          }
        }
      }
      const proxy = new Proxy(r, proxyAccess)
      selector(outerSelector(proxy as any) as any)

      function walk(obj: any, p: string[]): void {
        if (p.length > 1) {
          const [head, ...tail] = p
          return walk(obj[head], tail)
        }
        const key = p[0]
        obj[key] = nextValue
      }

      walk(rootState, path)
    }

    async function updateState(
      updateFunctionOrNextState: UpdateFunction<T> | T
    ) {
      return store.next(
        (currentState) => {
          if (isFunction(updateFunctionOrNextState)) {
            const subState = selector(outerSelector(currentState as any) as any)
            return updateFunctionOrNextState(subState)
          } else {
            updateNestedState(
              outerSelector(currentState),
              updateFunctionOrNextState
            )
          }
        },
        { type: type || RESTATE_UPDATE_MESSAGE.type } as any
      )
    }

    return updateState
  }

  return useNextHook
}

const proxyAccess = {
  get(target: any, key: any): any {
    console.log('get:', target, key)
    if (typeof target[key] === 'object' && target[key] !== null) {
      console.log('recursive ->', key)
      return new Proxy(target[key], proxyAccess)
    } else {
      console.log('target prop key', key)
      return target[key]
    }
  }
}
