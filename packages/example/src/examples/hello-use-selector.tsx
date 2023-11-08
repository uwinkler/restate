import { create } from '@restate/core'

// We create our app state and a hook to access the state:
const { useAppState, useSelector } = create({
  state: {
    name: 'John',
    age: 32
  }
})

function Greeting() {
  const greeting = useSelector((s) =>
    s.age > 30 ? 'Good day Sir!' : `Hey there, ${s.name}!`
  )
  return <h1>{greeting}!</h1>
}

function AgeInput() {
  const [age, setAge] = useAppState((s) => s.age)
  return <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
}

function Hint() {
  return (
    <>
      <hr />
      <div>
        Try to set the age below 30 and observe how the computed greeting is
        changing.
      </div>
    </>
  )
}

export function HelloUseSelector() {
  return (
    <div className="layout">
      <Greeting />
      <AgeInput />
      <Hint />
    </div>
  )
}
