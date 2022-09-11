import { createService } from '@restate/di'
import React from 'react'

const [CounterServiceProvider, useMyCounter] = createService(
  'CounterService',
  () => {
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
      const counterInterval = setInterval(() => setCount(count + 1), 1000)
      return () => clearInterval(counterInterval)
    }, [count, setCount])

    return { count }
  }
)

function Counter() {
  const { count } = useMyCounter()

  const displayValue = count > 100 ? 'large' : count
  return <>Count is {displayValue}</>
}

export function HelloCounter() {
  return (
    <CounterServiceProvider>
      <Counter />
    </CounterServiceProvider>
  )
}
