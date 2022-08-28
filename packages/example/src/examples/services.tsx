import { createService, combineServiceProvider } from '@restate/di'
import React, { useContext } from 'react'

// Counter
function useCounterService() {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const counterInterval = setInterval(() => setCount(count + 1), 1000)
    return () => clearInterval(counterInterval)
  }, [count, setCount])

  return { count }
}

//
// Mock
//
function useMockCounterService() {
  return {
    count: 50
  }
}

// const MyCounterContext = React.createContext(useCounterService)
// const useMyCounterContext = () => useContext(MyCounterContext)

const [CounterServiceProvider, useMyCounter] = createService('CounterService', useCounterService)

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
