import { ServiceRegistry, useHook } from '@restate/di'
import React from 'react'
import { connectServiceDevTools } from './connectServiceDevTools'

const [useMyCounter, CounterService] = useHook('CounterService', () => {
  const [count, _setCount] = React.useState(0)

  React.useEffect(() => {
    const counterInterval = setInterval(() => _setCount(count + 1), 1000)
    return () => clearInterval(counterInterval)
  }, [count, setCount])

  function setCount(nextValue: number) {
    console.log(count, '->', nextValue)
    _setCount(nextValue)
  }

  return { count, setCount }
})

connectServiceDevTools()

function Counter() {
  const { count } = useMyCounter()

  const displayValue = count > 100 ? 'large' : count
  return <>Count is {displayValue}</>
}

function ResetButton() {
  const { setCount } = useMyCounter()
  return <button onClick={() => setCount(0)}>Reset</button>
}

export function HelloCounter() {
  return (
    <ServiceRegistry services={[CounterService]}>
      <Counter />
      <ResetButton />
    </ServiceRegistry>
  )
}
