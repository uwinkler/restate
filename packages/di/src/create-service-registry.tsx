import React, { PropsWithChildren } from 'react'

type ServiceMap = Record<string, Function>

function createServiceRegistry(name: string) {
  type ServiceRegistryType = {
    set: (name: string, service: Function) => void
    get: (name: string) => Function
    has: (name: string) => boolean
    remove: (name: string) => void
    restoreDefault: (name: string) => void
    registerDefault: (name: string, service: Function) => void
  }

  const Ctx = React.createContext<ServiceRegistryType>(null as any)

  const ServiceRegistry = (props: PropsWithChildren) => {
    const [serviceMap, setServiceMap] = React.useState<ServiceMap>({})
    const [key, setKey] = React.useState(0) // Using a key to force re-mounting,otherwise we get except
    const defaultMap = React.useRef<ServiceMap>({})

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
