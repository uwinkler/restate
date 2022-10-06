import React, { PropsWithChildren } from 'react'
import { useServiceRegistry } from './create-service-registry'
import { createObservable, Observable } from './Observable'

export type ServiceObservable<T> = Observable<T>

export type Service<T> = (
  mock?: () => T
) => (props: { children?: React.ReactNode }) => JSX.Element

export type ServiceHook<T> = {
  (): T
  <U>(sel: (t: T) => U): U
}

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

type CreateServiceObservable<Name extends string, T> = {
  [key in `${Name}Observable`]: Observable<T>
}

type CreateServiceReturn<N extends string, T> = CreateServiceProvider<N, T> &
  CreateServiceHook<N, T> &
  CreateServiceObservable<N, T>

export function createService<T, N extends string>(
  name: N,
  service: () => T
): CreateServiceReturn<N, T> {
  const observable = createObservable<T>()

  function ServiceProvider(
    props: PropsWithChildren & { implementation?: () => T }
  ) {
    const registry = useServiceRegistry()

    if (registry) {
      registry.registerDefault(name, service)
      registry.registerObservable(name, observable)
    }

    const serviceToUse = props.implementation
      ? props.implementation
      : registry
      ? registry.get(name)
      : service

    const value = serviceToUse()
    observable.next(value)

    return <>{props.children}</>
  }

  function useService<U>(selector?: (ctx: T) => U) {
    return React.useSyncExternalStore(observable.subscribe, () =>
      selector ? selector(observable.value()) : observable.value()
    )
  }

  return {
    [`${name}Service`]: ServiceProvider,
    [`use${name}`]: useService,
    [`${name}Observable`]: observable
  } as CreateServiceReturn<N, T>
}
