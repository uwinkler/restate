import React, { PropsWithChildren } from 'react'
import { createObservable, Observable } from './observable'

type FunctionMap = Record<string, Function>

// The observable map is a map of observables, where the key is the name of the service
// and the value is the latest context result for that service
type ObservableMap = Record<string, Observable<any>>

export type ServiceRegistryType = {
  set: (name: string, service: Function) => void
  get: (name: string) => Function
  has: (name: string) => boolean
  remove: (name: string) => void
  restoreDefault: (name: string) => void
  registerDefault: (name: string, service: Function) => void
  registerObservable: (name: string, observable: Observable<any>) => void
  getObservable: (name: string) => Observable<any>
  getObservableMap: () => ObservableMap
  getRegistryObservable: () => Observable<ObservableMap>
}

function createServiceRegistry(name: string) {
  const Ctx = React.createContext<ServiceRegistryType>(null as any)

  const ServiceRegistry = (props: PropsWithChildren) => {
    const [serviceMap, setServiceMap] = React.useState<FunctionMap>({})
    const [key, setKey] = React.useState(0) // Using a key to force re-mounting, otherwise we get exceptions
    const defaultMap = React.useRef<FunctionMap>({})
    const observableMap = React.useRef<ObservableMap>({})
    const registryObservable = React.useRef(createObservable<ObservableMap>())

    const incrementKey = () => setKey(key + 1)

    const context = {
      set: (name: string, service: Function) => {
        setServiceMap({ ...serviceMap, [name]: service })
        incrementKey()
      },
      get: (name: string) => {
        return serviceMap[name] || defaultMap.current[name]
      },
      has: (name: string) => {
        return serviceMap[name] !== undefined
      },
      remove: (name: string) => {
        const nextServiceMap = { ...serviceMap }
        delete nextServiceMap[name]
        setServiceMap(nextServiceMap)
        const nextDefaultMap = { ...defaultMap.current }
        delete nextDefaultMap[name]
        defaultMap.current = nextDefaultMap
        incrementKey()
      },
      restoreDefault: (name: string) => {
        setServiceMap({
          ...serviceMap,
          [name]: defaultMap.current[name]
        })
        incrementKey()
      },
      registerDefault: (name: string, service: Function) => {
        defaultMap.current = { ...defaultMap.current, [name]: service }
      },
      registerObservable: (name: string, observable: Observable<any>) => {
        observableMap.current = { ...observableMap.current, [name]: observable }
        registryObservable.current.next(observableMap.current)
      },
      getObservable: (name: string) => {
        return observableMap.current[name]
      },
      getObservableMap: () => {
        return observableMap.current
      },
      getRegistryObservable: () => {
        return registryObservable.current
      }
    }

    return (
      <Ctx.Provider key={key} value={context}>
        {props.children}
      </Ctx.Provider>
    )
  }

  ServiceRegistry.displayName = name

  const useServiceRegistry = () => React.useContext(Ctx)
  return { ServiceRegistry, useServiceRegistry }
}

export const { ServiceRegistry, useServiceRegistry } = createServiceRegistry(
  'RestateServiceRegistry'
)
