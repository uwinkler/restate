import React, { useContext } from 'react'
import { BehaviorSubject } from 'rxjs'

export type ServiceRegistryEntry = {
  name: string
  service: () => any
}

interface ServiceRegistryContext {
  observableMap: Map<string, BehaviorSubject<any>>
  getObservable: (name: string) => BehaviorSubject<any>
  hasService: (name: string) => boolean
  name: string
}

const Ctx = React.createContext(
  createContext({ services: [], name: 'default', parent: undefined })
)

function createContext({
  services,
  name,
  parent
}: {
  services: ServiceRegistryEntry[]
  name: string
  parent?: ServiceRegistryContext
}): ServiceRegistryContext {
  const observableMap = new Map<string, BehaviorSubject<any>>()

  function getObservable(name: string) {
    if (parent?.hasService(name)) {
      return parent.getObservable(name)
    }

    if (observableMap.has(name)) {
      return observableMap.get(name)!
    }

    const observable = new BehaviorSubject<any>(undefined)
    observableMap.set(name, observable)
    return observable
  }

  function hasService(name: string) {
    if (parent?.hasService(name)) {
      return true
    }

    return services.some((entry) => entry.name === name)
  }

  return { observableMap, getObservable, hasService, name }
}

export function createServiceRegistry(
  name: string,
  services: ServiceRegistryEntry[]
) {
  function ServiceRegistry(
    props: React.PropsWithChildren<{ override?: ServiceRegistryEntry[] }>
  ) {
    const parent = useServiceRegistry()
    const servicesToUse = React.useMemo(() => {
      const serviceSet = new Set<ServiceRegistryEntry>(services)
      if (props.override) {
        props.override.forEach((entry) => serviceSet.add(entry))
      }
      return Array.from(serviceSet)
    }, [])
    const context = React.useMemo(
      () => createContext({ services, name, parent }),
      []
    )

    return (
      <Ctx.Provider value={context}>
        <HookMount services={servicesToUse}>{props.children}</HookMount>
      </Ctx.Provider>
    )
  }

  return ServiceRegistry
}

function HookMount(
  props: React.PropsWithChildren<{ services: ServiceRegistryEntry[] }>
) {
  const context = useServiceRegistry()
  props.services.forEach((entry) => {
    const hookResult = entry.service()
    const observable = context.getObservable(entry.name)
    observable.next(hookResult)
  })

  return <>{props.children}</>
}

export function useServiceRegistry() {
  return useContext(Ctx)
}
