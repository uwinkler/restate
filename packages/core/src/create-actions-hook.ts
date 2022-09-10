import { useContext, useEffect, useMemo } from 'react'
import { RxStoreContext } from './create-provider'
import { Message } from './message'
import { RxStore } from './rx-store'
import { isFunction } from './utils'

type ServiceImplementationReturn = { [name: string]: Function }
type ServiceImplementation<
  S,
  M extends Message,
  D extends ServiceImplementationReturn
> = (store: RxStore<S, M>) => D

interface ActionMessage extends Message {
  id: string
  args: any[]
}

export function createActionHooks<S, M extends Message>(
  provider: RxStoreContext<S, M>
) {
  return function createHook<D extends ServiceImplementationReturn>(
    serviceName: string,
    serviceImplementation: ServiceImplementation<S, M, D>
  ) {
    return function (): D {
      const store = useContext(provider)
      const serviceMethods = serviceImplementation(store)

      useEffect(() => {
        const storeSubscription = store.messageBus$.subscribe(
          async (message) => {
            const { type, args } = message as unknown as ActionMessage
            if (type.startsWith(serviceName + '/')) {
              const methodName = type.slice(serviceName.length + 1)
              const method = (serviceMethods as any)[methodName]

              if (isFunction(method)) {
                method.apply(undefined, args)
              }
            }
          }
        )

        function cleanup() {
          storeSubscription.unsubscribe()
        }

        return cleanup
      }, [store])

      return useMemo(
        () =>
          Object.keys(serviceMethods).reduce((prev, name) => {
            const fn = (...args: any) => {
              store.dispatch({
                type: serviceName + '/' + name,
                args: JSON.parse(JSON.stringify(args))
              } as any)
            }
            return { ...prev, [name]: fn }
          }, {} as D),
        [store]
      )
    }
  }
}
