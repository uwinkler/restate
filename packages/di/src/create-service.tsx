import React from 'react'
import { delay, distinctUntilChanged, skip } from 'rxjs/operators'
import { ServiceRegistryEntry, useServiceRegistry } from './service-registry'

export type Service<T> = (
  mock?: () => T
) => (props: { children?: React.ReactNode }) => JSX.Element
export type ServiceHook<T> = () => T

export function createService<T>(
  name: string,
  service: ServiceHook<T>
): [ServiceHook<T>, ServiceRegistryEntry] {
  function useService() {
    const {
      getObservable,
      hasService,
      name: serviceRegistryName
    } = useServiceRegistry()

    if (!hasService(name)) {
      throw new Error(
        `Service ${name} not found. Do you have a <ServiceRegistry/> wrapping your component? The closest <ServiceRegistry/> is ${serviceRegistryName}`
      )
    }

    const [state, setState] = React.useState<T>(getObservable(name).value)

    React.useEffect(() => {
      const observable = getObservable(name)
        .pipe(skip(1), delay(0), distinctUntilChanged())
        .subscribe((nextValue) => {
          setState(nextValue)
        })

      return () => observable.unsubscribe()
    }, [])

    return state as T
  }

  return [useService, { name, service }]
}
