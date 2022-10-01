import { createService } from './create-service'

const registry = new Map<string, Function>()

export const [ServiceRegistry, useServiceRegistry] = createService(
  'RestateServiceRegistry',
  () => {
    return {
      register: (name: string, service: Function) => {
        registry.set(name, service)
      },
      get: (name: string) => {
        return registry.get(name)
      },
      has: (name: string) => {
        return registry.has(name)
      }
    }
  }
)
