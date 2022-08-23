import React from 'react'
import renderer from 'react-test-renderer'
import { createServiceProvider } from '../create-provider'
import { createService } from '../create-service'

// Window
function useWindowService() {
  return { setInterval, clearInterval }
}
const [WindowService, useWindow] = createService('WindowService', useWindowService)

// Counter
function useCounterService() {
  const [count, setCount] = React.useState(0)
  const { setInterval, clearInterval } = useWindow()

  React.useEffect(() => {
    const counterInterval = setInterval(() => setCount(count + 1), 1000)
    return () => clearInterval(counterInterval)
  })

  return { count }
}
const [CounterService, useMyCounter] = createService('CounterService', useCounterService)

const MyServices = createServiceProvider(WindowService(), CounterService())

function Counter() {
  const { count } = useMyCounter()
  return <>Count is {count}</>
}

test('it should use the default services', () => {
  const Component = (
    <MyServices>
      <Counter />
    </MyServices>
  )

  const container = renderer.create(Component)

  expect(container.toJSON()).toMatchInlineSnapshot(`
    <button
      className="btn"
      onClick={[Function]}
    >
      1
    </button>
  `)
})
