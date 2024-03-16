// Provider

import React, { useContext } from 'react'

const initialHookMap = new Map<Function, Function>()
const HookContext = React.createContext(new Map<Function, Function>())

export function HookProvider({
  children,
  hooks = []
}: {
  children: React.ReactNode
  hooks?: Array<[Function, Function]>
}) {
  const parentContext = useContext(HookContext) || new Map()

  const hooksToUse = React.useMemo(
    () => mergeMap(mergeMap(initialHookMap, parentContext), new Map(hooks)),
    [hooks, parentContext]
  )

  return (
    <HookContext.Provider value={hooksToUse}>{children}</HookContext.Provider>
  )
}

export function createInjectableHook<T extends (...args: any[]) => any>(
  hook: T
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  return function useHook(...args: Parameters<T>): ReturnType<T> {
    const hooks = useContext(HookContext)

    const hookImplementationToUse = React.useMemo(() => {
      const hookInRegistry = hooks.get(useHook)

      if (hookInRegistry === useHook) {
        throw new Error('Cannot mock a hook with itself')
      }

      return hookInRegistry || hook
    }, [hooks])

    return hookImplementationToUse(...args)
  }
}

export function mock<T extends (...args: any[]) => any>(
  func1: T,
  func2: T
): [T, T] {
  return [func1, func2]
}

function mergeMap(
  map1: Map<Function, Function>,
  map2: Map<Function, Function>
) {
  const result = new Map(map1)
  for (const [key, value] of map2) {
    result.set(key, value)
  }
  return result
}
