import { create } from '@restate/core'

// We create our app state and a hook to access the state:
const { useAppState, useSelector } = create({
  state: {
    name: 'John',
    age: 32
  }
})

function Name() {
  // useSelector is a hook that takes a selector function
  // and returns the selected value. We can do some computation
  // in the selector function:
  const nameInUpperCase = useSelector((s) => s.name.toLocaleUpperCase())
  return <h1>Hello (in uppercase): {nameInUpperCase}!</h1>
}

function Greeting() {
  // useSelector is a hook that takes a selector function
  // and returns the selected value. We can do some computation
  // in the selector function:
  const greeting = useSelector((s) =>
    s.age > 30 ? 'Good day.' : 'Let`s party'
  )
  return <h1>{greeting}!</h1>
}

function AgeInput() {
  const [age, setAge] = useAppState((s) => s.age)
  return (
    <input
      value={age}
      onChange={(e) => setAge((s) => Number(e.target.value))}
    />
  )
}

export function HelloSelector() {
  return (
    <>
      <Greeting />
      <AgeInput />
    </>
  )
}
