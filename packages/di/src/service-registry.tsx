import React, { PropsWithChildren } from 'react'

function createServiceRegistry(name: string) {
  function useServiceRegistryImplementation() {
    type ServiceMap = Record<string, Function>

    const [serviceMap, setServiceMap] = React.useState<ServiceMap>({})
    const defaultMap = React.useRef<ServiceMap>({})

    return React.useMemo(
      () => ({
        set: (name: string, service: Function) => {
          setServiceMap({ ...serviceMap, [name]: service })
        },
        get: (name: string) => {
          return serviceMap[name]
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
        },
        restoreDefault: (name: string) => {
          return setServiceMap({
            ...serviceMap,
            [name]: defaultMap.current[name]
          })
        },
        registerDefault: (name: string, service: Function) => {
          defaultMap.current = { ...defaultMap.current, [name]: service }
        }
      }),
      [serviceMap]
    )
  }

  const Ctx = React.createContext(null as any)
  //
  const ServiceRegistry = (props: PropsWithChildren) => {
    const instance = useServiceRegistryImplementation()
    return <Ctx.Provider value={instance}>{props.children}</Ctx.Provider>
  }
  ServiceRegistry.displayName = name

  const useServiceRegistry = () => React.useContext(Ctx)

  return { ServiceRegistry, useServiceRegistry }
}

export const { ServiceRegistry, useServiceRegistry } = createServiceRegistry(
  'RestateServiceRegistry'
)
