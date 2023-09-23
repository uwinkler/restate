import { createServiceRegistry, createService } from '@restate/di'
import React from 'react'

const [useMyCounter, CounterService] = createService({
  name: 'CounterService',
  service: () => {
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
  }
})

function Counter() {
  const { count } = useMyCounter()

  const displayValue = count > 100 ? 'large' : count
  return <>Count is {displayValue}</>
}

function ResetButton() {
  const { setCount } = useMyCounter()
  return <button onClick={() => setCount(0)}>Reset</button>
}

const ServiceRegistry = createServiceRegistry(
  [CounterService],
  'ServiceRegistry'
)

export function HelloCounter() {
  return (
    <ServiceRegistry>
      <Counter />
      <ResetButton />
    </ServiceRegistry>
  )
}
