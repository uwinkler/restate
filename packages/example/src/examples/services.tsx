import { createService, ServiceRegistry, useServiceRegistry } from '@restate/di'
import React from 'react'

const { CounterService, useCounterSelector } = createService('Counter', () => {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const counterInterval = setInterval(() => setCount(count + 1), 1000)
    return () => clearInterval(counterInterval)
  }, [count])

  return { count }
})

function Counter() {
  const count = useCounterSelector((s) => {
    return s.count > 10 ? 'large' : s.count
  })

  return <div>Count is {count}</div>
}

export function HelloCounter() {
  return (
    <div>
      <ServiceRegistry>
        <RestoreButton />
        <CounterService>
          <h1>Counter Service</h1>
          <Counter />
          <Deep />
        </CounterService>
        <Button />
      </ServiceRegistry>
    </div>
  )
}

function Deep() {
  return (
    <div>
      <Hello />
      <Counter />
    </div>
  )
}

function Hello() {
  return (
    <div style={{ margin: 20 }}>
      <button>Hello</button>
    </div>
  )
}

function Button() {
  const serviceRegistry = useServiceRegistry()

  const handleClick = () => {
    serviceRegistry.set('Counter', () => ({
      count: 101
    }))
  }

  return (
    <div>
      <button onClick={handleClick}>Set to 100</button>
    </div>
  )
}

function RestoreButton() {
  const serviceRegistry = useServiceRegistry()
  const handleClick = () => {
    serviceRegistry.restoreDefault('Counter')
  }
  return (
    <div>
      <button onClick={handleClick}>Restore</button>
    </div>
  )
}
