import React from 'react'
import renderer from 'react-test-renderer'
import { combineServiceProvider } from '../combine-services-provider'
import { createService } from '../create-service'

// Counter
function useCounterService() {
  const count = 12
  return { count }
}
const [CounterService, useMyCounter] = createService('CounterService', useCounterService)

const MyServices = combineServiceProvider(CounterService)

function Counter() {
  const { count } = useMyCounter()
  return <>Count is {count}</>
}

function useMyMockCounterService() {
  return { count: 0 }
}

const MockCountService = (props: any) => <CounterService implementation={useMyMockCounterService} {...props} />

test('it should use the default services', () => {
  const Component = (
    <MyServices>
      <Counter />
    </MyServices>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    Array [
      "Count is ",
      "12",
    ]
  `)
})

test('it should use the default services', () => {
  const Component = (
    <MyServices>
      <Counter />
    </MyServices>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    Array [
      "Count is ",
      "12",
    ]
  `)
})

test('it should use a moc', () => {
  const Component = (
    <MockCountService>
      <Counter />
    </MockCountService>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    Array [
      "Count is ",
      "0",
    ]
  `)
})

test('the mock should override a services', () => {
  function useMyMockCounterService() {
    return { count: 0 }
  }

  const MockCountService = (props: any) => <CounterService implementation={useMyMockCounterService} {...props} />

  const Component = (
    <MyServices>
      <MockCountService>
        <Counter />
      </MockCountService>
    </MyServices>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    Array [
      "Count is ",
      "0",
    ]
  `)
})

// test('it should throw if not wrapped in a service', () => {
//   const fn = () => renderer.create(<Counter />)
//   expect(fn).toThrow('nn')
// })
