import { createService } from './create-service'

const [ServiceRegistry, useServiceRegistry] = createService(
  'RestateServiceRegistry',
  () => {
    function registerImplementation(props: {
      implName: 'string'
      impl: () => any
    }) {}

    function useImplementation(serviceName, implName)
  }
)
