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

export function ServiceRegistry(
  props: React.PropsWithChildren<{
    services: ServiceRegistryEntry[]
    name?: string
  }>
) {
  const { name = 'ServiceRegistry', services } = props
  const parent = useServiceRegistry()
  const [servicesToUse, setServicesToUse] = React.useState(services)

  const context = React.useMemo(
    () => createContext({ services: servicesToUse, name, parent }),
    [servicesToUse, name, parent]
  )

  React.useEffect(() => {
    function report() {}
    window.addEventListener('message', report)
    return () => {
      window.addEventListener('message', (e) => {
        // console.log('message', e)
      })
    }
  }, [])

  return (
    <Ctx.Provider value={context}>
      <HookMount services={servicesToUse}>{props.children}</HookMount>
    </Ctx.Provider>
  )
}

function HookMount(
  props: React.PropsWithChildren<{ services: ServiceRegistryEntry[] }>
) {
  const context = useServiceRegistry()

  const registryObservable = React.useMemo(() => {
    if (!(window as any).__RESTATE_SERVICE_REGISTRY__) {
      ;(window as any).__RESTATE_SERVICE_REGISTRY__ = new BehaviorSubject(null)
    }
    return (window as any).__RESTATE_SERVICE_REGISTRY__ as BehaviorSubject<any>
  }, [])

  props.services.forEach((entry) => {
    const hookResult = entry.service()
    const observable = context.getObservable(entry.name)
    observable.next(hookResult)
    registryObservable.next({ name: entry.name, value: hookResult })
  })

  return <>{props.children}</>
}

export function useServiceRegistry() {
  return useContext(Ctx)
}
