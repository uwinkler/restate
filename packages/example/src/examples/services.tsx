import { createService, ServiceRegistry, useServiceRegistry } from '@restate/di'
import { Dashboard } from '@restate/di-dashboard'
import React from 'react'

const { useCounter, CounterService } = createService('Counter', () => {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const counterInterval = setInterval(() => setCount(count + 1), 1000)
    return () => clearInterval(counterInterval)
  }, [count])

  return { count }
})

const { useForm, FormService } = createService('Form', () => {
  const [value, setValue] = React.useState('')
  return { value, setValue }
})

function Counter() {
  const count = useCounter(({ count }) => (count > 5 ? 'large' : count))
  return <div>Count is {count}</div>
}

function Form() {
  const { value, setValue } = useForm()
  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}

export function HelloCounter() {
  return (
    <div>
      <ServiceRegistry>
        <Dashboard />
        <CounterService />
        <FormService />
        <h1>Counter Service</h1>
        <Counter />
        <hr />
        <RestoreButton />
        <Use100 />
        <Form />
      </ServiceRegistry>
    </div>
  )
}

function Use100() {
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
