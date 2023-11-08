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
      const proxy = getProxy({ subState, selector, outerSelector })
      mutateNestedObject({ proxy, nextValue })
      return subState
    }

    function updateState(updateFunctionOrNextState: UpdateFunction<T> | T) {
      return store.next((currentState) => {
        if (isFunction(updateFunctionOrNextState)) {
          const subState = selector(outerSelector(currentState as any) as any)
          return updateFunctionOrNextState(subState)
        } else {
          const nextValue = updateFunctionOrNextState
          return updateNestedState(currentState, nextValue)
        }
      }, trace)
    }

    return updateState
  }

  return useNextHook
}

function getProxy(props: {
  subState: object
  selector: (s: any) => any
  outerSelector: (s: any) => any
}) {
  const { subState, selector, outerSelector } = props
  // we have to "unfreeze" the frozen state, if frozen
  const unfrozenSupState = Object.isFrozen(subState)
    ? Object.assign({}, current(subState))
    : subState

  let path: any = []

  const proxyAccess = (parent: any) => ({
    get(target: any, key: any): any {
      if (Array.isArray(target) && isNaN(key)) {
        return target[key]
      }

      path.push({
        parent,
        target,
        key,
        idx: Array.isArray(parent) ? parent.indexOf(target) : -1
      })

      if (key === '___restate_parent___') {
        return parent
      }
      // if (key === '__parent__') {
      // return parent
      if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], proxyAccess(target))
      } else if (Array.isArray(target) && !isNaN(key)) {
        return new Proxy(target[key], proxyAccess(target))
      } else {
        return target[key]
      }
    }
  })

  const proxy = new Proxy(unfrozenSupState, proxyAccess(unfrozenSupState))
  const target = selector(outerSelector(proxy) as any)
  if (Array.isArray(target.___restate_parent___)) {
    return {
      ...path.at(-1),
      isArray: true
    }
  }
  return { ...path.at(-1), isArray: false, idx: -1 }
}

function mutateNestedObject(props: { proxy: any; nextValue: any }): void {
  const { proxy, nextValue } = props
  const { target, key, isArray, idx, parent } = proxy
  if (isArray && typeof parent[idx] === typeof nextValue) {
    parent[idx] = nextValue
  } else {
    target[key] = nextValue
  }
}
