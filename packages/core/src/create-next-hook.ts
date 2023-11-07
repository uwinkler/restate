import { current } from 'immer'
import { useContext } from 'react'
import { RestateStore } from './rx-store'
import { isFunction } from './utils'

type AppStoreProvider<S> = React.Context<RestateStore<S>>
type SelectorFunction<S, T> = (state: S) => T
type UpdateFunction<S> = (state: S) => void

type CreateNextHookRet<S> = <T, TRACE = any>(
  selector: SelectorFunction<S, T>,
  trace?: TRACE
) => (updateFunction: UpdateFunction<T> | T) => void | T

// not-scoped
export function createNextHook<S extends object>(
  provider: AppStoreProvider<S>
): CreateNextHookRet<S>

// scoped
export function createNextHook<S extends object, T>(
  provider: AppStoreProvider<S>,
  scope: SelectorFunction<S, T>
): CreateNextHookRet<T>

export function createNextHook<S extends object, T>(
  provider: AppStoreProvider<S>,
  scope?: SelectorFunction<S, T>
) {
  function useNextHook<T, TRACE = any>(
    selector: SelectorFunction<S, T>,
    trace?: TRACE
  ): (updateFunction: UpdateFunction<T>) => void {
    const store = useContext(provider)
    const outerSelector = scope ? scope : (state: S) => state

    function updateNestedState(subState: any, nextValue: T) {
      const path = getPath({ subState, selector, outerSelector })
      mutateNestedObject({ obj: subState, path, nextValue })
      return subState
    }

    function updateState(updateFunctionOrNextState: UpdateFunction<T> | T) {
      return store.next((currentState) => {
        if (isFunction(updateFunctionOrNextState)) {
          const subState = selector(outerSelector(currentState as any) as any)
          return updateFunctionOrNextState(subState)
        } else {
          const nextValue = updateFunctionOrNextState
          return updateNestedState(outerSelector(currentState), nextValue)
        }
      }, trace)
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

function getPath(props: {
  subState: object
  selector: (s: any) => any
  outerSelector: (s: any) => any
}) {
  const { subState, selector, outerSelector } = props
  // we have to "unfreeze" the frozen state, if frozen
  const unfrozenSupState = Object.isFrozen(subState)
    ? Object.assign({}, current(subState))
    : subState
  const path: string[] = []

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

  const proxy = new Proxy(unfrozenSupState, proxyAccess)

  // We "read" the value (get) recursively using proxyAccess
  // in order to determine the path
  selector(outerSelector(proxy as any) as any)

  return path
}

function mutateNestedObject(props: {
  obj: any
  path: string[]
  nextValue: any
}): void {
  const { obj, path, nextValue } = props
  if (path.length > 1) {
    const [head, ...tail] = path
    return mutateNestedObject({
      obj: obj[head],
      path: tail,
      nextValue
    })
  }
  const key = path[0]
  obj[key] = nextValue
}
