import React from 'react'
import { Observable } from 'rxjs'
import { useServiceRegistry } from './create-service-registry'

export type ServiceObservable<T> = Observable<T | null>

export type Service<T> = (
  mock?: () => T
) => (props: { children?: React.ReactNode }) => JSX.Element

export type ServiceHook<T> = () => T

export type ServiceProvider<T> = (props: {
  children?: React.ReactNode
  implementation?: () => T
}) => JSX.Element

export type ServiceSelector<T> = <U>(
  sel: (ctx: T) => U,
  comparator?: (a: U, b: U) => boolean
) => U

type CreateServiceProvider<Name extends string, T> = {
  [key in `${Name}Service`]: ServiceProvider<T>
}

type CreateServiceHook<Name extends string, T> = {
  [key in `use${Name}`]: ServiceHook<T>
}

type CreateServiceSelectorHook<Name extends string, T> = {
  [key in `use${Name}Selector`]: ServiceSelector<T>
}

type CreateServiceContext<Name extends string, T> = {
  [key in `${Name}Context`]: React.Context<T>
}

type CreateServiceReturn<N extends string, T> = CreateServiceProvider<N, T> &
  CreateServiceHook<N, T> &
  CreateServiceSelectorHook<N, T> &
  CreateServiceContext<N, T>

export function createService<T, N extends string>(
  name: N,
  service: () => T
): CreateServiceReturn<N, T> {
  const Ctx = React.createContext<() => T>(null as any)

  Ctx.displayName = name as string

  function ServiceProvider(props: {
    children?: React.ReactNode
    id?: string
    implementation?: () => T
  }) {
    const { implementation, children } = props
    const registry = useServiceRegistry()

    function getHook() {
      if (implementation) {
        return implementation
      }
      if (registry.has(name)) {
        return registry.get(name)
      } else {
        registry.registerDefault(name, service)
        return service
      }
    }

    const ctx = getHook() as () => T

    return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
  }

  function useService() {
    const registry = useServiceRegistry()

    if (!registry) {
      throw new Error(`This component should be wrapped by a service registry`)
    }
    if (!registry.has(name)) {
      registry.registerDefault(name, service)
    }
    const serviceHook = registry.get(name) || service
    return serviceHook()
  }

  function useSelector<U>(
    selector: (ctx: T) => U,
    comparator: (a: U, b: U) => boolean = (a, b) => a === b
  ) {
    const ctx = useService()
    const next = selector(ctx())
    const [state, setState] = React.useState(next)

    if (!comparator(state, next)) {
      setState(next)
    }

    return state
  }

  // We attach the ctx observable to the ServiceProvider so
  // we can have an easy to use `connectDevTools(ServiceProvider)` API.
  ServiceProvider.displayName = name

  return {
    [`${name}Service`]: ServiceProvider,
    [`use${name}`]: useService,
    [`use${name}Selector`]: useSelector,
    [`${name}Context`]: Ctx
  } as CreateServiceReturn<N, T>
}
