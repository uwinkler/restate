import { createService, ServiceRegistry, useServiceRegistry } from '@restate/di'
import React from 'react'

const { useCounter } = createService('Counter', () => {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const counterInterval = setInterval(() => setCount(count + 1), 1000)
    return () => clearInterval(counterInterval)
  }, [count])

  return { count }
})

function useLarge() {
  const c = useCounter()
  const [state, setState] = React.useState(sel())
  function sel() {
    return c.count > 100 ? 'large' : c.count
  }

  React.useEffect(() => {
    if (state != sel()) {
      setState(sel())
    }
  }, [c.count])

  return state
}

function Counter() {
  const d = useLarge()
  return <div>Count is {d}</div>
}

export function HelloCounter() {
  return (
    <div>
      <ServiceRegistry>
        <RestoreButton />
        <h1>Counter Service</h1>
        <Counter />
        <Deep />
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
