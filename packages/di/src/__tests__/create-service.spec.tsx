import React from 'react'
import renderer from 'react-test-renderer'
import { createService } from '../create-service'
import { ServiceRegistry } from '../service-registry'

// Counter
function counterService() {
  const count = 12
  return { count }
}
const [useMyCounter, CounterService] = createService(
  'CounterService',
  counterService
)

const [useHello, HelloService] = createService('HelloService', () => {
  const { count } = useMyCounter()
  return 'Hello World. Count is ' + count
})

function Counter() {
  const { count } = useMyCounter()
  return <>Count is {count}</>
}

function Hello() {
  const message = useHello()
  return <>{message}</>
}

function mockCounterService() {
  return { count: 0 }
}

test('it should use a combined registry state', () => {
  const Component = (
    <ServiceRegistry
      name="ServiceRegistry"
      services={[CounterService, HelloService]}
    >
      <Counter />
      <Hello />
    </ServiceRegistry>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "12",
      "Hello World. Count is 12",
    ]
  `)
})

test('it should use a moc', () => {
  const Component = (
    <ServiceRegistry
      name="Service Registry"
      services={[
        CounterService,
        { name: 'CounterService', service: mockCounterService }
      ]}
    >
      <Counter />
    </ServiceRegistry>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "0",
    ]
  `)
})

test('it should use a moc if override is given - also nested', () => {
  const MockCounterService = {
    name: 'CounterService',
    service: mockCounterService
  }

  const Component = (
    <ServiceRegistry
      name="Parent-Service-Registry"
      services={[HelloService, CounterService]}
    >
      <Counter />
      <ServiceRegistry
        name="Nested-Service-Registry"
        services={[MockCounterService]}
      >
        <Counter />
      </ServiceRegistry>
    </ServiceRegistry>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "12",
      "Count is ",
      "0",
    ]
  `)
})

test('it should be able to use multiple service registries', () => {
  const Component = (
    <ServiceRegistry name="HelloServices" services={[HelloService]}>
      <ServiceRegistry name="CounterServices" services={[CounterService]}>
        <Counter />
        <Hello />
      </ServiceRegistry>
    </ServiceRegistry>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    [
      "Count is ",
      "12",
      "Hello World. Count is 12",
    ]
  `)
})

test('it should throw if not wrapped with a ServiceRegistry', () => {
  const container = () => renderer.create(<Counter />)
  expect(container).toThrow()
})
